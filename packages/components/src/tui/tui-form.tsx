"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUIFormField {
  name: string;
  label: string;
  type: "text" | "number" | "password" | "select" | "checkbox";
  value: string | boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface TUIFormProps {
  fields: TUIFormField[];
  onChange?: (name: string, value: string | boolean) => void;
  onSubmit?: (data: Record<string, string | boolean>) => void;
  className?: string;
  showLabels?: boolean;
  labelWidth?: string;
}

export function TUIForm({
  fields,
  onChange,
  onSubmit,
  className,
  showLabels = true,
  labelWidth = "24",
}: TUIFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const data: Record<string, string | boolean> = {};
      fields.forEach((f) => {
        data[f.name] = f.value;
      });
      onSubmit(data);
    }
  };

  return (
    <form
      ref={formRef}
      className={cn("font-mono text-xs bg-[#0a0c10] overflow-auto", className)}
      onSubmit={handleSubmit}
    >
      <div className="divide-y divide-[color-mix(in_oklab,var(--b-border)_5%,transparent)]">
        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-2 px-3 py-2">
            {showLabels && (
              <label
                htmlFor={field.name}
                className="text-[color-mix(in_oklab,var(--b-text)_50%,transparent)] shrink-0"
                style={{ width: `${labelWidth}ch` }}
              >
                {field.label}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
              </label>
            )}
            <div className="flex-1 min-w-0">
              {field.type === "checkbox" ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={field.value as boolean}
                    disabled={field.disabled}
                    onChange={(e) => onChange?.(field.name, e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[color-mix(in_oklab,var(--b-border)_20%,transparent)] bg-transparent accent-cyan-500"
                  />
                  <span className="text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] text-[11px]">{field.label}</span>
                </label>
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={field.value as string}
                  disabled={field.disabled}
                  onChange={(e) => onChange?.(field.name, e.target.value)}
                  className="w-full px-2 py-1 bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] rounded text-[color-mix(in_oklab,var(--b-text)_80%,transparent)] outline-none focus:border-cyan-500/50 disabled:opacity-50"
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={field.value as string}
                  disabled={field.disabled}
                  placeholder={field.placeholder}
                  onChange={(e) => onChange?.(field.name, e.target.value)}
                  className="w-full px-2 py-1 bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] rounded text-[color-mix(in_oklab,var(--b-text)_80%,transparent)] outline-none focus:border-cyan-500/50 disabled:opacity-50 placeholder:text-[color-mix(in_oklab,var(--b-text)_20%,transparent)]"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
