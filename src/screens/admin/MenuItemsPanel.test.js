import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuItemsPanel from "./MenuItemsPanel";

const mockRestaurant = {
    id: "rest-uuid-1",
    restaurant_name: "Pizza Palace",
    status: "ACTIVE",
};

beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("access-token", "admin-tok");
    global.fetch = jest.fn((url, opts) => {
        if (url.includes("/api/item/restaurant/")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id: "item-1", item_name: "Margherita", price: 299, item_type: "VEG" },
                        { id: "item-2", item_name: "Chicken Tikka", price: 449, item_type: "NON_VEG" },
                    ]),
            });
        }
        if (opts && opts.method === "POST" && url.includes("/items")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        items: [{ id: "item-3", item_name: "New Item", price: 199, type: "VEG" }],
                        message: "1 ITEMS ADDED SUCCESSFULLY",
                    }),
            });
        }
        if (opts && opts.method === "PUT" && url.includes("/items/")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: "item-1",
                        item_name: "Updated Item",
                        price: 350,
                        type: "VEG",
                        message: "ITEM UPDATED SUCCESSFULLY",
                    }),
            });
        }
        if (opts && opts.method === "DELETE") {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({ id: "item-1", message: "ITEM DELETED SUCCESSFULLY" }),
            });
        }
        if (opts && opts.method === "POST" && url.includes("/invite")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        token: "inv-token-123",
                        restaurant_name: "Pizza Palace",
                        invite_url: "/invite/inv-token-123",
                        expires_at: "2026-12-01T00:00:00",
                        message: "INVITE LINK GENERATED SUCCESSFULLY",
                    }),
            });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

const renderPanel = (props = {}) =>
    render(<MenuItemsPanel restaurant={mockRestaurant} onBack={jest.fn()} {...props} />);

describe("MenuItemsPanel", () => {
    test("renders restaurant name as heading", async () => {
        renderPanel();
        expect(screen.getByText("Pizza Palace")).toBeInTheDocument();
        expect(screen.getByText("Menu Items")).toBeInTheDocument();
    });

    test("renders menu items from API", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByText("Margherita")).toBeInTheDocument();
        });
        expect(screen.getByText("Chicken Tikka")).toBeInTheDocument();
    });

    test("renders table columns: Name, Price, Type, Actions", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByText("Name")).toBeInTheDocument();
        });
        expect(screen.getByText("Price")).toBeInTheDocument();
        expect(screen.getByText("Type")).toBeInTheDocument();
        expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    test("renders VEG and NON_VEG chips", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByText("VEG")).toBeInTheDocument();
        });
        expect(screen.getByText("NON_VEG")).toBeInTheDocument();
    });

    test("renders Add Item and Generate Invite Link buttons", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Add Item/i })).toBeInTheDocument();
        });
        expect(screen.getByRole("button", { name: /Generate Invite Link/i })).toBeInTheDocument();
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

    test("Add Item form validates empty item name", async () => {
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

    test("Add Item form validates price > 0", async () => {
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
            expect(screen.getByText("Margherita")).toBeInTheDocument();
        });
        const deleteButtons = screen.getAllByTitle("Delete");
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/items/item-1"),
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });

    test("calls back handler when back arrow is clicked", async () => {
        const onBack = jest.fn();
        renderPanel({ onBack });
        const backButton = screen.getByTestId
            ? screen.getAllByRole("button")[0]
            : screen.getAllByRole("button")[0];
        fireEvent.click(backButton);
        expect(onBack).toHaveBeenCalled();
    });

    test("shows 'No menu items yet' when list is empty", async () => {
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

    test("generates invite link and shows dialog", async () => {
        renderPanel();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Generate Invite Link/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /Generate Invite Link/i }));

        await waitFor(() => {
            expect(screen.getByText("Invite Link")).toBeInTheDocument();
        });
        expect(screen.getByDisplayValue(/invite\/inv-token-123/)).toBeInTheDocument();
    });
});
