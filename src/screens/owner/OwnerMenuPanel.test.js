import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OwnerMenuPanel from "./OwnerMenuPanel";

const mockRestaurant = {
    id: "rest-uuid-1",
    restaurant_name: "My Pasta House",
    status: "ACTIVE",
};

beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("access-token", "owner-tok");
    global.fetch = jest.fn((url, opts) => {
        if (url.includes("/api/item/restaurant/")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id: "item-1", item_name: "Spaghetti", price: 250, item_type: "VEG" },
                        { id: "item-2", item_name: "Grilled Chicken", price: 450, item_type: "NON_VEG" },
                    ]),
            });
        }
        if (opts && opts.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: "item-3",
                        item_name: "New Item",
                        price: 199,
                        type: "VEG",
                        message: "Item added!",
                    }),
            });
        }
        if (opts && opts.method === "PUT") {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: "item-1",
                        item_name: "Updated Item",
                        price: 350,
                        type: "VEG",
                    }),
            });
        }
        if (opts && opts.method === "DELETE") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: "item-1", message: "Item deleted." }),
            });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

const renderPanel = (props = {}) =>
    render(<OwnerMenuPanel restaurant={mockRestaurant} onBack={jest.fn()} {...props} />);

describe("OwnerMenuPanel", () => {
    test("renders restaurant name as heading", () => {
        renderPanel();
        expect(screen.getByText("My Pasta House")).toBeInTheDocument();
        expect(screen.getByText("Menu Items")).toBeInTheDocument();
    });

    test("renders menu items from API", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByText("Spaghetti")).toBeInTheDocument();
        });
        expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
    });

    test("renders table columns", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByText("Name")).toBeInTheDocument();
        });
        expect(screen.getByText("Price")).toBeInTheDocument();
        expect(screen.getByText("Type")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();
    });

    test("renders VEG and NON_VEG chips", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByText("VEG")).toBeInTheDocument();
        });
        expect(screen.getByText("NON_VEG")).toBeInTheDocument();
    });

    test("renders Add Item button", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Add Item/i })).toBeInTheDocument();
        });
    });

    test("opens Add Item dialog when button is clicked", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Add Item/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /Add Item/i }));
        await waitFor(() => {
            expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
        });
        expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    });

    test("validates empty item name in dialog", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Add Item/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /Add Item/i }));
        await waitFor(() => {
            expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /Save/i }));
        expect(screen.getByText("Item name is required.")).toBeInTheDocument();
    });

    test("validates price > 0 in dialog", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Add Item/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /Add Item/i }));
        await waitFor(() => {
            expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
        });
        await userEvent.type(screen.getByLabelText(/Item Name/i), "Test");
        fireEvent.click(screen.getByRole("button", { name: /Save/i }));
        expect(screen.getByText("Price must be greater than 0.")).toBeInTheDocument();
    });

    test("calls DELETE API when delete icon is clicked", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByText("Spaghetti")).toBeInTheDocument();
        });
        const deleteButtons = screen.getAllByTitle("Delete");
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/item/item-1"),
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });

    test("calls onBack when back arrow is clicked", () => {
        const onBack = jest.fn();
        renderPanel({ onBack });
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);
        expect(onBack).toHaveBeenCalled();
    });

    test("shows empty state when no items", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        );
        renderPanel();
        await waitFor(() => {
            expect(screen.getByText(/No menu items yet/i)).toBeInTheDocument();
        });
    });

    test("shows loading spinner initially", () => {
        renderPanel();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
});
