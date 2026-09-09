// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import HybridInput from "@/components/ui/HybridInput";

describe("HybridInput Component", () => {
  it("renders label, formatted display value, and range slider with accessible ARIA", () => {
    const handleChange = vi.fn();
    render(
      <HybridInput
        label="Monthly Investment"
        value={25000}
        onChange={handleChange}
        min={500}
        max={10000000}
        step={500}
        prefix="₹"
      />
    );

    expect(screen.getByText("Monthly Investment")).toBeDefined();
    expect(screen.getByText(/₹25,000/)).toBeDefined();

    const slider = screen.getByRole("slider", { name: /Monthly Investment slider/i });
    expect(slider).toBeDefined();
    expect(slider.getAttribute("aria-valuemin")).toBe("500");
    expect(slider.getAttribute("aria-valuemax")).toBe("10000000");
    expect(slider.getAttribute("aria-valuenow")).toBe("25000");
  });

  it("handles keyboard navigation on the range slider", () => {
    const handleChange = vi.fn();
    render(
      <HybridInput
        label="Monthly Investment"
        value={25000}
        onChange={handleChange}
        min={500}
        max={10000000}
        step={500}
        prefix="₹"
      />
    );

    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(handleChange).toHaveBeenCalledWith(25500);

    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(handleChange).toHaveBeenCalledWith(24500);

    fireEvent.keyDown(slider, { key: "Home" });
    expect(handleChange).toHaveBeenCalledWith(500);

    fireEvent.keyDown(slider, { key: "End" });
    expect(handleChange).toHaveBeenCalledWith(10000000);
  });

  it("handles malformed text input on blur gracefully with error message and reversion", () => {
    const handleChange = vi.fn();
    render(
      <HybridInput
        label="Monthly Investment"
        value={25000}
        onChange={handleChange}
        min={500}
        max={10000000}
        step={500}
        prefix="₹"
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "12abc" } });
    fireEvent.blur(input);

    expect(screen.getByText("Please enter a valid number")).toBeDefined();
    expect(handleChange).toHaveBeenCalledWith(25000);
  });

  it("handles valid financial shorthand input on blur", () => {
    const handleChange = vi.fn();
    render(
      <HybridInput
        label="Monthly Investment"
        value={25000}
        onChange={handleChange}
        min={500}
        max={10000000}
        step={500}
        prefix="₹"
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "1.5L" } });
    fireEvent.blur(input);

    expect(handleChange).toHaveBeenCalledWith(150000);
  });

  it("triggers onChange when clicking quick chips", () => {
    const handleChange = vi.fn();
    render(
      <HybridInput
        label="Monthly Investment"
        value={25000}
        onChange={handleChange}
        min={500}
        max={10000000}
        step={500}
        prefix="₹"
        quickChips={[
          { label: "₹50K", value: 50000 },
          { label: "₹1L", value: 100000 },
        ]}
      />
    );

    const chip = screen.getByRole("button", { name: "₹50K" });
    fireEvent.click(chip);
    expect(handleChange).toHaveBeenCalledWith(50000);
  });
});
