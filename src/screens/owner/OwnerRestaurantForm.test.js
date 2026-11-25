import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OwnerRestaurantForm from "./OwnerRestaurantForm";

beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("access-token", "owner-tok");
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
        if (url.includes("/restaurant") || url.includes("/api/restaurant")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: "new-uuid",
                        restaurant_name: "Test Restaurant",
                        status: "PENDING",
                        message: "RESTAURANT CREATED — PENDING ADMIN APPROVAL",
                    }),
            });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("OwnerRestaurantForm — Create mode", () => {
    test("renders 'Create Restaurant' heading", () => {
        render(<OwnerRestaurantForm onSaved={jest.fn()} onCancel={jest.fn()} />);
        expect(screen.getByText("Create Restaurant")).toBeInTheDocument();
    });

    test("renders all required form fields", () => {
        render(<OwnerRestaurantForm onSaved={jest.fn()} onCancel={jest.fn()} />);
        expect(screen.getByLabelText(/Restaurant Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Photo URL/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Avg Price for Two/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Flat/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Locality/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    });

    test("renders Create and Cancel buttons", () => {
        render(<OwnerRestaurantForm onSaved={jest.fn()} onCancel={jest.fn()} />);
        expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
    });

    test("shows error when name is empty on submit", () => {
        render(<OwnerRestaurantForm onSaved={jest.fn()} onCancel={jest.fn()} />);
        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        expect(screen.getByText("Restaurant name is required.")).toBeInTheDocument();
    });

    test("shows error when avg price is empty on submit", async () => {
        render(<OwnerRestaurantForm onSaved={jest.fn()} onCancel={jest.fn()} />);
        await userEvent.type(screen.getByLabelText(/Restaurant Name/i), "Test");
        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        expect(screen.getByText("Average price must be greater than 0.")).toBeInTheDocument();
    });

    test("shows error when no state selected", async () => {
        render(<OwnerRestaurantForm onSaved={jest.fn()} onCancel={jest.fn()} />);
        await userEvent.type(screen.getByLabelText(/Restaurant Name/i), "Test");
        await userEvent.type(screen.getByLabelText(/Avg Price for Two/i), "300");
        fireEvent.click(screen.getByRole("button", { name: /Create/i }));
        expect(screen.getByText("Please select a state.")).toBeInTheDocument();
    });

    test("calls onCancel when Cancel is clicked", () => {
        const onCancel = jest.fn();
        render(<OwnerRestaurantForm onSaved={jest.fn()} onCancel={onCancel} />);
        fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
        expect(onCancel).toHaveBeenCalled();
    });

    test("loads states from API", async () => {
        render(<OwnerRestaurantForm onSaved={jest.fn()} onCancel={jest.fn()} />);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/api/states"),
                expect.any(Object)
            );
        });
    });

    test("calls onSaved after successful creation", async () => {
        const onSaved = jest.fn();
        render(<OwnerRestaurantForm onSaved={onSaved} onCancel={jest.fn()} />);

        await userEvent.type(screen.getByLabelText(/Restaurant Name/i), "New Place");
        await userEvent.type(screen.getByLabelText(/Avg Price for Two/i), "350");

        await waitFor(() => {
            expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
        });

        const stateSelect = screen.getByLabelText(/State/i);
        fireEvent.mouseDown(stateSelect);
        await waitFor(() => {
            expect(screen.getByText("Maharashtra")).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Maharashtra"));

        fireEvent.click(screen.getByRole("button", { name: /Create/i }));

        await waitFor(() => {
            expect(onSaved).toHaveBeenCalled();
        });
    });
});

describe("OwnerRestaurantForm — Edit mode", () => {
    const existingRestaurant = {
        id: "rest-uuid",
        restaurant_name: "Pizza Palace",
        photo_url: "https://example.com/photo.jpg",
        average_price_for_two: 400,
        address: {
            flat_building_name: "123 Main St",
            locality: "MG Road",
            city: "Bangalore",
            pincode: "560001",
            state: { id: "state-1" },
        },
    };

    test("renders 'Edit Restaurant' heading", () => {
        render(<OwnerRestaurantForm restaurant={existingRestaurant} onSaved={jest.fn()} onCancel={jest.fn()} />);
        expect(screen.getByText("Edit Restaurant")).toBeInTheDocument();
    });

    test("pre-fills form fields from restaurant prop", () => {
        render(<OwnerRestaurantForm restaurant={existingRestaurant} onSaved={jest.fn()} onCancel={jest.fn()} />);
        expect(screen.getByLabelText(/Restaurant Name/i)).toHaveValue("Pizza Palace");
        expect(screen.getByLabelText(/Photo URL/i)).toHaveValue("https://example.com/photo.jpg");
        expect(screen.getByLabelText(/Avg Price for Two/i)).toHaveValue(400);
    });

    test("renders Update button in edit mode", () => {
        render(<OwnerRestaurantForm restaurant={existingRestaurant} onSaved={jest.fn()} onCancel={jest.fn()} />);
        expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
    });
});
