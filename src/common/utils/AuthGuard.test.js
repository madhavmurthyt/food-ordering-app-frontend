import { isLoggedIn, getRole, getAccessToken, requireRole } from "./AuthGuard";

beforeEach(() => {
    sessionStorage.clear();
});

describe("isLoggedIn", () => {
    test("returns false when no token", () => {
        expect(isLoggedIn()).toBe(false);
    });

    test("returns true when token exists", () => {
        sessionStorage.setItem("access-token", "tok");
        expect(isLoggedIn()).toBe(true);
    });
});

describe("getRole", () => {
    test("returns null when no role", () => {
        expect(getRole()).toBeNull();
    });

    test("returns stored role", () => {
        sessionStorage.setItem("role", "ADMIN");
        expect(getRole()).toBe("ADMIN");
    });
});

describe("getAccessToken", () => {
    test("returns null when no token", () => {
        expect(getAccessToken()).toBeNull();
    });

    test("returns stored token", () => {
        sessionStorage.setItem("access-token", "my-token");
        expect(getAccessToken()).toBe("my-token");
    });
});

describe("requireRole", () => {
    test("redirects to /login when not logged in", () => {
        const navigate = jest.fn();
        const result = requireRole("ADMIN", navigate);
        expect(result).toBe(false);
        expect(navigate).toHaveBeenCalledWith("/login");
    });

    test("returns false for wrong role", () => {
        sessionStorage.setItem("access-token", "tok");
        sessionStorage.setItem("role", "CUSTOMER");
        const navigate = jest.fn();
        const result = requireRole("ADMIN", navigate);
        expect(result).toBe(false);
        expect(navigate).not.toHaveBeenCalled();
    });

    test("returns true for matching role", () => {
        sessionStorage.setItem("access-token", "tok");
        sessionStorage.setItem("role", "ADMIN");
        const navigate = jest.fn();
        const result = requireRole("ADMIN", navigate);
        expect(result).toBe(true);
        expect(navigate).not.toHaveBeenCalled();
    });
});
