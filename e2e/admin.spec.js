const { test, expect } = require("@playwright/test");

test.describe("Admin Page", () => {
    test("redirects non-logged-in user away from admin", async ({ page }) => {
        await page.goto("/admin");
        await expect(page).toHaveURL(/\/login/);
    });

    test("shows 403 for logged-in non-admin user", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => {
            sessionStorage.setItem("access-token", "customer-token");
            sessionStorage.setItem("first-name", "Customer");
            sessionStorage.setItem("role", "CUSTOMER");
        });
        await page.goto("/admin");
        await expect(page.getByRole("heading", { name: "403" })).toBeVisible({ timeout: 5000 });
    });

    test("shows admin dashboard for admin user", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => {
            sessionStorage.setItem("access-token", "admin-token");
            sessionStorage.setItem("first-name", "Admin");
            sessionStorage.setItem("role", "ADMIN");
        });
        await page.goto("/admin");
        await expect(page.locator("text=/Dashboard/i").first()).toBeVisible({ timeout: 5000 });
    });
});
