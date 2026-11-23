import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeRCard from "../../common/home/HomeRCard";

const mockRestaurant = {
    id: "r1",
    restaurant_name: "Taco Town",
    photo_URL: "https://example.com/taco.jpg",
    categories: "Mexican, Fast Food",
    customer_rating: 4.2,
    number_customers_rated: 120,
    average_price: 300,
};

const renderCard = (props = {}) =>
    render(
        <MemoryRouter>
            <HomeRCard
                restaurant={mockRestaurant}
                handleRestaurantNavigation={jest.fn()}
                {...props}
            />
        </MemoryRouter>
    );

describe("HomeRCard — favorite icon", () => {
    test("does not show heart when showFavorite is false", () => {
        renderCard({ showFavorite: false });
        expect(screen.queryByTestId("FavoriteBorderIcon")).not.toBeInTheDocument();
        expect(screen.queryByTestId("FavoriteIcon")).not.toBeInTheDocument();
    });

    test("shows outline heart when showFavorite=true and isFavorite=false", () => {
        renderCard({ showFavorite: true, isFavorite: false, onToggleFavorite: jest.fn() });
        expect(screen.getByTestId("FavoriteBorderIcon")).toBeInTheDocument();
    });

    test("shows filled heart when showFavorite=true and isFavorite=true", () => {
        renderCard({ showFavorite: true, isFavorite: true, onToggleFavorite: jest.fn() });
        expect(screen.getByTestId("FavoriteIcon")).toBeInTheDocument();
    });

    test("calls onToggleFavorite with restaurant id on heart click", () => {
        const toggle = jest.fn();
        renderCard({ showFavorite: true, isFavorite: false, onToggleFavorite: toggle });
        const heartButton = screen.getByTestId("FavoriteBorderIcon").closest("button");
        fireEvent.click(heartButton);
        expect(toggle).toHaveBeenCalledWith("r1");
    });

    test("heart click does not trigger card navigation", () => {
        const nav = jest.fn();
        const toggle = jest.fn();
        renderCard({
            showFavorite: true,
            isFavorite: false,
            onToggleFavorite: toggle,
            handleRestaurantNavigation: nav,
        });
        const heartButton = screen.getByTestId("FavoriteBorderIcon").closest("button");
        fireEvent.click(heartButton);
        expect(toggle).toHaveBeenCalled();
        expect(nav).not.toHaveBeenCalled();
    });
});

describe("HomeRCard — restaurant info", () => {
    test("renders restaurant name", () => {
        renderCard();
        expect(screen.getByText("Taco Town")).toBeInTheDocument();
    });

    test("renders categories", () => {
        renderCard();
        expect(screen.getByText("Mexican, Fast Food")).toBeInTheDocument();
    });

    test("renders rating", () => {
        renderCard();
        expect(screen.getByText("4.2")).toBeInTheDocument();
    });

    test("renders average price", () => {
        renderCard();
        expect(screen.getByText(/300 for two/)).toBeInTheDocument();
    });

    test("calls handleRestaurantNavigation on card click", () => {
        const nav = jest.fn();
        renderCard({ handleRestaurantNavigation: nav });
        fireEvent.click(screen.getByText("Taco Town"));
        expect(nav).toHaveBeenCalledWith("r1");
    });
});
