"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatINR, parseINRInput, clampSafe } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────

export interface QuickChip {
  label: string;
  value: number;
}

export interface HybridInputProps {
  label: string;
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  quickChips?: QuickChip[];
  hint?: string;
  error?: string;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────

export default function HybridInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  quickChips,
  hint,
  error,
  className,
}: HybridInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rawText, setRawText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Slider percentage for filled track
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const clampedPct = Math.max(0, Math.min(100, pct));

  // Format display value
  const displayValue = useCallback(() => {
    if (prefix === "₹") return formatINR(value);
    return `${value}${suffix ? ` ${suffix}` : ""}`;
  }, [value, prefix, suffix]);

  // ── Slider change ──
  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number(e.target.value);
      onChange(clampSafe(num, min, max));
    },
    [onChange, min, max]
  );

  // ── Text input focus ──
  const handleFocus = useCallback(() => {
    setIsEditing(true);
    setRawText(String(value));
  }, [value]);

  // ── Text input change ──
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setRawText(text);

      // Try to parse and update slider live
      const stripped = text.replace(/[₹,\s]/g, "");
      const num = parseFloat(stripped);
      if (!isNaN(num) && isFinite(num)) {
        const clamped = clampSafe(num, min, max);
        onChange(clamped);
      }
    },
    [onChange, min, max]
  );

  // ── Text input blur ──
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    // Parse input supporting "5L", "2Cr" etc.
    const parsed = parseINRInput(rawText);
    const clamped = clampSafe(parsed || value, min, max);
    // Snap to step
    const snapped = Math.round(clamped / step) * step;
    const final = clampSafe(snapped, min, max);
    onChange(final);
  }, [rawText, value, min, max, step, onChange]);

  // ── Keyboard ──
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        inputRef.current?.blur();
      }
    },
    []
  );

  // ── Quick chip click ──
  const handleChipClick = useCallback(
    (chipValue: number) => {
      const clamped = clampSafe(chipValue, min, max);
      onChange(clamped);
    },
    [onChange, min, max]
  );

  // Keep rawText in sync when value changes externally while not editing
  useEffect(() => {
    if (!isEditing) {
      setRawText(String(value));
    }
  }, [value, isEditing]);

  const hasError = !!error;

  return (
    <div
      className={cn(
        "group space-y-3 p-4 -mx-4 rounded-xl transition-all duration-[var(--transition-base)]",
        "hover:bg-slate-50 dark:hover:bg-slate-800/50",
        "focus-within:bg-slate-50 dark:focus-within:bg-slate-800/50",
        hasError && "bg-red-50/50 dark:bg-red-900/10",
        className
      )}
    >
      {/* ── Label + formatted value ── */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors">
          {label}
        </label>
        <span
          className={cn(
            "text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm transition-transform duration-200",
            "group-focus-within:scale-105",
            hasError
              ? "text-[var(--red)] bg-[var(--red-light)] border border-red-200 dark:border-red-800"
              : "text-[var(--accent)] bg-[var(--accent-light)] border border-blue-100 dark:border-blue-800"
          )}
        >
          {displayValue()}
        </span>
      </div>

      {/* ── Slider with Steppers ── */}
      <div className="flex items-center gap-3">
        {/* Decrease */}
        <button 
          type="button" 
          onClick={() => onChange(clampSafe(value - step, min, max))} 
          className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all focus:outline-none active:scale-90 select-none flex-shrink-0" 
          aria-label="Decrease"
        >
          <span className="text-xl leading-none font-medium mb-0.5">-</span>
        </button>

        <div className="relative h-10 flex flex-1 items-center">
          {/* Track background */}
          <div className="absolute inset-x-0 h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
          {/* Filled track */}
          <div
            className="absolute left-0 h-2 bg-blue-600 rounded-full transition-[width] duration-75"
            style={{ width: `${clampedPct}%` }}
          />
          {/* Native range input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="relative z-10 w-full appearance-none bg-transparent cursor-grab active:cursor-grabbing
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
              [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-slate-200
              [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.15)] [&::-webkit-slider-thumb]:cursor-grab
              [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
              [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:active:cursor-grabbing
              [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
              [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-slate-200
              [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.15)] [&::-moz-range-thumb]:cursor-grab
              [&::-moz-range-thumb]:active:scale-110
              [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2
              [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-2"
            style={{ background: "transparent" }}
          />
        </div>

        {/* Increase */}
        <button 
          type="button" 
          onClick={() => onChange(clampSafe(value + step, min, max))} 
          className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 shadow-sm dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all focus:outline-none active:scale-90 select-none flex-shrink-0" 
          aria-label="Increase"
        >
          <span className="text-lg leading-none font-medium">+</span>
        </button>
      </div>

      {/* ── Text input ── */}
      <div
        className={cn(
          "flex items-center rounded-lg border transition-colors duration-200",
          hasError
            ? "border-[var(--red)] focus-within:ring-2 focus-within:ring-red-200"
            : "border-[var(--border-default)] focus-within:border-[var(--border-focus)] focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/30"
        )}
      >
        {prefix && (
          <span className="pl-3 pr-1 text-sm font-medium text-[var(--text-muted)] select-none">
            {prefix}
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={isEditing ? rawText : (prefix === "₹" ? formatINR(value).replace("₹", "") : String(value))}
          onFocus={handleFocus}
          onChange={handleTextChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 py-2.5 px-2 text-sm font-medium text-[var(--text-primary)] bg-transparent outline-none"
          aria-label={label}
        />
        {suffix && (
          <span className="pr-3 pl-1 text-sm font-medium text-[var(--text-muted)] select-none">
            {suffix}
          </span>
        )}
      </div>

      {/* ── Quick chips ── */}
      {quickChips && quickChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip) => {
            const isActive = value === chip.value;
            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChipClick(chip.value)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 border",
                  isActive
                    ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm"
                    : "bg-white dark:bg-slate-800 text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Hint / Error ── */}
      {error && (
        <p className="text-xs text-[var(--red)] font-medium">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  );
}
