"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { clsx } from "clsx";
import { clampSafe, formatINR } from "@/lib/format";

export interface HybridInputProps {
  id?: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  quickChips?: Array<{ label: string; value: number }>;
  hint?: string;
  error?: string;
  disabled?: boolean;
  hideSlider?: boolean;
  ariaLabel?: string;
}

type SliderStyle = CSSProperties & {
  "--slider-value": string;
};

/**
 * Parse a free-form string into a number.
 * Supports: 5L, 1.5Cr, 10k, plain digits, with optional ₹/commas/spaces.
 * Returns NaN for unparseable input.
 */
function parseInput(raw: string): number {
  const cleaned = raw
    .trim()
    .replace(/₹/g, "")
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .toUpperCase();

  if (!cleaned) return NaN;

  if (cleaned.endsWith("CR")) {
    return parseFloat(cleaned) * 10000000;
  }
  if (cleaned.endsWith("L")) {
    return parseFloat(cleaned) * 100000;
  }
  if (cleaned.endsWith("K")) {
    return parseFloat(cleaned) * 1000;
  }
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function formatDisplayValue(value: number, prefix?: string): string {
  if (prefix === "₹") {
    return formatINR(value).replace("₹", "").trim();
  }
  return Number.isInteger(value) ? value.toString() : value.toString();
}

export default function HybridInput({
  id: customId,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  quickChips,
  hint,
  error,
  disabled = false,
  hideSlider = false,
  ariaLabel,
}: HybridInputProps) {
  const generatedId = useId();
  const inputId = customId || `input-${generatedId}`;
  const descId = `desc-${generatedId}`;
  const sliderId = `slider-${generatedId}`;

  const [rawText, setRawText] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const latestValidRef = useRef(value);

  // Sync state with parent value when not interacting
  useEffect(() => {
    latestValidRef.current = value;
    if (!isFocused && !isDragging) {
      setRawText(value.toString());
    }
  }, [value, isFocused, isDragging]);

  const sliderValue =
    max > min ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) : 0;

  const commitValue = useCallback(
    (nextValue: number): number => {
      const clamped = clampSafe(nextValue, min, max);
      latestValidRef.current = clamped;
      onChange(clamped);
      return clamped;
    },
    [max, min, onChange]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseInput(rawText);

    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      const previous = latestValidRef.current;
      onChange(previous);
      setRawText(previous.toString());
      setLocalError(null);
      return;
    }

    if (parsed < min || parsed > max) {
      setLocalError(`Must be between ${min} and ${max}`);
    } else {
      setLocalError(null);
    }

    const clamped = clampSafe(parsed, min, max);
    latestValidRef.current = clamped;
    onChange(clamped);
    setRawText(clamped.toString());
  }, [max, min, onChange, rawText]);

  const chips = quickChips ?? [];
  const displayError = error ?? localError ?? undefined;
  const effectiveAriaLabel = ariaLabel || label || (suffix ? `Value in ${suffix.trim()}` : "Numeric value");

  return (
    <div className="space-y-2">
      {/* Label and Formatted Output Header */}
      {label && (
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-medium text-foreground cursor-pointer"
          >
            {label}
          </label>
          <span
            className={clsx(
              "text-xs sm:text-sm font-semibold tabular-nums truncate transition-colors",
              isFocused ? "text-primary" : "text-foreground"
            )}
            aria-live="polite"
          >
            {prefix}
            {isFocused ? rawText : formatDisplayValue(value, prefix)}
            {suffix}
          </span>
        </div>
      )}

      {/* Interactive Range Slider (if not disabled via hideSlider) */}
      {!hideSlider && (
        <div className="relative h-5 flex items-center">
          <input
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step || 1}
            value={value}
            disabled={disabled}
            aria-label={`${effectiveAriaLabel} slider`}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerCancel={() => setIsDragging(false)}
            onBlur={() => setIsDragging(false)}
            onChange={(e) => {
              const v = Number(e.target.value);
              const clamped = commitValue(v);
              setRawText(clamped.toString());
            }}
            style={
              {
                "--slider-value": `${sliderValue}%`,
                background:
                  "linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) var(--slider-value), rgb(var(--input)) var(--slider-value), rgb(var(--input)) 100%)",
              } as SliderStyle
            }
            className={clsx(
              "w-full h-1.5 rounded-full appearance-none cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:w-4.5",
              "[&::-webkit-slider-thumb]:h-4.5",
              "[&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:bg-background",
              "[&::-webkit-slider-thumb]:ring-2",
              "[&::-webkit-slider-thumb]:ring-primary",
              "[&::-webkit-slider-thumb]:shadow-sm",
              "[&::-webkit-slider-thumb]:cursor-grab",
              "[&::-webkit-slider-thumb]:active:cursor-grabbing",
              "[&::-webkit-slider-thumb]:active:scale-110",
              "[&::-webkit-slider-thumb]:transition-transform",
              "[&::-moz-range-thumb]:w-4.5",
              "[&::-moz-range-thumb]:h-4.5",
              "[&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-background",
              "[&::-moz-range-thumb]:border-2",
              "[&::-moz-range-thumb]:border-primary",
              "[&::-moz-range-thumb]:shadow-sm"
            )}
          />
        </div>
      )}

      {/* Numeric Direct Input Field */}
      <div
        className={clsx(
          "flex items-center rounded-lg border",
          "bg-card text-foreground transition-all duration-150",
          "h-10 px-3 gap-2",
          disabled && "opacity-50",
          displayError
            ? "border-destructive ring-2 ring-destructive/15"
            : isFocused
              ? "border-primary ring-2 ring-primary/20"
              : "border-border hover:border-border/80"
        )}
      >
        {prefix && (
          <span className="select-none text-xs font-semibold text-muted-foreground">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          aria-label={effectiveAriaLabel}
          aria-invalid={displayError ? true : undefined}
          aria-describedby={(hint || displayError) ? descId : undefined}
          value={isFocused ? rawText : formatDisplayValue(value, prefix)}
          disabled={disabled}
          onFocus={() => {
            setIsFocused(true);
            latestValidRef.current = value;
            setRawText(value.toString());
          }}
          onChange={(e) => {
            const nextText = e.target.value;
            setRawText(nextText);
            const parsed = parseInput(nextText);
            // Only update parent live if valid and within bounds; do not prematurely clamp partial typing
            if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
              if (parsed >= min && parsed <= max) {
                latestValidRef.current = parsed;
                onChange(parsed);
                setLocalError(null);
              }
            }
          }}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
            if (e.key === "Escape") {
              const previous = latestValidRef.current;
              setRawText(previous.toString());
              onChange(previous);
              e.currentTarget.blur();
            }
          }}
          className="flex-1 min-w-0 bg-transparent text-right text-xs sm:text-sm font-semibold tabular-nums text-foreground outline-none disabled:cursor-not-allowed"
        />
        {suffix && (
          <span className="select-none text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>

      {/* Optional Quick Choice Chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5" role="group" aria-label={`${label || "Value"} presets`}>
          {chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              disabled={disabled}
              onClick={() => {
                const clamped = commitValue(chip.value);
                setRawText(clamped.toString());
              }}
              className={clsx(
                "text-[11px] rounded-md px-2.5 py-0.5",
                "border transition-all duration-150",
                "font-medium disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                value === chip.value
                  ? "border-primary bg-primary text-primary-foreground font-semibold"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* Field Hint or Error */}
      {(hint || displayError) && (
        <p
          id={descId}
          className={clsx(
            "text-[11px]",
            displayError ? "text-destructive font-medium" : "text-muted-foreground"
          )}
        >
          {displayError || hint}
        </p>
      )}
    </div>
  );
}
