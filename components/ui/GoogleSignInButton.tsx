"use client";

import { signIn } from "next-auth/react";
import GoogleIcon from "./GoogleIcon";
import { cn } from "@/lib/utils";

export interface GoogleSignInButtonProps {
  onClick?: () => void;
  callbackUrl?: string;
  text?: "Continue with Google" | "Sign in with Google";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  testId?: string;
  "data-testid"?: string;
}

/**
 * Standard Google Sign-In Button compliant with Google Identity Services branding guidelines:
 * - Multicolor G logo on official neutral/white surface (never on tinted brand backgrounds)
 * - Approved text strings ("Continue with Google" or "Sign in with Google")
 * - Correct typography, padding, borders, and dark-mode adaptation.
 */
export default function GoogleSignInButton({
  onClick,
  callbackUrl = "/calculators",
  text = "Continue with Google",
  size = "md",
  className,
  disabled = false,
  testId,
  "data-testid": dataTestId,
}: GoogleSignInButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      signIn("google", { callbackUrl });
    }
  };

  const sizeClasses = {
    sm: "h-9 px-3.5 text-xs gap-2.5",
    md: "h-10 px-4 text-sm gap-3",
    lg: "h-11 px-5 text-sm gap-3.5",
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      data-testid={testId || dataTestId}
      className={cn(
        "inline-flex items-center justify-center font-medium font-sans tracking-normal select-none transition-all duration-150",
        "rounded-lg border shadow-xs active:scale-[0.99]",
        "bg-white dark:bg-[#131314] text-[#1f1f1f] dark:text-[#e3e3e3]",
        "border-[#747775]/30 dark:border-[#8e918f]/30",
        "hover:bg-[#f8f9fa] dark:hover:bg-[#1e1f20] hover:border-[#747775]/50 dark:hover:border-[#8e918f]/50 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
        sizeClasses[size],
        className
      )}
    >
      <GoogleIcon size={iconSizes[size]} className="shrink-0" />
      <span className="truncate">{text}</span>
    </button>
  );
}
