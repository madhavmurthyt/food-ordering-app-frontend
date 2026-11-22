import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateRestaurantDialog from "./CreateRestaurantDialog";

beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("access-token", "admin-tok");
    global.fetch = jest.fn((url) => {
        if (url.includes("/api/states")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        states: [
                            { id: "state-1", state_name: "Maharashtra" },
                            { id: "state-2", state_name: "Karnataka" },
                        ],
                    }),
            });
        }
        if (url.includes("/api/category")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        categories: [
                            { id: "cat-1", category_name: "Chinese" },
                            { id: "cat-2", category_name: "Italian" },
                        ],
                    }),
            });
        }
        if (url.includes("/api/admin/restaurants")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: "new-uuid",
                        restaurant_name: "Test Restaurant",
                        status: "ACTIVE",
                        message: "RESTAURANT CREATED SUCCESSFULLY",
                    }),
            });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

const renderDialog = (props = {}) =>
    render(
        <CreateRestaurantDialog
            open={true}
            onClose={jest.fn()}
            onCreated={jest.fn()}
            {...props}
        />
    );

describe("CreateRestaurantDialog", () => {
    test("renders dialog title 'Add Restaurant'", () => {
        renderDialog();
        expect(screen.getByText("Add Restaurant")).toBeInTheDocument();
    });

    test("renders required form fields", () => {
        renderDialog();
        expect(screen.getByLabelText(/Restaurant Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Photo URL/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Avg Price for Two/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Flat/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Locality/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    });

    test("renders Create and Cancel buttons", () => {
        renderDialog();
        expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    });

    test("shows error when name is empty on submit", async () => {
        renderDialog();
        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        expect(screen.getByText("Restaurant name is required.")).toBeInTheDocument();
    });

    test("shows error when avg price is empty on submit", async () => {
        renderDialog();
        await userEvent.type(screen.getByLabelText(/Restaurant Name/i), "Test");
        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        expect(screen.getByText("Average price must be greater than 0.")).toBeInTheDocument();
    });

    test("calls onClose when Cancel is clicked", () => {
        const onClose = jest.fn();
        renderDialog({ onClose });
        fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
        expect(onClose).toHaveBeenCalled();
    });

    test("loads states and categories when dialog opens", async () => {
        renderDialog();
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/states"),
                expect.any(Object)
            );
        });
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/category"),
            expect.any(Object)
        );
    });

    test("renders category chips after fetch", async () => {
        renderDialog();
        await waitFor(() => {
            expect(screen.getByText("Chinese")).toBeInTheDocument();
        });
        expect(screen.getByText("Italian")).toBeInTheDocument();
    });

    test("does not render when open is false", () => {
        const { container } = render(
            <CreateRestaurantDialog open={false} onClose={jest.fn()} onCreated={jest.fn()} />
        );
        expect(container.querySelector("[role='dialog']")).not.toBeInTheDocument();
    });

    test("calls onCreated after successful submit", async () => {
        const onCreated = jest.fn();
        const onClose = jest.fn();
        renderDialog({ onCreated, onClose });

        await userEvent.type(screen.getByLabelText(/Restaurant Name/i), "Pizza Palace");
        await userEvent.type(screen.getByLabelText(/Avg Price for Two/i), "350");

        await waitFor(() => {
            expect(screen.getByText("Chinese")).toBeInTheDocument();
        });

        const stateSelect = screen.getByLabelText(/State/i);
        fireEvent.mouseDown(stateSelect);
        await waitFor(() => {
            expect(screen.getByText("Maharashtra")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Maharashtra"));

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/admin/restaurants"),
                expect.objectContaining({ method: "POST" })
            );
        });

        await waitFor(() => {
            expect(onCreated).toHaveBeenCalled();
        });
    });

    test("shows error message on API failure", async () => {
        global.fetch = jest.fn((url) => {
            if (url.includes("/api/states")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ states: [{ id: "s1", state_name: "MH" }] }),
                });
            }
            if (url.includes("/api/category")) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ categories: [] }),
                });
            }
            return Promise.resolve({
                ok: false,
                text: () => Promise.resolve(JSON.stringify({ message: "State not found" })),
            });
        });

        renderDialog();
        await userEvent.type(screen.getByLabelText(/Restaurant Name/i), "Test");
        await userEvent.type(screen.getByLabelText(/Avg Price for Two/i), "100");

        await waitFor(() => {
            const stateSelect = screen.getByLabelText(/State/i);
            expect(stateSelect).toBeInTheDocument();
        });

        const stateSelect = screen.getByLabelText(/State/i);
        fireEvent.mouseDown(stateSelect);
        await waitFor(() => {
            expect(screen.getByText("MH")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("MH"));

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));

        await waitFor(() => {
            expect(screen.getByText("State not found")).toBeInTheDocument();
        });
    });
});
