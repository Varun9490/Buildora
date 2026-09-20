"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

const ToastContext = React.createContext<{
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
} | null>(null);

export type ToastData = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

export type ToastVariant = "default" | "success" | "warning" | "danger" | "accent";

let toastIdCounter = 0;

export type ToastProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
};

const ToastProvider = React.forwardRef<HTMLDivElement, ToastProviderProps>(
  ({ className, position = "bottom-right", children, ...props }, ref) => {
    const [toasts, setToasts] = React.useState<ToastData[]>([]);

    const addToast = React.useCallback((toast: Omit<ToastData, "id">) => {
      const id = `toast-${++toastIdCounter}`;
      const newToast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);
      return id;
    }, []);

    const removeToast = React.useCallback((id: string) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const positionStyles: Record<string, string> = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    };

    return (
      <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
        {children}
        <div
          ref={ref}
          className={cn(
            "fixed z-50 flex flex-col gap-2 pointer-events-none",
            positionStyles[position],
            className
          )}
          {...props}
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
      </ToastContext.Provider>
    );
  }
);

ToastProvider.displayName = "ToastProvider";

const Toast = React.forwardRef<HTMLDivElement, ToastData>(
  ({ id, title, description, variant = "default", duration = 5000 }, ref) => {
    const context = React.useContext(ToastContext);

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          context?.removeToast(id);
        }, duration);
        return () => clearTimeout(timer);
      }
    }, [id, duration, context]);

    const variantStyles: Record<ToastVariant, string> = {
      default: "bg-white/10 border-white/10 text-white",
      success: "bg-[#4fe08a]/10 border-[#4fe08a]/20 text-[--b-success]",
      warning: "bg-[#ffb86b]/10 border-[#ffb86b]/20 text-[#ffb86b]",
      danger: "bg-red-500/10 border-red-500/20 text-red-400",
      accent: "bg-[#d4ff4f]/10 border-[#d4ff4f]/20 text-[--b-accent]",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "pointer-events-auto w-80 rounded-xl border p-4 shadow-lg",
          "animate-in slide-in-from-bottom-4 fade-in duration-300",
          "flex items-start gap-3",
          variantStyles[variant]
        )}
      >
        <div className="flex-1">
          <div className="text-sm font-medium">{title}</div>
          {description && (
            <div className="mt-1 text-xs opacity-80">{description}</div>
          )}
        </div>
        <button
          onClick={() => context?.removeToast(id)}
          className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }
);

Toast.displayName = "Toast";

export type UseToastReturn = {
  toast: (options: Omit<ToastData, "id">) => string;
  dismiss: (id: string) => void;
};

function useToast(): UseToastReturn {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");

  return {
    toast: context.addToast,
    dismiss: context.removeToast,
  };
}

export { ToastProvider, Toast, useToast };
