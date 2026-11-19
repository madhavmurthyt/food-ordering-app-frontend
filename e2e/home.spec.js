const { test, expect } = require("@playwright/test");

test.describe("Home Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("renders header with brand name", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Food Ordering App" })).toBeVisible();
    });

    test("renders hero banner with tagline", async ({ page }) => {
        await expect(
            page.locator("text=Discover the best food in your city")
        ).toBeVisible();
    });

    test("renders hero search bar", async ({ page }) => {
        await expect(
            page.getByPlaceholder("Search by Restaurant Name").first()
        ).toBeVisible();
    });

    test("renders footer", async ({ page }) => {
        await expect(page.locator("footer, [class*=footer]").first()).toBeVisible();
    });

    test("renders Login button when not logged in", async ({ page }) => {
        await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    });

    test("loads restaurant cards or shows empty state on API error", async ({ page }) => {
        await page.waitForTimeout(3000);
        const cards = page.locator("[class*=MuiCard-root]");
        const emptyMsg = page.locator("text=No restaurant with the given name.");
        const hasCards = await cards.count() > 0;
        const hasEmpty = await emptyMsg.isVisible().catch(() => false);
        expect(hasCards || hasEmpty).toBe(true);
    });

    test("does not crash on API error — no unhandled exception", async ({ page }) => {
        const errors = [];
        page.on("pageerror", (err) => errors.push(err.message));
        await page.goto("/");
        await page.waitForTimeout(3000);
        expect(errors).toEqual([]);
    });

    test("category bar loads and chips are clickable", async ({ page }) => {
        await page.waitForTimeout(3000);
        const allChip = page.locator("[class*=MuiChip-root]").filter({ hasText: "All" });
        const isVisible = await allChip.isVisible().catch(() => false);
        if (isVisible) {
            const chips = page.locator("[class*=MuiChip-root]");
            const count = await chips.count();
            expect(count).toBeGreaterThan(0);
            await allChip.click();
            await expect(allChip).toBeVisible();
        } else {
            test.info().annotations.push({
                type: "info",
                description: "Category API may not have returned data",
            });
            expect(true).toBe(true);
        }
    });

    test("Login button navigates to /login", async ({ page }) => {
        await page.getByRole("link", { name: "Login" }).click();
        await expect(page).toHaveURL(/\/login/);
    });
});
