// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import TableScrollContainer from "@/components/ui/TableScrollContainer";

describe("TableScrollContainer Component", () => {
  it("renders children with proper accessibility attributes", () => {
    render(
      <TableScrollContainer ariaLabel="Test Financial Schedule">
        <table data-testid="test-table">
          <tbody>
            <tr>
              <td>Row 1</td>
            </tr>
          </tbody>
        </table>
      </TableScrollContainer>
    );

    const region = screen.getByRole("region", { name: "Test Financial Schedule" });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("tabindex", "0");
    expect(screen.getByTestId("test-table")).toBeInTheDocument();
  });

  it("applies default aria-label when not explicitly provided", () => {
    render(
      <TableScrollContainer>
        <table>
          <tbody>
            <tr>
              <td>Default table</td>
            </tr>
          </tbody>
        </table>
      </TableScrollContainer>
    );

    const region = screen.getByRole("region", { name: "Scrollable data table" });
    expect(region).toBeInTheDocument();
  });

  it("applies custom className to scroll container", () => {
    render(
      <TableScrollContainer className="custom-table-class">
        <table>
          <tbody>
            <tr>
              <td>Styled table</td>
            </tr>
          </tbody>
        </table>
      </TableScrollContainer>
    );

    const region = screen.getByRole("region");
    expect(region).toHaveClass("custom-table-class");
    expect(region).toHaveClass("overflow-x-auto");
  });
});
