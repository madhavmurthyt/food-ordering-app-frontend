import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Admin from "./Admin";

beforeEach(() => {
    sessionStorage.clear();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    total_orders: 42,
                    total_revenue: 12345.67,
                    active_users: 10,
                    total_restaurants: 5,
                }),
        })
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

const renderAdmin = () =>
    render(
        <MemoryRouter>
            <Admin />
        </MemoryRouter>
    );

describe("Admin – access control", () => {
    test("shows 403 for non-admin user", () => {
        sessionStorage.setItem("access-token", "tok");
        sessionStorage.setItem("role", "CUSTOMER");
        renderAdmin();
        expect(screen.getByText("403")).toBeInTheDocument();
        expect(
            screen.getByText("You are not authorized to access this page.")
        ).toBeInTheDocument();
    });

    test("shows Go Home link on 403 page", () => {
        sessionStorage.setItem("access-token", "tok");
        sessionStorage.setItem("role", "CUSTOMER");
        renderAdmin();
        expect(screen.getByText("Go Home")).toBeInTheDocument();
    });

    test("renders nothing (null) when not logged in", () => {
        const { container } = renderAdmin();
        expect(container.innerHTML).toBe("");
    });
});

describe("Admin – authorized admin", () => {
    beforeEach(() => {
        sessionStorage.setItem("access-token", "admin-tok");
        sessionStorage.setItem("role", "ADMIN");
    });

    test("renders sidebar nav items", async () => {
        renderAdmin();
        expect(screen.getAllByText("Dashboard").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Restaurants").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Users").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Orders").length).toBeGreaterThanOrEqual(1);
    });

    test("renders ADMIN label", () => {
        renderAdmin();
        expect(screen.getByText("ADMIN")).toBeInTheDocument();
    });

    test("renders brand name in sidebar", () => {
        renderAdmin();
        expect(screen.getByText("Food Ordering App")).toBeInTheDocument();
    });

    test("Dashboard tab is active by default", () => {
        renderAdmin();
        const header = screen.getAllByText("Dashboard");
        expect(header.length).toBeGreaterThanOrEqual(2);
    });

    test("clicking Restaurants tab switches content", async () => {
        renderAdmin();
        fireEvent.click(screen.getByText("Restaurants"));
        await waitFor(() => {
            const headers = screen.getAllByText("Restaurants");
            expect(headers.length).toBeGreaterThanOrEqual(2);
        });
    });

    test("clicking Users tab switches content", async () => {
        renderAdmin();
        fireEvent.click(screen.getByText("Users"));
        await waitFor(() => {
            const headers = screen.getAllByText("Users");
            expect(headers.length).toBeGreaterThanOrEqual(2);
        });
    });

    test("clicking Orders tab switches content", async () => {
        renderAdmin();
        fireEvent.click(screen.getByText("Orders"));
        await waitFor(() => {
            const headers = screen.getAllByText("Orders");
            expect(headers.length).toBeGreaterThanOrEqual(2);
        });
    });
});

describe("Admin – DashboardTab renders stats", () => {
    beforeEach(() => {
        sessionStorage.setItem("access-token", "admin-tok");
        sessionStorage.setItem("role", "ADMIN");
    });

    test("shows stat tile labels after fetch", async () => {
        renderAdmin();
        await waitFor(() => {
            expect(screen.getByText("Total Orders")).toBeInTheDocument();
        });
        expect(screen.getByText("Total Revenue")).toBeInTheDocument();
        expect(screen.getByText("Active Users")).toBeInTheDocument();
        expect(screen.getAllByText("Restaurants").length).toBeGreaterThanOrEqual(1);
    });

    test("shows error when fetch fails", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("fail")));
        renderAdmin();
        await waitFor(() => {
            expect(
                screen.getByText("Failed to load dashboard data.")
            ).toBeInTheDocument();
        });
    });
});
