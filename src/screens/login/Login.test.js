import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

const renderLogin = () =>
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

beforeEach(() => {
    sessionStorage.clear();
    delete window.google;
});

describe("Login page – login mode", () => {
    test("renders brand header with app name", () => {
        renderLogin();
        expect(screen.getAllByText("Food Ordering App").length).toBeGreaterThanOrEqual(1);
    });

    test("renders Contact No. and Password fields", () => {
        renderLogin();
        expect(screen.getByLabelText(/Contact No/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    test("renders Login button", () => {
        renderLogin();
        expect(
            screen.getByRole("button", { name: /^Login$/i })
        ).toBeInTheDocument();
    });

    test("renders Google Sign-In container", () => {
        renderLogin();
        expect(document.getElementById("google-signin-btn")).toBeInTheDocument();
    });

    test('renders "or continue with phone number" divider', () => {
        renderLogin();
        expect(
            screen.getByText(/or continue with phone number/i)
        ).toBeInTheDocument();
    });

    test("shows validation errors when login submitted empty", () => {
        renderLogin();
        fireEvent.click(screen.getByRole("button", { name: /^Login$/i }));
        expect(screen.getAllByText("required")).toHaveLength(2);
    });

    test("shows invalid contact error for non-10-digit number", () => {
        renderLogin();
        fireEvent.change(screen.getByLabelText(/Contact No/i), {
            target: { value: "123" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "pass" },
        });
        fireEvent.click(screen.getByRole("button", { name: /^Login$/i }));
        expect(screen.getByText("Invalid Contact")).toBeInTheDocument();
    });
});

describe("Login page – switching to signup mode", () => {
    test('clicking "Sign up" switches to signup form', () => {
        renderLogin();
        fireEvent.click(screen.getByText("Sign up"));
        expect(screen.getByText("Create an account")).toBeInTheDocument();
    });

    test("signup form renders all required fields", () => {
        renderLogin();
        fireEvent.click(screen.getByText("Sign up"));
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contact No/i)).toBeInTheDocument();
    });

    test("signup form renders Sign Up button", () => {
        renderLogin();
        fireEvent.click(screen.getByText("Sign up"));
        expect(
            screen.getByRole("button", { name: /Sign Up/i })
        ).toBeInTheDocument();
    });

    test("Google Sign-In is hidden in signup mode", () => {
        renderLogin();
        fireEvent.click(screen.getByText("Sign up"));
        expect(
            screen.queryByText(/or continue with phone number/i)
        ).not.toBeInTheDocument();
    });

    test("shows validation errors when signup submitted empty", () => {
        renderLogin();
        fireEvent.click(screen.getByText("Sign up"));
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
        expect(screen.getAllByText("required").length).toBeGreaterThanOrEqual(3);
    });

    test("shows email validation error for invalid email", () => {
        renderLogin();
        fireEvent.click(screen.getByText("Sign up"));
        fireEvent.change(screen.getByLabelText(/First Name/i), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: "notanemail" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "Strong@123" },
        });
        fireEvent.change(screen.getByLabelText(/Contact No/i), {
            target: { value: "9876543210" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
        expect(screen.getByText("Invalid Email")).toBeInTheDocument();
    });

    test("shows weak password error", () => {
        renderLogin();
        fireEvent.click(screen.getByText("Sign up"));
        fireEvent.change(screen.getByLabelText(/First Name/i), {
            target: { value: "John" },
        });
        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: "john@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: "weak" },
        });
        fireEvent.change(screen.getByLabelText(/Contact No/i), {
            target: { value: "9876543210" },
        });
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
        expect(
            screen.getByText(/Must contain uppercase/i)
        ).toBeInTheDocument();
    });

    test('switching back to login clears errors', () => {
        renderLogin();
        fireEvent.click(screen.getByText("Sign up"));
        fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));
        expect(screen.getAllByText("required").length).toBeGreaterThan(0);
        fireEvent.click(screen.getByText("Login"));
        expect(screen.queryByText("required")).not.toBeInTheDocument();
    });
});

describe("Login page – already logged in", () => {
    test("shows Welcome back when access-token exists", () => {
        sessionStorage.setItem("access-token", "some-token");
        renderLogin();
        expect(screen.getByText("Welcome back")).toBeInTheDocument();
    });
});
