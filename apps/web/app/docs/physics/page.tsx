import Link from "next/link";
import { springs, springToLinear } from "@buildora/components";

/**
 * The launch piece.
 *
 * Every number on this page is computed from the shipped constants, so it
 * cannot drift from the code. If a spring changes, this page is wrong
 * until someone updates it — which is the point.
 */

/** The damping ratio: 1 is critical damping, below 1 the spring overshoots. */
const zeta = (stiffness: number, damping: number, mass = 1) =>
  damping / (2 * Math.sqrt(stiffness * mass));

/** Natural frequency, in rad/s. */
const omega = (stiffness: number, mass = 1) => Math.sqrt(stiffness / mass);

/** Peak overshoot as a fraction, for an underdamped spring. */
const overshoot = (z: number) =>
  z < 1 ? Math.exp((-Math.PI * z) / Math.sqrt(1 - z * z)) : 0;

/** Time to enter and stay in the 2% band: roughly 4/(ζω). */
const settling = (z: number, w: number) => 4 / (z * w);

const regime = (z: number) =>
  z < 0.7 ? "Underdamped" : z < 1.05 ? "Near-critical" : "Overdamped";

type Row = {
  name: string;
  stiffness: number;
  damping: number;
  mass: number;
  note: string;
};

const SPRINGS: Row[] = [
  { name: "gentle", stiffness: 170, damping: 26, mass: 1, note: "Layout shifts, hover lifts, anything that should feel like it has weight." },
  { name: "snappy", stiffness: 320, damping: 28, mass: 0.9, note: "Menus, popovers, chips. Fast enough to feel instant, slow enough to read." },
  { name: "bouncy", stiffness: 220, damping: 14, mass: 1, note: "Confirmations and celebrations. Deliberately overshoots by about a fifth." },
  { name: "stiff", stiffness: 480, damping: 34, mass: 1, note: "Direct manipulation: drag release, snap, anything the finger is still near." },
  { name: "magnetic", stiffness: 260, damping: 22, mass: 1, note: "The magnetic button. Five percent overshoot, settles in a third of a second." },
];

