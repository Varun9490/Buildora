import { allComponents } from "@/lib/registry";
import { ComponentDetail } from "./detail";

export function generateStaticParams() {
  return allComponents.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const c = allComponents.find((x) => x.slug === params.slug);
  return { title: c ? `${c.name} — Buildora` : "Component — Buildora", description: c?.description };
}

export default function Page({ params }: { params: { slug: string } }) {
  return <ComponentDetail slug={params.slug} />;
}
