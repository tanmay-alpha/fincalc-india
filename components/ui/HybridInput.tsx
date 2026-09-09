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
 * Returns NaN for malformed or unparseable input (e.g. "12abc").
 */
export function parseFinancialInput(raw: string): number {
  if (typeof raw !== "string") return NaN;
  const cleaned = raw
    .trim()
    .replace(/₹/g, "")
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .toUpperCase();

  if (!cleaned) return NaN;

  const match = cleaned.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(CR|L|K)?$/);
  if (!match) return NaN;

  const base = Number(match[1]);
  if (!Number.isFinite(base)) return NaN;

  const multiplier =
    match[2] === "CR" ? 10_000_000 : match[2] === "L" ? 100_000 : match[2] === "K" ? 1_000 : 1;
  const value = base * multiplier;
  return Number.isFinite(value) ? value : NaN;
}

export { parseFinancialInput as parseInput };

export const SLIDER_STEPS = 1000;

export function valueToSliderPosition(
  value: number,
  min: number,
  max: number,
  isWideRange: boolean
): number {
  if (max <= min) return 0;
  const clampedVal = clampSafe(value, min, max);
  if (!isWideRange || min <= 0) {
    return ((clampedVal - min) / (max - min)) * SLIDER_STEPS;
  }
  const fraction = Math.log(clampedVal / min) / Math.log(max / min);
  return Math.max(0, Math.min(SLIDER_STEPS, fraction * SLIDER_STEPS));
}

export function sliderPositionToValue(
  position: number,
  min: number,
  max: number,
  step: number,
  isWideRange: boolean
): number {
  if (max <= min) return min;
  const fraction = Math.max(0, Math.min(1, position / SLIDER_STEPS));
  if (!isWideRange || min <= 0) {
    const raw = min + fraction * (max - min);
    const stepped = Math.round((raw - min) / step) * step + min;
    return clampSafe(stepped, min, max);
  }

  const raw = min * Math.pow(max / min, fraction);
  let effectiveStep = step;
  if (raw >= 10_000_000) effectiveStep = Math.max(step, 100_000);
  else if (raw >= 1_000_000) effectiveStep = Math.max(step, 25_000);
  else if (raw >= 100_000) effectiveStep = Math.max(step, 5_000);
  else if (raw >= 10_000) effectiveStep = Math.max(step, 500);

  const stepped = Math.round((raw - min) / effectiveStep) * effectiveStep + min;
  return clampSafe(stepped, min, max);
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

  const isWideRange = Boolean(prefix === "₹" && min > 0 && max / min >= 50);
  const currentPos = valueToSliderPosition(value, min, max, isWideRange);
  const sliderFillPercent =
    max > min ? Math.max(0, Math.min(100, (currentPos / SLIDER_STEPS) * 100)) : 0;

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
    const parsed = parseFinancialInput(rawText);

    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      const previous = latestValidRef.current;
      onChange(previous);
      setRawText(previous.toString());
      setLocalError("Please enter a valid number");
      return;
    }

    if (parsed < min || parsed > max) {
      setLocalError(
        `Must be between ${prefix || ""}${formatDisplayValue(min, prefix)} and ${prefix || ""}${formatDisplayValue(max, prefix)}`
      );
    } else {
      setLocalError(null);
    }

    const clamped = clampSafe(parsed, min, max);
    latestValidRef.current = clamped;
    onChange(clamped);
    setRawText(clamped.toString());
  }, [max, min, onChange, prefix, rawText]);

  const chips = quickChips ?? [];
  const displayError = error ?? localError ?? undefined;
  const effectiveAriaLabel = ariaLabel || label || (suffix ? `Value in ${suffix.trim()}` : "Numeric value");

  const liveParsed = parseFinancialInput(rawText);
  const liveFormatted =
    !Number.isNaN(liveParsed) && Number.isFinite(liveParsed)
      ? formatDisplayValue(liveParsed, prefix)
      : rawText;

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
            {isFocused ? liveFormatted : formatDisplayValue(value, prefix)}
            {suffix}
          </span>
        </div>
      )}

      {/* Interactive Range Slider (if not disabled via hideSlider) */}
      {!hideSlider && (
        <div className="relative h-7 flex items-center py-1">
          <input
            id={sliderId}
            type="range"
            min={0}
            max={SLIDER_STEPS}
            step={1}
            value={currentPos}
            disabled={disabled}
            aria-label={`${effectiveAriaLabel} slider`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={prefix ? `${prefix}${formatDisplayValue(value, prefix)}` : value.toString()}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerCancel={() => setIsDragging(false)}
            onBlur={() => setIsDragging(false)}
            onKeyDown={(e) => {
              const stepAmount = step || 1;
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                const next = clampSafe(value + stepAmount, min, max);
                commitValue(next);
                setRawText(next.toString());
              } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                const next = clampSafe(value - stepAmount, min, max);
                commitValue(next);
                setRawText(next.toString());
              } else if (e.key === "Home") {
                e.preventDefault();
                commitValue(min);
                setRawText(min.toString());
              } else if (e.key === "End") {
                e.preventDefault();
                commitValue(max);
                setRawText(max.toString());
              }
            }}
            onChange={(e) => {
              const pos = Number(e.target.value);
              const nextVal = sliderPositionToValue(pos, min, max, step || 1, isWideRange);
              const clamped = commitValue(nextVal);
              setRawText(clamped.toString());
            }}
            style={
              {
                "--slider-value": `${sliderFillPercent}%`,
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
            const parsed = parseFinancialInput(nextText);
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
                "text-xs font-semibold rounded-md px-2.5 py-1 min-h-[28px] inline-flex items-center",
                "border transition-all duration-150",
                "disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                value === chip.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/80 hover:text-foreground hover:bg-muted"
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
