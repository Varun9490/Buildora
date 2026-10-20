"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

export type UnifiedLoginFieldProps = React.FormHTMLAttributes<HTMLFormElement> & {
  onSubmit?: (data: { email: string; password: string }) => void | Promise<void>;
  emailLabel?: string;
  passwordLabel?: string;
  submitError?: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * UnifiedLoginField — one bordered container that morphs between the email
 * and password stage instead of juggling two boxes. Invalid email shakes
 * into its error text; Escape returns to the email stage; everything is
 * labelled for AT.
 */
export function UnifiedLoginField({
  onSubmit,
  emailLabel = "Email",
  passwordLabel = "Password",
  submitError,
  className,
  ...rest
}: UnifiedLoginFieldProps) {
  const reduced = useReducedMotion();
  const [stage, setStage] = React.useState<"email" | "password">("email");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [shaking, setShaking] = React.useState(false);
  const emailRef = React.useRef<HTMLInputElement | null>(null);
  const pwRef = React.useRef<HTMLInputElement | null>(null);
  const idp = React.useId();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stage === "email") {
      if (!EMAIL_RE.test(email)) {
        setEmailError("Enter a valid email address");
        if (!reduced) {
          setShaking(true);
          window.setTimeout(() => setShaking(false), 420);
        }
        return;
      }
      setEmailError(null);
      setStage("password");
      window.setTimeout(() => pwRef.current?.focus(), 30);
      return;
    }
    if (!password) {
      pwRef.current?.focus();
      return;
    }
    await onSubmit?.({ email, password });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && stage === "password") {
      setStage("email");
      window.setTimeout(() => emailRef.current?.focus(), 30);
    }
  };

  return (
    <form onSubmit={submit} onKeyDown={onKey} className={cn("w-full max-w-sm", className)} noValidate {...rest}>
      <motion.div
        className={cn(
          "relative flex items-center gap-2 overflow-hidden rounded-2xl border bg-[color:var(--b-surface)] px-4",
          "transition-colors",
          "border-[color:var(--b-border)] focus-within:border-[color:var(--b-accent)]",
          emailError && "border-[color:var(--b-danger)]",
          submitError && "border-[color:var(--b-danger)]"
        )}
        animate={
          reduced
            ? undefined
            : shaking
              ? { x: [0, -7, 6, -4, 3, 0] }
              : { x: 0 }
        }
        transition={shaking ? { duration: 0.42 } : undefined}
      >
        <span className="h-11 w-11 shrink-0" aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            {stage === "email" ? (
              <motion.svg
                key="mail"
                initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -14, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 12, scale: 0.8 }}
                transition={{ duration: 0.24 }}
                className="mx-auto mt-3.5"
                width="18"
                height="18"
                viewBox="0 0 20 16"
                fill="none"
                stroke="var(--b-muted)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="1" width="18" height="14" rx="2.5" />
                <path d="m2 3.5 8 6 8-6" />
              </motion.svg>
            ) : (
              <motion.svg
                key="lock"
                initial={reduced ? { opacity: 0 } : { opacity: 0, rotate: -14, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, rotate: 12, scale: 0.8 }}
                transition={{ duration: 0.24 }}
                className="mx-auto mt-3.5"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="var(--b-muted)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3.5" y="8.5" width="13" height="9.5" rx="2" />
                <path d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>

        <div className="relative min-w-0 flex-1" style={{ height: 48 }}>
          <AnimatePresence initial={false} mode="popLayout">
            {stage === "email" ? (
              <motion.div
                key="email"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 flex items-center"
              >
                <label htmlFor={`${idp}-email`} className="sr-only">{emailLabel}</label>
                <input
                  id={`${idp}-email`}
                  ref={emailRef}
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  aria-invalid={!!emailError}
                  className="w-full bg-transparent text-sm font-medium text-[color:var(--b-text)] outline-none placeholder:text-[color:var(--b-muted)]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="password"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.22 }}
                className="absolute inset-0 flex items-center"
              >
                <label htmlFor={`${idp}-pw`} className="sr-only">{passwordLabel}</label>
                <input
                  id={`${idp}-pw`}
                  ref={pwRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={passwordLabel}
                  className="w-full bg-transparent text-sm font-medium tracking-wide text-[color:var(--b-text)] outline-none placeholder:tracking-normal placeholder:text-[color:var(--b-muted)]"
                />
                <button
                  type="button"
                  onClick={() => setStage("email")}
                  className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[color:var(--b-muted)] hover:text-[color:var(--b-text)]"
                  aria-label={`Back to ${emailLabel.toLowerCase()}`}
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 3.5 5.5 8 10 12.5" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)] outline-none transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2"
          whileTap={reduced ? undefined : { scale: 0.92 }}
          whileHover={reduced ? undefined : { scale: 1.06 }}
          aria-label={stage === "email" ? "Continue" : "Sign in"}
        >
          <motion.svg
            key={stage}
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? undefined : { rotate: stage === "password" ? -90 : 0, scale: 0.7 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.35, duration: 0.4 }}
          >
            {stage === "email" ? <path d="M2.5 8h10m0 0L9 4.5M12.5 8 9 11.5" /> : <path d="m3 8.6 3.2 3.4L13.5 4.8" />}
          </motion.svg>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {(emailError || submitError) && (
          <motion.p
            key="err"
            role="alert"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 pl-1 text-xs font-medium text-[color:var(--b-danger)]"
          >
            {emailError ?? submitError}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

export default UnifiedLoginField;
