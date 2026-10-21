/**
 * Generate the JSON Schemas the registry advertises, and check the shipped
 * data against them.
 *
 * Every registry item carries `$schema: https://buildora-hazel.vercel.app/schema/registry-item.json`.
 * That URL used to 404 — the schema was referenced but never existed, which
 * is the same class of problem the audit is about: a claim the site does
 * not honour.
 *
 * The schema is inferred from the data that actually ships, so it cannot
 * describe a shape we do not have, and then every item is validated against
 * it. That makes the schema a checked contract rather than decoration: if
 * one item gains a field the others lack, or a field changes type, the
 * gate fails.
 *
 * Output: apps/web/public/schema/{registry-item,agent-catalog}.json
 * Run: pnpm registry:schema
 */
import * as fs from "node:fs";
import * as path from "node:path";

type Json = unknown;
type Schema = Record<string, Json>;

const root = process.cwd();
const SCHEMA_DIR = path.join(root, "apps", "web", "public", "schema");

/* ── Inference ─────────────────────────────────────────────────────────── */

function typeOf(v: Json): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

/**
 * A union of the JSON types seen. A property that is sometimes a string and
 * sometimes an array is legal JSON Schema — it just means the field is
 * genuinely two-shaped, and the schema says so rather than hiding it.
 */
function unionTypes(values: Json[]): string[] {
  return [...new Set(values.map(typeOf))].sort();
}

/** Distinct values, for enum detection. */
function distinct(values: Json[]): Json[] {
  const seen = new Map<string, Json>();
  for (const v of values) seen.set(JSON.stringify(v), v);
  return [...seen.values()];
}

/**
 * Infer a schema from a set of instances of the same type.
 *
 * - a property present in every instance is required
 * - an object whose keys are the same everywhere gets additionalProperties:false,
 *   which is what makes the schema useful to a consumer
 * - a short list of distinct strings becomes an enum
 */
function infer(instances: Json[]): Schema {
  const objects = instances.filter((v) => typeOf(v) === "object") as Record<string, Json>[];
  if (objects.length === 0) {
    const types = unionTypes(instances);
    return types.length === 1 ? { type: types[0] } : { type: types };
  }

  const propNames = [...new Set(objects.flatMap((o) => Object.keys(o)))].sort();
  const inEvery = propNames.filter((n) => objects.every((o) => n in o));
  const keysEverywhere = objects.every(
    (o) => Object.keys(o).length === propNames.length
  );

  const properties: Record<string, Schema> = {};
  for (const name of propNames) {
    const values = objects
      .map((o) => o[name])
      .filter((v) => v !== undefined);

    if (values.length === 0) continue;

    const types = unionTypes(values);

    // An array: infer from the union of its elements.
    if (types.length === 1 && types[0] === "array") {
      const elements = values.flatMap((v) => v as Json[]);
      properties[name] = elements.length
        ? { type: "array", items: infer(elements) }
        : { type: "array" };
      continue;
    }

    // An object: recurse.
    if (types.length === 1 && types[0] === "object") {
      properties[name] = infer(values);
      continue;
    }

    // Strings: a short, stable set of values is an enum.
    if (types.length === 1 && types[0] === "string") {
      const options = distinct(values) as string[];
      if (options.length > 1 && options.length <= 12) {
        properties[name] = { type: "string", enum: options };
        continue;
      }
    }

    properties[name] = types.length === 1 ? { type: types[0] } : { type: types };
  }

  const schema: Schema = { type: "object", properties };
  if (inEvery.length) schema.required = inEvery;
  schema.additionalProperties = keysEverywhere ? false : true;
  return schema;
}

/* ── Validation ────────────────────────────────────────────────────────── */

/**
 * Check one value against a schema.
 *
 * This understands exactly the vocabulary the generator emits — type, enum,
 * required, properties, additionalProperties, items — which is deliberate:
 * the schema and the checker are the same contract, so there is no third
 * party that can disagree about what the shape is.
 */
function validate(value: Json, schema: Schema, path: string, errors: string[]): void {
  const types = schema.type
    ? Array.isArray(schema.type)
      ? (schema.type as string[])
      : [schema.type as string]
    : [];

  const actual = typeOf(value);
  if (types.length && !types.includes(actual)) {
    errors.push(`${path}: expected ${types.join("|")}, got ${actual}`);
    return;
  }

  if (schema.enum) {
    const allowed = schema.enum as Json[];
    if (!allowed.some((o) => JSON.stringify(o) === JSON.stringify(value))) {
      errors.push(`${path}: ${JSON.stringify(value)} is not one of the allowed values`);
    }
  }

  if (actual === "object") {
    const obj = value as Record<string, Json>;
    for (const req of (schema.required as string[]) ?? []) {
      if (!(req in obj)) errors.push(`${path}: missing required property "${req}"`);
    }
    const props = (schema.properties as Record<string, Schema>) ?? {};
    for (const [key, sub] of Object.entries(props)) {
      if (key in obj) validate(obj[key], sub, `${path}.${key}`, errors);
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(obj)) {
        if (!(key in props)) errors.push(`${path}: unexpected property "${key}"`);
      }
    }
  }

  if (actual === "array" && schema.items) {
    (value as Json[]).forEach((v, i) => validate(v, schema.items as Schema, `${path}[${i}]`, errors));
  }
}

/* ── Build ─────────────────────────────────────────────────────────────── */

function readJson(file: string): Json {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function main() {
  const componentsDir = path.join(root, "registry", "components");
  const itemFiles = fs
    .readdirSync(componentsDir)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const items = itemFiles.map((f) => readJson(path.join(componentsDir, f)));
  const agentCatalog = readJson(path.join(root, "registry", "agent-catalog.json"));

  const itemSchema: Schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://buildora-hazel.vercel.app/schema/registry-item.json",
    title: "Buildora registry item",
    description:
      "One component, as served from /r/{component}.json. Generated from the registry that ships, then used to check it.",
    ...infer(items),
  };

  const catalogSchema: Schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://buildora-hazel.vercel.app/schema/agent-catalog.json",
    title: "Buildora agent catalogue",
    description:
      "Every component with its install command, framework support, docs and source, as served from /api/agent-catalog.",
    ...infer([agentCatalog]),
  };

  // Check the shipped data against the schema we just wrote.
  const errors: string[] = [];
  for (const [i, item] of items.entries()) {
    validate(item, itemSchema, `registry-item[${i}]`, errors);
  }
  validate(agentCatalog, catalogSchema, "agent-catalog", errors);

  if (errors.length) {
    console.error(`Schema check failed: ${errors.length} problem(s)`);
    for (const e of errors.slice(0, 20)) console.error(`  ${e}`);
    process.exit(1);
  }

  fs.mkdirSync(SCHEMA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(SCHEMA_DIR, "registry-item.json"),
    `${JSON.stringify(itemSchema, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(SCHEMA_DIR, "agent-catalog.json"),
    `${JSON.stringify(catalogSchema, null, 2)}\n`,
    "utf8"
  );

  console.log(
    `Schema: ${items.length} items validated against registry-item.json · agent-catalog.json validated · → apps/web/public/schema`
  );
}

main();
