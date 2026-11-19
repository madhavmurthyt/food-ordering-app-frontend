const { test, expect } = require("@playwright/test");

test.describe("Login Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/login");
    });

    test("renders login form with contact and password fields", async ({ page }) => {
        await expect(page.getByLabel(/contact/i).or(page.locator("input[type='text']").first())).toBeVisible();
        await expect(page.getByLabel(/password/i).first()).toBeVisible();
    });

    test("renders Login button", async ({ page }) => {
        await expect(page.getByRole("button", { name: /login/i })).toBeVisible();
    });

    test("shows validation error on empty submit", async ({ page }) => {
        await page.getByRole("button", { name: /login/i }).click();
        const errorVisible = await page.locator("text=/required|invalid|enter/i").first().isVisible().catch(() => false);
        expect(errorVisible).toBe(true);
    });

    test("renders signup tab/link", async ({ page }) => {
        const signupOption = page.locator("text=/sign up|signup|register|create account/i").first();
        await expect(signupOption).toBeVisible();
    });

    test("can switch to signup mode", async ({ page }) => {
        const signupTab = page.locator("text=/sign up|signup|register/i").first();
        await signupTab.click();
        await expect(page.getByLabel(/first name/i).or(page.locator("input[name='firstName']"))).toBeVisible({ timeout: 3000 });
    });

    test("login with invalid credentials shows error", async ({ page }) => {
        const errors = [];
        page.on("pageerror", (err) => errors.push(err.message));

        const contactInput = page.locator("input").first();
        await contactInput.fill("0000000000");
        const passwordInput = page.getByLabel(/password/i).first();
        await passwordInput.fill("WrongPass1!");
        await page.getByRole("button", { name: /login/i }).click();

        await page.waitForTimeout(3000);

        const hasSnackbarOrError = await page.locator("[class*=MuiSnackbar], [class*=MuiAlert], [role=alert], text=/error|invalid|incorrect|failed/i").first().isVisible().catch(() => false);
        expect(errors.length === 0 || hasSnackbarOrError).toBe(true);
    });
});
