import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import InvitePage from "./InvitePage";

beforeEach(() => {
    sessionStorage.clear();
});

afterEach(() => {
    jest.restoreAllMocks();
});

const renderInvitePage = (token = "valid-token-123") =>
    render(
        <MemoryRouter initialEntries={[`/invite/${token}`]}>
            <Routes>
                <Route path="/invite/:token" element={<InvitePage />} />
                <Route path="/login" element={<div>Login Page</div>} />
                <Route path="/" element={<div>Home Page</div>} />
            </Routes>
        </MemoryRouter>
    );

describe("InvitePage — valid invite", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        restaurant_name: "Pizza Palace",
                        status: "valid",
                    }),
            })
        );
    });

    test("shows restaurant name for valid token", async () => {
        renderInvitePage();
        await waitFor(() => {
            expect(screen.getByText("Pizza Palace")).toBeInTheDocument();
        });
    });

    test("shows 'Login / Sign Up to Claim' button for non-logged-in user", async () => {
        renderInvitePage();
        await waitFor(() => {
            expect(screen.getByText("Pizza Palace")).toBeInTheDocument();
        });
        expect(screen.getByRole("button", { name: /Login \/ Sign Up to Claim/i })).toBeInTheDocument();
    });

    test("shows 'Claim Restaurant' button for logged-in user", async () => {
        sessionStorage.setItem("access-token", "user-tok");
        sessionStorage.setItem("first-name", "TestUser");
        renderInvitePage();
        await waitFor(() => {
            expect(screen.getByText("Pizza Palace")).toBeInTheDocument();
        });
        expect(screen.getByRole("button", { name: /Claim Restaurant/i })).toBeInTheDocument();
    });

    test("shows help text about managing the restaurant", async () => {
        renderInvitePage();
        await waitFor(() => {
            expect(
                screen.getByText(/Create your account to manage this restaurant/i)
            ).toBeInTheDocument();
        });
    });

    test("redirects to login when non-logged-in user clicks claim", async () => {
        renderInvitePage();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Login \/ Sign Up to Claim/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /Login \/ Sign Up to Claim/i }));
        await waitFor(() => {
            expect(screen.getByText("Login Page")).toBeInTheDocument();
        });
        expect(sessionStorage.getItem("invite-redirect")).toBe("valid-token-123");
    });
});

describe("InvitePage — expired invite", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        status: "expired",
                        message: "This invite link has expired",
                    }),
            })
        );
    });

    test("shows error for expired token", async () => {
        renderInvitePage("expired-token");
        await waitFor(() => {
            expect(screen.getByText("This invite link has expired")).toBeInTheDocument();
        });
    });
});

describe("InvitePage — used invite", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        status: "used",
                        message: "This invite link has already been used",
                    }),
            })
        );
    });

    test("shows error for used token", async () => {
        renderInvitePage("used-token");
        await waitFor(() => {
            expect(screen.getByText("This invite link has already been used")).toBeInTheDocument();
        });
    });
});

describe("InvitePage — invalid invite", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        status: "invalid",
                        message: "Invalid invite link",
                    }),
            })
        );
    });

    test("shows error for invalid token", async () => {
        renderInvitePage("bad-token");
        await waitFor(() => {
            expect(screen.getByText("Invalid invite link")).toBeInTheDocument();
        });
    });
});

describe("InvitePage — claim flow", () => {
    test("shows success after claiming", async () => {
        global.fetch = jest.fn((url) => {
            if (url.includes("/claim")) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            restaurant_id: "rest-uuid",
                            restaurant_name: "Pizza Palace",
                            role: "RESTAURANT_OWNER",
                            message: "YOU ARE NOW THE OWNER OF THIS RESTAURANT",
                        }),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        restaurant_name: "Pizza Palace",
                        status: "valid",
                    }),
            });
        });

        sessionStorage.setItem("access-token", "user-tok");
        sessionStorage.setItem("first-name", "TestUser");
        renderInvitePage();

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Claim Restaurant/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /Claim Restaurant/i }));

        await waitFor(() => {
            expect(screen.getByText(/You're all set!/i)).toBeInTheDocument();
        });
        expect(sessionStorage.getItem("role")).toBe("RESTAURANT_OWNER");
    });

    test("shows error when claim API fails", async () => {
        global.fetch = jest.fn((url) => {
            if (url.includes("/claim")) {
                return Promise.resolve({
                    ok: false,
                    text: () =>
                        Promise.resolve(
                            JSON.stringify({ message: "Invite link has expired" })
                        ),
                });
            }
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        restaurant_name: "Pizza Palace",
                        status: "valid",
                    }),
            });
        });

        sessionStorage.setItem("access-token", "user-tok");
        sessionStorage.setItem("first-name", "TestUser");
        renderInvitePage();

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Claim Restaurant/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /Claim Restaurant/i }));

        await waitFor(() => {
            expect(screen.getByText("Invite link has expired")).toBeInTheDocument();
        });
    });

    test("shows loading spinner while validating", () => {
        global.fetch = jest.fn(() => new Promise(() => {}));
        renderInvitePage();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
});
