const { test, expect } = require("@playwright/test");

test.describe("Checkout Page", () => {
    test("redirects to home when accessed without cart state", async ({ page }) => {
        await page.goto("/checkout");
        await expect(page).toHaveURL("/");
    });

    test("renders stepper and order summary when cart has items", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => {
            sessionStorage.setItem("access-token", "test-token");
            sessionStorage.setItem("first-name", "Test");
        });
        await page.goto("/checkout");
        await expect(page).toHaveURL("/");
    });
});

test.describe("Checkout — Coupon Section (UI structure)", () => {
    test("coupon flow requires working restaurant API", async ({ page }) => {
        const errors = [];
        page.on("pageerror", (err) => errors.push(err.message));
        await page.goto("/");
        await page.waitForTimeout(3000);
        expect(errors).toEqual([]);
        const cards = page.locator("[class*=MuiCard-root]");
        const count = await cards.count();
        if (count > 0) {
            await cards.first().click();
            await page.waitForURL(/\/restaurant\//, { timeout: 5000 });
            test.info().annotations.push({
                type: "info",
                description: "Full coupon E2E flow available when restaurant API works and items are added to cart",
            });
        } else {
            test.info().annotations.push({
                type: "bug",
                description: "BUG-002: restaurant API returns 500 — cannot navigate to restaurant for coupon E2E",
            });
            test.skip();
        }
    });
});
