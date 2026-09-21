"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { Dialog } from "./dialog";

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
  className?: string;
};

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
  children,
  className,
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className={cn("max-w-md", className)}>
      <div className="space-y-4">
        <div>
          <h2 className={cn(
            "text-lg font-semibold",
            variant === "destructive" ? "text-red-400" : "text-[color:var(--b-text)]"
          )}>
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]">
              {description}
            </p>
          )}
        </div>
        {children}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] px-4 py-2 text-sm font-medium text-[color:var(--b-text)] transition-colors hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              variant === "destructive"
                ? "bg-red-500 text-[color:var(--b-text)] hover:bg-red-600"
                : "bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)] hover:bg-[color-mix(in_oklab,var(--b-accent)_90%,transparent)]"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
