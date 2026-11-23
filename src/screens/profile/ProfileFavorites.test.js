import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "./Profile";

beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("access-token", "test-token");
    sessionStorage.setItem("first-name", "Alice");
    sessionStorage.setItem("uuid", "u1");
});

afterEach(() => {
    jest.restoreAllMocks();
});

const mockFavorites = [
    {
        id: "r1",
        restaurant_name: "Pasta Palace",
        photo_URL: "https://example.com/pasta.jpg",
        categories: "Italian",
        customer_rating: 4.5,
        number_customers_rated: 200,
        average_price: 500,
    },
    {
        id: "r2",
        restaurant_name: "Sushi Spot",
        photo_URL: "https://example.com/sushi.jpg",
        categories: "Japanese",
        customer_rating: 4.8,
        number_customers_rated: 150,
        average_price: 800,
    },
];

const setupFetch = (favorites = mockFavorites) => {
    global.fetch = jest.fn((url) => {
        if (url.includes("/favorites")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ restaurants: favorites }),
            });
        }
        if (url.includes("/order")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ orders: [] }),
            });
        }
        if (url.includes("/address")) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ addresses: [] }),
            });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
};

const renderProfile = () =>
    render(
        <MemoryRouter>
            <Profile />
        </MemoryRouter>
    );

describe("Profile — Favorites tab", () => {
    test("shows Favorites tab label", async () => {
        setupFetch();
        renderProfile();
        expect(screen.getByRole("tab", { name: /Favorites/i })).toBeInTheDocument();
    });

    test("shows favorite restaurants when Favorites tab is clicked", async () => {
        setupFetch();
        renderProfile();
        fireEvent.click(screen.getByRole("tab", { name: /Favorites/i }));
        await waitFor(() => {
            expect(screen.getByText("Pasta Palace")).toBeInTheDocument();
            expect(screen.getByText("Sushi Spot")).toBeInTheDocument();
        });
    });

    test("shows empty state when no favorites", async () => {
        setupFetch([]);
        renderProfile();
        fireEvent.click(screen.getByRole("tab", { name: /Favorites/i }));
        await waitFor(() => {
            expect(
                screen.getByText(/No favorites yet/i)
            ).toBeInTheDocument();
        });
    });

    test("shows filled heart icons on favorite cards", async () => {
        setupFetch();
        renderProfile();
        fireEvent.click(screen.getByRole("tab", { name: /Favorites/i }));
        await waitFor(() => {
            expect(screen.getByText("Pasta Palace")).toBeInTheDocument();
        });
        const hearts = screen.getAllByTestId("FavoriteIcon");
        expect(hearts.length).toBe(2);
    });

    test("removes favorite when heart is clicked", async () => {
        setupFetch();
        renderProfile();
        fireEvent.click(screen.getByRole("tab", { name: /Favorites/i }));
        await waitFor(() => {
            expect(screen.getByText("Pasta Palace")).toBeInTheDocument();
        });

        global.fetch.mockImplementation((url, opts) => {
            if (url.includes("/favorites/") && opts.method === "DELETE") {
                return Promise.resolve({ ok: true });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        });

        const hearts = screen.getAllByTestId("FavoriteIcon");
        const firstHeartButton = hearts[0].closest("button");
        fireEvent.click(firstHeartButton);

        await waitFor(() => {
            expect(screen.queryByText("Pasta Palace")).not.toBeInTheDocument();
        });
    });

    test("tab indices are correct: Orders=0, Favorites=1, Addresses=2, Settings=3", () => {
        setupFetch();
        renderProfile();
        const tabs = screen.getAllByRole("tab");
        expect(tabs[0]).toHaveTextContent("Orders");
        expect(tabs[1]).toHaveTextContent("Favorites");
        expect(tabs[2]).toHaveTextContent("Addresses");
        expect(tabs[3]).toHaveTextContent("Settings");
    });
});
