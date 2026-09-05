import { test, expect } from "@playwright/test";
import { ALL_CALCULATOR_ROUTES } from "../lib/registry";

test.describe("Production Calculator Smoke Suite (All 31 Canonical Routes)", () => {
  for (const route of ALL_CALCULATOR_ROUTES) {
    test(`Smoke test route: ${route}`, async ({ page }) => {
      const pageErrors: Error[] = [];
      const consoleErrors: string[] = [];

      page.on("pageerror", (err) => {
        pageErrors.push(err);
      });

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          // Ignore favicon 404 in local dev / testing if any
          if (!msg.text().includes("favicon.ico")) {
            consoleErrors.push(msg.text());
          }
        }
      });

      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      // 1. Assert HTTP 200
      expect(response?.status(), `Route ${route} should return HTTP 200`).toBe(200);

      // 2. Assert Visible H1
      const heading = page.locator("h1").first();
      await expect(heading, `Route ${route} must have a visible H1`).toBeVisible();

      // 3. Assert Zero Page Errors
      expect(pageErrors, `Route ${route} had unhandled page errors`).toEqual([]);

      // 4. Assert Zero Console Errors
      expect(consoleErrors, `Route ${route} had unexpected console errors`).toEqual([]);

      // 5. Assert No NaN, undefined, or unhandled literal Infinity in body
      const bodyText = await page.innerText("body");
      expect(bodyText, `Route ${route} contained literal 'NaN'`).not.toMatch(/\bNaN\b/);
      expect(bodyText, `Route ${route} contained literal 'undefined'`).not.toMatch(/\bundefined\b/);
      expect(bodyText, `Route ${route} contained literal 'Infinity'`).not.toMatch(/\bInfinity\b/);
    });
  }
});
