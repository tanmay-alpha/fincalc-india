"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { clsx } from "clsx";
import { clampSafe, formatINR } from "@/lib/format";

interface HybridInputProps {
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
}

type SliderStyle = CSSProperties & {
  "--slider-value": string;
};

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
  return parseFloat(cleaned);
}

function formatDisplayValue(value: number, prefix?: string): string {
  if (prefix === "₹") {
    return formatINR(value).replace("₹", "");
  }
  return Number.isInteger(value) ? value.toString() : value.toString();
}

export default function HybridInput({
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
}: HybridInputProps) {
  const [rawText, setRawText] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const latestValidRef = useRef(value);

  useEffect(() => {
    latestValidRef.current = value;
    if (!isFocused && !isDragging) {
      setRawText(value.toString());
    }
  }, [value, isFocused, isDragging]);

  const sliderValue =
    max > min ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) : 0;

  const commitValue = useCallback(
    (nextValue: number) => {
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

    if (isNaN(parsed) || !isFinite(parsed)) {
      const previous = latestValidRef.current;
      onChange(previous);
      setRawText(previous.toString());
      return;
    }

    const clamped = clampSafe(parsed, min, max);
    latestValidRef.current = clamped;
    onChange(clamped);
    setRawText(clamped.toString());
  }, [max, min, onChange, rawText]);

  const chips = quickChips ?? [];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <span
          className={clsx(
            "text-sm font-semibold",
            isFocused ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-slate-100"
          )}
        >
          {prefix}
          {isFocused ? rawText : formatDisplayValue(value, prefix)}
          {suffix}
        </span>
      </div>

      <div className="relative h-5 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step || 1}
          value={value}
          disabled={disabled}
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
                "linear-gradient(to right, #2563EB 0%, #2563EB var(--slider-value), var(--slider-track) var(--slider-value), var(--slider-track) 100%)",
            } as SliderStyle
          }
          className={clsx(
            "w-full h-1.5 rounded-full appearance-none cursor-pointer",
            "[--slider-track:#E2E8F0] dark:[--slider-track:#475569]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-5",
            "[&::-webkit-slider-thumb]:h-5",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-white",
            "[&::-webkit-slider-thumb]:ring-2",
            "[&::-webkit-slider-thumb]:ring-blue-600",
            "[&::-webkit-slider-thumb]:shadow-md",
            "[&::-webkit-slider-thumb]:cursor-grab",
            "[&::-webkit-slider-thumb]:active:cursor-grabbing",
            "[&::-webkit-slider-thumb]:active:scale-110",
            "[&::-webkit-slider-thumb]:transition-transform",
            "[&::-moz-range-thumb]:w-5",
            "[&::-moz-range-thumb]:h-5",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-white",
            "[&::-moz-range-thumb]:border-2",
            "[&::-moz-range-thumb]:border-blue-600",
            "[&::-moz-range-thumb]:shadow-md"
          )}
        />
      </div>

      <div
        className={clsx(
          "flex items-center rounded-lg border",
          "bg-white dark:bg-slate-950 transition-all duration-150",
          "h-11 px-3 gap-2",
          disabled && "opacity-50",
          error
            ? "border-red-400 ring-2 ring-red-100 dark:ring-red-950/40"
            : isFocused
              ? "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-950/40"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        )}
      >
        {prefix && (
          <span className="text-slate-400 dark:text-slate-500 text-sm font-medium select-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
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
            if (!isNaN(parsed) && isFinite(parsed)) {
              commitValue(parsed);
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
          className="flex-1 text-right text-sm font-medium text-slate-900 dark:text-slate-100 outline-none bg-transparent disabled:cursor-not-allowed"
        />
        {suffix && (
          <span className="text-slate-400 dark:text-slate-500 text-sm select-none">
            {suffix}
          </span>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
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
                "text-xs rounded-full px-3 py-1",
                "border transition-all duration-150",
                "font-medium disabled:opacity-50 disabled:cursor-not-allowed",
                value === chip.value
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {(hint || error) && (
        <p
          className={clsx(
            "text-xs",
            error ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-slate-500"
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
