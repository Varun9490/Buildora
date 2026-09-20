"use client";

import * as React from "react";
import { cn } from "../utils";
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
            variant === "destructive" ? "text-red-400" : "text-white"
          )}>
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-white/60">
              {description}
            </p>
          )}
        </div>
        {children}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              variant === "destructive"
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-[--b-accent] text-[--b-accent-foreground] hover:bg-[#d4ff4f]/90"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
