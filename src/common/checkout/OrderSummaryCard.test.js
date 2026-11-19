import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderSummaryCard from "./OrderSummaryCard";

const mockOrderItems = [
    { id: "i1", name: "Butter Chicken", type: "NON_VEG", quantity: 2, price: 600, itemPrice: 300 },
    { id: "i2", name: "Naan", type: "VEG", quantity: 3, price: 150, itemPrice: 50 },
];

const defaultProps = {
    restaurantName: "Test Restaurant",
    netAmount: 750,
    orderItems: mockOrderItems,
    handlePlaceOrder: jest.fn(),
    discount: 0,
    couponName: null,
    onApplyCoupon: jest.fn(),
    onRemoveCoupon: jest.fn(),
};

beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("access-token", "test-token");
    jest.restoreAllMocks();
});

describe("OrderSummaryCard — display", () => {
    test("renders Summary heading and restaurant name", () => {
        render(<OrderSummaryCard {...defaultProps} />);
        expect(screen.getByText("Summary")).toBeInTheDocument();
        expect(screen.getByText("Test Restaurant")).toBeInTheDocument();
    });

    test("renders net amount", () => {
        render(<OrderSummaryCard {...defaultProps} />);
        expect(screen.getByText("750.00")).toBeInTheDocument();
    });

    test("renders Place Order button", () => {
        render(<OrderSummaryCard {...defaultProps} />);
        expect(screen.getByRole("button", { name: "Place Order" })).toBeInTheDocument();
    });

    test("renders coupon text field and Apply button when no coupon applied", () => {
        render(<OrderSummaryCard {...defaultProps} />);
        expect(screen.getByPlaceholderText("Coupon code")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    });
});

describe("OrderSummaryCard — apply coupon", () => {
    test("Apply button is disabled when coupon field is empty", () => {
        render(<OrderSummaryCard {...defaultProps} />);
        expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    });

    test("calls API and onApplyCoupon on valid coupon", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: "c-uuid", couponName: "FLAT10", percent: 10 }),
            })
        );
        const onApplyCoupon = jest.fn();
        render(<OrderSummaryCard {...defaultProps} onApplyCoupon={onApplyCoupon} />);
        const input = screen.getByPlaceholderText("Coupon code");
        await userEvent.type(input, "FLAT10");
        await userEvent.click(screen.getByRole("button", { name: "Apply" }));
        await waitFor(() => {
            expect(onApplyCoupon).toHaveBeenCalledWith("FLAT10", 10);
        });
        const fetchUrl = global.fetch.mock.calls[0][0];
        expect(fetchUrl).toContain("/api/order/coupon/FLAT10");
    });

    test("shows error text on invalid coupon", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: false, status: 404 })
        );
        render(<OrderSummaryCard {...defaultProps} />);
        const input = screen.getByPlaceholderText("Coupon code");
        await userEvent.type(input, "BADCODE");
        await userEvent.click(screen.getByRole("button", { name: "Apply" }));
        await waitFor(() => {
            expect(screen.getByText("Invalid or expired coupon code.")).toBeInTheDocument();
        });
        expect(defaultProps.onApplyCoupon).not.toHaveBeenCalled();
    });

    test("submits coupon on Enter key", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: "c-uuid", couponName: "SAVE20", percent: 20 }),
            })
        );
        const onApplyCoupon = jest.fn();
        render(<OrderSummaryCard {...defaultProps} onApplyCoupon={onApplyCoupon} />);
        const input = screen.getByPlaceholderText("Coupon code");
        await userEvent.type(input, "SAVE20");
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
        await waitFor(() => {
            expect(onApplyCoupon).toHaveBeenCalledWith("SAVE20", 20);
        });
    });
});

describe("OrderSummaryCard — coupon applied", () => {
    const appliedProps = {
        ...defaultProps,
        couponName: "FLAT10",
        discount: 75,
    };

    test("shows green Applied chip and coupon name", () => {
        render(<OrderSummaryCard {...appliedProps} />);
        expect(screen.getByText("FLAT10")).toBeInTheDocument();
        expect(screen.getByText("Applied")).toBeInTheDocument();
    });

    test("shows subtotal, discount, and reduced net amount", () => {
        render(<OrderSummaryCard {...appliedProps} />);
        expect(screen.getByText("Subtotal")).toBeInTheDocument();
        expect(screen.getByText("750.00")).toBeInTheDocument();
        expect(screen.getByText("Discount")).toBeInTheDocument();
        expect(screen.getByText("-₹75.00")).toBeInTheDocument();
        expect(screen.getByText("675.00")).toBeInTheDocument();
    });

    test("hides coupon input field when coupon is applied", () => {
        render(<OrderSummaryCard {...appliedProps} />);
        expect(screen.queryByPlaceholderText("Coupon code")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Apply" })).not.toBeInTheDocument();
    });

    test("shows Remove link that calls onRemoveCoupon", async () => {
        const onRemoveCoupon = jest.fn();
        render(<OrderSummaryCard {...appliedProps} onRemoveCoupon={onRemoveCoupon} />);
        const removeLink = screen.getByText("Remove");
        await userEvent.click(removeLink);
        expect(onRemoveCoupon).toHaveBeenCalledTimes(1);
    });
});

describe("OrderSummaryCard — Place Order", () => {
    test("calls handlePlaceOrder when button clicked", async () => {
        const handlePlaceOrder = jest.fn();
        render(<OrderSummaryCard {...defaultProps} handlePlaceOrder={handlePlaceOrder} />);
        await userEvent.click(screen.getByRole("button", { name: "Place Order" }));
        expect(handlePlaceOrder).toHaveBeenCalledTimes(1);
    });
});
