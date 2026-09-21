"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type TypewriterProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string | string[];
  speed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string;
};

function Typewriter({
  text,
  speed = 50,
  delay = 1000,
  loop = true,
  cursor = true,
  cursorChar = "|",
  className,
  ...props
}: TypewriterProps) {
  const [displayText, setDisplayText] = React.useState("");
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [textArrayIndex, setTextArrayIndex] = React.useState(0);

  const texts = Array.isArray(text) ? text : [text];

  React.useEffect(() => {
    const currentText = texts[textArrayIndex] || "";

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < currentText.length) {
          setDisplayText(currentText.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), delay);
        }
      } else {
        if (currentIndex > 0) {
          setDisplayText(currentText.slice(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        } else {
          setIsDeleting(false);
          if (textArrayIndex < texts.length - 1) {
            setTextArrayIndex(textArrayIndex + 1);
          } else if (loop) {
            setTextArrayIndex(0);
          }
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textArrayIndex, texts, speed, delay, loop]);

  return (
    <span className={cn("inline-flex", className)} {...props}>
      <span>{displayText}</span>
      {cursor && (
        <span className="animate-pulse">{cursorChar}</span>
      )}
    </span>
  );
}

export type ScrambledTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  speed?: number;
  scrambleChars?: string;
  trigger?: "mount" | "hover" | "inView";
};

function ScrambledText({
  text,
  speed = 30,
  scrambleChars = "!@#$%^&*()_+-=[]{}|;:,.<>?",
  trigger = "mount",
  className,
  ...props
}: ScrambledTextProps) {
  const [displayText, setDisplayText] = React.useState("");
  const [isScrambling, setIsScrambling] = React.useState(trigger === "mount");
  const ref = React.useRef<HTMLSpanElement>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const scramble = React.useCallback(() => {
    let iteration = 0;
    const maxIterations = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === " ") return " ";
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsScrambling(false);
      }
      iteration += 1 / 3;
    }, speed);
  }, [text, speed, scrambleChars]);

  React.useEffect(() => {
    if (trigger === "mount") {
      scramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, scramble]);

  const handleMouseEnter = () => {
    if (trigger === "hover" && !isScrambling) {
      setIsScrambling(true);
      scramble();
    }
  };

  React.useEffect(() => {
    if (trigger === "inView" && ref.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isScrambling) {
              setIsScrambling(true);
              scramble();
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [trigger, isScrambling, scramble]);

  return (
    <span
      ref={ref}
      className={cn("inline-block", className)}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {displayText || text}
    </span>
  );
}

export type BlurTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  delay?: number;
  direction?: "top" | "bottom";
  animateBy?: "word" | "char";
};

function BlurText({
  text,
  delay = 50,
  direction = "bottom",
  animateBy = "word",
  className,
  ...props
}: BlurTextProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const items = animateBy === "word" ? text.split(" ") : text.split("");

  return (
    <span ref={ref} className={cn("inline-flex flex-wrap", className)} {...props}>
      {items.map((item, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-500"
          style={{
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? "blur(0px)" : "blur(10px)",
            transform: isVisible
              ? "translateY(0)"
              : `translateY(${direction === "bottom" ? "20px" : "-20px"})`,
            transitionDelay: `${index * delay}ms`,
          }}
        >
          {item}
          {animateBy === "word" && index < items.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

export type GradientTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  colors?: string[];
  animationDuration?: number;
};

function GradientText({
  colors = ["#d4ff4f", "#9d8cff", "#ffffff", "#d4ff4f"],
  animationDuration = 8,
  className,
  children,
  ...props
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
    backgroundSize: `${colors.length * 50}% auto`,
    animation: `gradient-shift ${animationDuration}s linear infinite`,
  };

  return (
    <span
      className={cn("bg-clip-text text-transparent", className)}
      style={gradientStyle}
      {...props}
    >
      {children}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </span>
  );
}

export type GlitchTextProps = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  intensity?: "low" | "medium" | "high";
};

function GlitchText({
  text,
  intensity = "medium",
  className,
  ...props
}: GlitchTextProps) {
  const intensityValues = {
    low: { skew: 20, duration: 4 },
    medium: { skew: 40, duration: 2 },
    high: { skew: 80, duration: 1 },
  };

  const { skew, duration } = intensityValues[intensity];

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <span className="relative z-10">{text}</span>
      <span
        className="absolute inset-0 -z-10 text-red-500 opacity-70"
        style={{
          clipPath: `inset(${skew}% 0 ${skew}% 0)`,
          animation: `glitch-1 ${duration}s infinite`,
          transform: "translateX(-2px)",
        }}
        aria-hidden="true"
      >
        {text}
      </span>
      <span
        className="absolute inset-0 -z-10 text-cyan-500 opacity-70"
        style={{
          clipPath: `inset(${100 - skew}% 0 ${100 - skew}% 0)`,
          animation: `glitch-2 ${duration}s infinite`,
          transform: "translateX(2px)",
        }}
        aria-hidden="true"
      >
        {text}
      </span>
      <style jsx global>{`
        @keyframes glitch-1 {
          0%, 100% { clip-path: inset(40% 0 60% 0); opacity: 0.5; }
          20% { clip-path: inset(92% 0 1% 0); opacity: 0.7; }
          40% { clip-path: inset(43% 0 1% 0); opacity: 0.3; }
          60% { clip-path: inset(25% 0 58% 0); opacity: 0.6; }
          80% { clip-path: inset(54% 0 7% 0); opacity: 0.4; }
        }
        @keyframes glitch-2 {
          0%, 100% { clip-path: inset(50% 0 30% 0); opacity: 0.6; }
          20% { clip-path: inset(7% 0 85% 0); opacity: 0.4; }
          40% { clip-path: inset(89% 0 3% 0); opacity: 0.7; }
          60% { clip-path: inset(23% 0 69% 0); opacity: 0.5; }
          80% { clip-path: inset(2% 0 91% 0); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export { Typewriter, ScrambledText, BlurText, GradientText, GlitchText };
