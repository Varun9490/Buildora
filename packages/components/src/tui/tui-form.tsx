"use client";

import * as React from "react";
import { cn } from "../utils";

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
      <div className="divide-y divide-white/5">
        {fields.map((field) => (
          <div key={field.name} className="flex items-center gap-2 px-3 py-2">
            {showLabels && (
              <label
                htmlFor={field.name}
                className="text-white/50 shrink-0"
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
                    className="w-3.5 h-3.5 rounded border-white/20 bg-transparent accent-cyan-500"
                  />
                  <span className="text-white/70 text-[11px]">{field.label}</span>
                </label>
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={field.value as string}
                  disabled={field.disabled}
                  onChange={(e) => onChange?.(field.name, e.target.value)}
                  className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white/80 outline-none focus:border-cyan-500/50 disabled:opacity-50"
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
                  className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-white/80 outline-none focus:border-cyan-500/50 disabled:opacity-50 placeholder:text-white/20"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
