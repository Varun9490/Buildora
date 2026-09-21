import React from 'react';
import { springs, springToLinear } from '@buildora/components';

export default function MotionDocsPage() {
  const renderedSprings = Object.entries(springs).map(([name, config]: [string, any]) => {
    const cssEaser = springToLinear(config);
    return (
      <div key={name} className="mb-12 border border-[color:var(--b-border)] p-6 rounded-2xl bg-[var(--b-panel)]">
        <h3 className="text-xl font-semibold mb-2 capitalize text-[color:var(--b-text)]">{name} Spring</h3>
        <div className="flex gap-4 mb-4 text-[color:var(--b-text-secondary)]">
          <span>Stiffness: {config.stiffness}</span>
          <span>Damping: {config.damping}</span>
          <span>Mass: {config.mass}</span>
        </div>
        <p className="text-sm mb-4 text-[color:var(--b-muted)]">
          <strong>CSS Linear Output:</strong> <code className="break-all text-xs bg-[var(--b-bg)] p-1 rounded">{cssEaser}</code>
        </p>
        <div className="mt-6 flex items-center gap-6 p-4 rounded-xl border border-[color:var(--b-border)]">
          <div className="w-16 h-16 rounded-2xl bg-[color:var(--b-accent)] transition-transform hover:translate-x-32" style={{ transitionTimingFunction: cssEaser, transitionDuration: '600ms' }}></div>
          <span className="text-[color:var(--b-muted)] text-sm ml-auto">Hover square to test</span>
        </div>
      </div>
    );
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-4 text-[color:var(--b-text)]">Motion & Springs</h1>
      <p className="text-lg text-[color:var(--b-text-secondary)] mb-12">
        Buildora's motion system is based on physics. Instead of standard easing curves, we use spring mathematics 
        to calculate natural movement. For CSS-only transitions, we automatically convert these springs into `linear()` functions.
      </p>
      
      <div className="grid gap-8">
        {renderedSprings}
      </div>
    </div>
  );
}
