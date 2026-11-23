import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RestaurantsTab from "./RestaurantsTab";

beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("access-token", "admin-tok");
    global.fetch = jest.fn((url) => {
        if (url.includes("/api/admin/restaurants") && !url.includes("/status") && !url.includes("/items")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        restaurants: [
                            {
                                id: "rest-1",
                                restaurant_name: "Pizza Place",
                                customer_rating: 4.2,
                                number_of_customers_rated: 28,
                                average_price_for_two: 350,
                                status: "ACTIVE",
                            },
                            {
                                id: "rest-2",
                                restaurant_name: "Pending Bistro",
                                customer_rating: 0,
                                number_of_customers_rated: 0,
                                average_price_for_two: 500,
                                status: "PENDING",
                            },
                        ],
                        page: 0,
                        size: 20,
                        total: 2,
                    }),
            });
        }
        if (url.includes("/status")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: "rest-2",
                        restaurant_name: "Pending Bistro",
                        status: "ACTIVE",
                        message: "RESTAURANT STATUS UPDATED SUCCESSFULLY",
                    }),
            });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("RestaurantsTab", () => {
    test("renders restaurant table with correct columns", async () => {
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByText("Pizza Place")).toBeInTheDocument();
        });
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Rating")).toBeInTheDocument();
        expect(screen.getByText("Avg Price")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Action" })).toBeInTheDocument();
    });

    test("renders restaurant names from API", async () => {
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByText("Pizza Place")).toBeInTheDocument();
        });
        expect(screen.getByText("Pending Bistro")).toBeInTheDocument();
    });

    test("renders status chips with correct text", async () => {
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByText("ACTIVE")).toBeInTheDocument();
        });
        expect(screen.getByText("PENDING")).toBeInTheDocument();
    });

    test("renders Approve button for PENDING restaurants", async () => {
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByText("Approve")).toBeInTheDocument();
        });
    });

    test("renders Add Restaurant button", async () => {
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Add Restaurant/i })).toBeInTheDocument();
        });
    });

    test("renders status filter dropdown", async () => {
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByLabelText("Status")).toBeInTheDocument();
        });
    });

    test("calls approve API when Approve button is clicked", async () => {
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByText("Approve")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText("Approve"));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining("/rest-2/status"),
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify({ status: "ACTIVE" }),
                })
            );
        });
    });

    test("opens CreateRestaurantDialog when Add Restaurant is clicked", async () => {
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Add Restaurant/i })).toBeInTheDocument();
        });
        fireEvent.click(screen.getByRole("button", { name: /Add Restaurant/i }));
        await waitFor(() => {
            expect(screen.getByRole("heading", { name: /Add Restaurant/i })).toBeInTheDocument();
        });
    });

    test("shows loading spinner initially", () => {
        render(<RestaurantsTab />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("shows 'No restaurants found' when list is empty", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ restaurants: [], page: 0, size: 20, total: 0 }),
            })
        );
        render(<RestaurantsTab />);
        await waitFor(() => {
            expect(screen.getByText("No restaurants found.")).toBeInTheDocument();
        });
    });
});
