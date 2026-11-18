import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

const renderHeader = (props = {}) =>
    render(
        <MemoryRouter>
            <Header {...props} />
        </MemoryRouter>
    );

beforeEach(() => {
    sessionStorage.clear();
});

describe("Header – logged out", () => {
    test("renders brand name", () => {
        renderHeader();
        expect(screen.getByText("Food Ordering App")).toBeInTheDocument();
    });

    test("shows Login button when not logged in", () => {
        renderHeader();
        expect(screen.getByRole("link", { name: /Login/i })).toBeInTheDocument();
    });

    test("Login button links to /login", () => {
        renderHeader();
        const link = screen.getByRole("link", { name: /Login/i });
        expect(link).toHaveAttribute("href", "/login");
    });
});

describe("Header – logged in", () => {
    beforeEach(() => {
        sessionStorage.setItem("access-token", "test-token");
        sessionStorage.setItem("first-name", "Alice");
        sessionStorage.setItem("uuid", "u1");
    });

    test("shows user first name", () => {
        renderHeader();
        expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    test("shows avatar with initial", () => {
        renderHeader();
        expect(screen.getByText("A")).toBeInTheDocument();
    });

    test("hides Login button", () => {
        renderHeader();
        expect(screen.queryByRole("link", { name: /Login/i })).not.toBeInTheDocument();
    });

    test("opens menu on avatar click with My Profile and Logout", () => {
        renderHeader();
        fireEvent.click(screen.getByText("Alice"));
        expect(screen.getByText("My Profile")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    test("My Profile links to /profile", () => {
        renderHeader();
        fireEvent.click(screen.getByText("Alice"));
        expect(screen.getByRole("menuitem", { name: /My Profile/i }))
            .toHaveAttribute("href", "/profile");
    });
});

describe("Header – search bar", () => {
    test("search bar hidden when showSearch is false", () => {
        renderHeader({ showSearch: false });
        expect(
            screen.queryByPlaceholderText(/Search by Restaurant Name/i)
        ).not.toBeInTheDocument();
    });

    test("search bar visible when showSearch is true", () => {
        renderHeader({ showSearch: true });
        expect(
            screen.getByPlaceholderText(/Search by Restaurant Name/i)
        ).toBeInTheDocument();
    });

    test("search bar calls searchHandler on input", () => {
        const handler = jest.fn();
        renderHeader({ showSearch: true, searchHandler: handler });
        fireEvent.change(
            screen.getByPlaceholderText(/Search by Restaurant Name/i),
            { target: { value: "Pizza" } }
        );
        expect(handler).toHaveBeenCalled();
    });
});