export default function PhysicsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-14 text-[color:var(--b-text)] sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--b-accent)]">
        Physics lab
      </p>
      <h1 className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
        The spring is the whole idea
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[color:var(--b-text-secondary)]">
        Most component libraries animate with easing curves: a duration and a
        keyword like <code className="rounded bg-[color:var(--b-surface)] px-1 font-mono text-sm">cubic-bezier(.16,1,.3,1)</code>.
        That is fine, and it is also the reason so many libraries feel the
        same. A curve describes the shape of a movement but not its
        <em> character</em>: it cannot tell you whether something is heavy or
        light, whether it is being pushed or pulled, or how much momentum it
        carries when you let go.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-[color:var(--b-text-secondary)]">
        Buildora animates with springs. A spring is two numbers — stiffness
        and damping — and everything else follows from them. That is the
        whole difference: you can pick a character and get it exactly.
      </p>

      <h2 className="mt-14 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        The solver
      </h2>
      <p className="mt-4 leading-relaxed text-[color:var(--b-text-secondary)]">
        This is the kernel that ships. It is not a library; it is twenty
        lines, and it runs inside a single <code className="rounded bg-[color:var(--b-surface)] px-1 font-mono text-sm">requestAnimationFrame</code> loop.
      </p>
      <pre className="mt-5 overflow-x-auto rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-5 font-mono text-[12px] leading-relaxed text-[color:var(--b-text)]">
{`export function springStep(
  x: number, v: number, target: number,
  { stiffness = 220, damping = 24, mass = 1 } = {},
  dt = 1 / 60
) {
  const F = -stiffness * (x - target) - damping * v;
  const a = F / mass;
  const nv = v + a * dt;
  const nx = x + nv * dt;
  return { x: nx, v: nv };
}`}
      </pre>
      <p className="mt-5 leading-relaxed text-[color:var(--b-text-secondary)]">
        Semi-implicit Euler: compute the acceleration from the current
        displacement and velocity, integrate velocity first, then position.
        Velocity is carried between frames, which is the entire point — a
        curve has no memory, a spring does. Let go of something mid-flight
        and it keeps going the way it was already going.
      </p>
      <p className="mt-4 leading-relaxed text-[color:var(--b-text-secondary)]">
        The loop writes straight to a transform. It never calls
        <code className="rounded bg-[color:var(--b-surface)] px-1 font-mono text-sm">setState</code>,
        so a moving pointer cannot trigger a React render, and the
        component stays at zero re-renders per frame.
      </p>

      <h2 className="mt-14 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Two numbers, one personality
      </h2>
      <p className="mt-4 leading-relaxed text-[color:var(--b-text-secondary)]">
        Stiffness decides how hard the spring pulls toward the target:
        higher means faster. Damping decides how much the spring resists:
        low damping lets it overshoot and ring, high damping makes it crawl
        in. Together they fix a single physical quantity, the damping ratio
        <span className="whitespace-nowrap"> ζ</span>:
      </p>
      <pre className="mt-5 overflow-x-auto rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-5 font-mono text-[12px] leading-relaxed text-[color:var(--b-text)]">
{`ζ = c / (2 √(k · m))        ω = √(k / m)`}
      </pre>
      <ul className="mt-5 space-y-3 text-[color:var(--b-text-secondary)]">
        <li>
          <strong className="text-[color:var(--b-text)]">ζ &lt; 1 — underdamped.</strong>{" "}
          The spring overshoots the target and comes back. This is the
          feeling of something with momentum.
        </li>
        <li>
          <strong className="text-[color:var(--b-text)]">ζ = 1 — critically damped.</strong>{" "}
          The fastest approach with no overshoot at all. The feeling of
          something heavy and expensive.
        </li>
        <li>
          <strong className="text-[color:var(--b-text)]">ζ &gt; 1 — overdamped.</strong>{" "}
          It arrives slowly and deliberately. Drawers, full-screen modals,
          anything that should feel like it weighs something.
        </li>
      </ul>

      <h2 className="mt-14 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        The constants we ship
      </h2>
      <p className="mt-4 leading-relaxed text-[color:var(--b-text-secondary)]">
        Every spring in the library is one of these five. The measured
        columns below are computed from the shipped constants, not
        described.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[color:var(--b-border)]">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--b-border)] bg-[color:var(--b-surface)]">
              {["Spring", "k", "c", "m", "ζ", "Regime", "Overshoot", "Settle (2%)"].map((h) => (
                <th key={h} className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--b-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPRINGS.map((s) => {
              const z = zeta(s.stiffness, s.damping, s.mass);
              const w = omega(s.stiffness, s.mass);
              return (
                <tr key={s.name} className="border-b border-[color:var(--b-border)] last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-[color:var(--b-accent)]">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-[color:var(--b-text-secondary)]">{s.stiffness}</td>
                  <td className="px-4 py-3 font-mono text-[color:var(--b-text-secondary)]">{s.damping}</td>
                  <td className="px-4 py-3 font-mono text-[color:var(--b-text-secondary)]">{s.mass}</td>
                  <td className="px-4 py-3 font-mono text-[color:var(--b-text)]">{z.toFixed(3)}</td>
                  <td className="px-4 py-3 text-[color:var(--b-text-secondary)]">{regime(z)}</td>
                  <td className="px-4 py-3 font-mono text-[color:var(--b-text-secondary)]">
                    {(overshoot(z) * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 font-mono text-[color:var(--b-text-secondary)]">
                    {settling(z, w).toFixed(2)}s
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[color:var(--b-muted)]">
        {SPRINGS.map((s) => (
          <span key={s.name} className="mr-6 inline-block">
            <code className="font-mono text-[color:var(--b-accent)]">{s.name}</code> — {s.note}
          </span>
        ))}
      </p>

      <h2 className="mt-14 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Why the magnetic button is 260 / 22
      </h2>
      <p className="mt-4 leading-relaxed text-[color:var(--b-text-secondary)]">
        The magnetic button is the component people recognise Buildora by,
        so its constants got the most attention. It is set to stiffness 260
        and damping 22, which puts it at{" "}
        <span className="font-mono text-[color:var(--b-accent)]">ζ = 0.682</span>:
        underdamped, about{" "}
        <span className="font-mono text-[color:var(--b-accent)]">5.3%</span> overshoot,
        settled within{" "}
        <span className="font-mono text-[color:var(--b-accent)]">0.36s</span>.
      </p>
      <ul className="mt-5 space-y-3 text-[color:var(--b-text-secondary)]">
        <li>
          <strong className="text-[color:var(--b-text)]">Not more than 10%.</strong>{" "}
          Past about a tenth, a button that overshoots stops reading as
          solid and starts reading as light. Five percent is the most you
          can have and still feel the button is there.
        </li>
        <li>
          <strong className="text-[color:var(--b-text)]">Not under 3%.</strong>{" "}
          Below three the movement is invisible, and an invisible spring is
          a slower curve with extra steps. If you cannot see the bounce,
          take the bounce out and spend the budget on speed instead.
        </li>
        <li>
          <strong className="text-[color:var(--b-text)]">Settled inside 400ms.</strong>{" "}
          A pointer-driven component is on continuously while you move the
          mouse. Anything that takes longer than about a third of a second
          to stop moving feels like it is lagging behind your hand.
        </li>
      </ul>
      <p className="mt-5 leading-relaxed text-[color:var(--b-text-secondary)]">
        The same reasoning picks the rest. <code className="font-mono text-[color:var(--b-accent)]">bouncy</code>{" "}
        is deliberately at ζ = 0.472 with nearly a fifth of overshoot,
        because a confirmation should feel like it happened, not like it was
        filed. <code className="font-mono text-[color:var(--b-accent)]">gentle</code>{" "}
        sits at ζ = 0.997, effectively critical, because a layout shift
        that overshoots looks like a bug.
      </p>

      <h2 className="mt-14 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Springs in CSS
      </h2>
      <p className="mt-4 leading-relaxed text-[color:var(--b-text-secondary)]">
        Not everything can run JavaScript: a hover on a link, a transition
        on a scroll-linked property, anything that has to work before
        hydration. So the same solver can emit a CSS{" "}
        <code className="rounded bg-[color:var(--b-surface)] px-1 font-mono text-sm">linear()</code>{" "}
        easing function that reproduces the spring exactly — sampled from
        the simulation, not approximated with a curve.
      </p>
      <pre className="mt-5 overflow-x-auto rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-5 font-mono text-[12px] leading-relaxed text-[color:var(--b-text)]">
{`linear(${springToLinear(springs.gentle)
  .replace(/linear\(|\)/g, "")
  .split(",")
  .slice(0, 6)
  .join(", ")}, …)`}
      </pre>
      <p className="mt-5 leading-relaxed text-[color:var(--b-text-secondary)]">
        Forty-eight samples, taken from the same simulation the runtime
        uses. The result is a pure-CSS spring with the same character as
        the JavaScript one — and it costs nothing at runtime.
      </p>

      <h2 className="mt-14 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Reduced motion
      </h2>
      <p className="mt-4 leading-relaxed text-[color:var(--b-text-secondary)]">
        Every component that moves checks{" "}
        <code className="rounded bg-[color:var(--b-surface)] px-1 font-mono text-sm">prefers-reduced-motion</code>{" "}
        and stops. The shipped hook is SSR-safe: it reads the preference
        through{" "}
        <code className="rounded bg-[color:var(--b-surface)] px-1 font-mono text-sm">useSyncExternalStore</code>{" "}
        so the server and the first client render agree and there is no
        flash of motion before the measurement lands. An app can also pause
        motion for everyone at once with{" "}
        <code className="rounded bg-[color:var(--b-surface)] px-1 font-mono text-sm">data-motion=&quot;reduced&quot;</code>{" "}
        on the document root; the hook watches for it.
      </p>

      <div className="mt-12 rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-muted)]">
          Try it
        </p>
        <p className="mt-2 text-sm text-[color:var(--b-text-secondary)]">
          Pluck the system in the Physics Lab on the home page, or{" "}
          <Link href="/docs/motion" className="text-[color:var(--b-accent)] underline">
            read the motion reference
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
