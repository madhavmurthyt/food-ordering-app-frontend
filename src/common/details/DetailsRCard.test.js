import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DetailsRCard from "./DetailsRCard";

const mockRestaurant = {
    id: "rest-uuid-123",
    restaurant_name: "Test Restaurant",
    photo_URL: "https://example.com/photo.jpg",
    customer_rating: 4.2,
    number_customers_rated: 50,
    average_price: 350,
    address: { locality: "MG Road" },
    categories: [
        { id: "c1", category_name: "Indian" },
        { id: "c2", category_name: "Chinese" },
    ],
};

beforeEach(() => {
    sessionStorage.clear();
    jest.restoreAllMocks();
});

describe("DetailsRCard — display", () => {
    test("renders restaurant name, locality, categories", () => {
        render(<DetailsRCard restaurant={mockRestaurant} />);
        expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
        expect(screen.getByText("MG Road")).toBeInTheDocument();
        expect(screen.getByText("Indian, Chinese")).toBeInTheDocument();
    });

    test("renders current rating and count", () => {
        render(<DetailsRCard restaurant={mockRestaurant} />);
        expect(screen.getByText("4.2")).toBeInTheDocument();
        expect(screen.getByText("(50)")).toBeInTheDocument();
    });

    test("renders average price", () => {
        render(<DetailsRCard restaurant={mockRestaurant} />);
        expect(screen.getByText("350 for two")).toBeInTheDocument();
    });

    test("renders MUI Rating widget with label Rate:", () => {
        render(<DetailsRCard restaurant={mockRestaurant} />);
        expect(screen.getByText("Rate:")).toBeInTheDocument();
        const radios = screen.getAllByRole("radio");
        expect(radios.length).toBeGreaterThan(0);
    });
});

describe("DetailsRCard — rating (not logged in)", () => {
    test("shows 'Please login to rate!' snackbar when not logged in", async () => {
        render(<DetailsRCard restaurant={mockRestaurant} />);
        const stars = screen.getAllByRole("radio");
        await userEvent.click(stars[4]);
        await waitFor(() => {
            expect(screen.getByText("Please login to rate!")).toBeInTheDocument();
        });
    });
});

describe("DetailsRCard — rating (logged in)", () => {
    beforeEach(() => {
        sessionStorage.setItem("access-token", "test-token");
    });

    test("submits rating and shows success snackbar", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        customer_rating: 4.5,
                        number_customers_rated: 51,
                    }),
            })
        );
        const onRatingUpdate = jest.fn();
        render(
            <DetailsRCard
                restaurant={mockRestaurant}
                onRatingUpdate={onRatingUpdate}
            />
        );
        const stars = screen.getAllByRole("radio");
        await userEvent.click(stars[4]);
        await waitFor(() => {
            expect(screen.getByText("Thanks for rating!")).toBeInTheDocument();
        });
        expect(global.fetch).toHaveBeenCalledTimes(1);
        const fetchUrl = global.fetch.mock.calls[0][0];
        expect(fetchUrl).toContain("/api/restaurant/rest-uuid-123?customer_rating=");
        expect(onRatingUpdate).toHaveBeenCalledWith(4.5, 51);
    });

    test("disables rating widget after successful submission", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        customer_rating: 4.5,
                        number_customers_rated: 51,
                    }),
            })
        );
        render(<DetailsRCard restaurant={mockRestaurant} />);
        const stars = screen.getAllByRole("radio");
        await userEvent.click(stars[4]);
        await waitFor(() => {
            expect(screen.getByText("Rated:")).toBeInTheDocument();
        });
    });

    test("shows error snackbar on API failure", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: false, status: 500 })
        );
        render(<DetailsRCard restaurant={mockRestaurant} />);
        const stars = screen.getAllByRole("radio");
        await userEvent.click(stars[4]);
        await waitFor(() => {
            expect(
                screen.getByText("Failed to submit rating. Please try again.")
            ).toBeInTheDocument();
        });
    });

    test("sends Bearer token in authorization header", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        customer_rating: 4.5,
                        number_customers_rated: 51,
                    }),
            })
        );
        render(<DetailsRCard restaurant={mockRestaurant} />);
        const stars = screen.getAllByRole("radio");
        await userEvent.click(stars[4]);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });
        const fetchOptions = global.fetch.mock.calls[0][1];
        expect(fetchOptions.method).toBe("PUT");
        expect(fetchOptions.headers.authorization).toBe("Bearer test-token");
    });
});
