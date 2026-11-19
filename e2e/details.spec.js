const { test, expect } = require("@playwright/test");

test.describe("Restaurant Details Page", () => {
    test("navigating to a restaurant shows details page", async ({ page }) => {
        await page.goto("/");
        await page.waitForTimeout(2000);
        const cards = page.locator("[class*=MuiCard-root]");
        const count = await cards.count();
        if (count > 0) {
            await cards.first().click();
            await page.waitForURL(/\/restaurant\//, { timeout: 5000 });
            await page.waitForTimeout(2000);
            const hasImage = await page.locator("[class*=MuiBox-root] img").first().isVisible().catch(() => false);
            const hasName = await page.locator("[class*=MuiTypography-root]").first().isVisible().catch(() => false);
            expect(hasImage || hasName).toBe(true);
        } else {
            test.info().annotations.push({
                type: "info",
                description: "No restaurant cards on home page to navigate from",
            });
            test.skip();
        }
    });

    test("details page does not crash on API error", async ({ page }) => {
        const errors = [];
        page.on("pageerror", (err) => errors.push(err.message));
        await page.goto("/restaurant/nonexistent-uuid-for-test");
        await page.waitForTimeout(3000);
        expect(errors).toEqual([]);
    });

    test("rating widget is visible for logged-in user", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => {
            sessionStorage.setItem("access-token", "test-token");
            sessionStorage.setItem("first-name", "TestUser");
        });
        await page.goto("/");
        await page.waitForTimeout(2000);
        const cards = page.locator("[class*=MuiCard-root]");
        const count = await cards.count();
        if (count > 0) {
            await cards.first().click();
            await page.waitForURL(/\/restaurant\//, { timeout: 5000 });
            await page.waitForTimeout(2000);
            const hasRating = await page.locator("text=/Rate:|Rated:/").first().isVisible().catch(() => false);
            expect(hasRating).toBe(true);
        } else {
            test.info().annotations.push({
                type: "info",
                description: "No restaurant cards to navigate to for rating test",
            });
            test.skip();
        }
    });

    test("non-logged-in user gets login prompt on rate attempt", async ({ page }) => {
        await page.goto("/");
        await page.waitForTimeout(2000);
        const cards = page.locator("[class*=MuiCard-root]");
        const count = await cards.count();
        if (count > 0) {
            await cards.first().click();
            await page.waitForURL(/\/restaurant\//, { timeout: 5000 });
            await page.waitForTimeout(2000);
            const rateLabel = await page.locator("text=Rate:").first().isVisible().catch(() => false);
            if (rateLabel) {
                const star = page.locator("[class*=MuiRating-root] [class*=MuiRating-icon]").nth(2);
                await star.dispatchEvent("click");
                await expect(page.locator("text=Please login to rate!")).toBeVisible({ timeout: 3000 });
            }
        } else {
            test.info().annotations.push({
                type: "info",
                description: "No restaurant cards to navigate to for rating prompt test",
            });
            test.skip();
        }
    });
});
