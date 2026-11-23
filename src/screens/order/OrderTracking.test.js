import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import OrderTracking from "./OrderTracking";

beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem("access-token", "test-token");
    jest.useFakeTimers();
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
});

const renderTracking = (orderId = "abc-123-def") =>
    render(
        <MemoryRouter initialEntries={[`/order/${orderId}/track`]}>
            <Routes>
                <Route path="/order/:orderId/track" element={<OrderTracking />} />
                <Route path="/profile" element={<div>Profile Page</div>} />
                <Route path="/" element={<div>Home Page</div>} />
            </Routes>
        </MemoryRouter>
    );

const mockOrder = (status, extras = {}) => ({
    id: "abc-123-def",
    status,
    restaurant_name: "Burger Barn",
    items: [
        { item_name: "Classic Burger", quantity: 2 },
        { item_name: "Fries", quantity: 1 },
    ],
    bill: 450,
    timestamps: { placed: "2026-11-23T10:00:00Z" },
    ...extras,
});

describe("OrderTracking — loading state", () => {
    test("shows loading spinner while fetching", () => {
        global.fetch = jest.fn(() => new Promise(() => {}));
        renderTracking();
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
});

describe("OrderTracking — error state", () => {
    test("shows error message on fetch failure", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: false })
        );
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText("Unable to load order status.")).toBeInTheDocument();
        });
    });

    test("shows Go Home button on error", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ ok: false })
        );
        renderTracking();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Go Home/i })).toBeInTheDocument();
        });
    });
});

describe("OrderTracking — renders order details", () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockOrder("CONFIRMED")),
            })
        );
    });

    test("shows order tracking heading", async () => {
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText("Order Tracking")).toBeInTheDocument();
        });
    });

    test("shows truncated order id", async () => {
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText(/Order #abc-123-/)).toBeInTheDocument();
        });
    });

    test("shows restaurant name", async () => {
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText("Burger Barn")).toBeInTheDocument();
        });
    });

    test("shows order items", async () => {
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText(/Classic Burger x2/)).toBeInTheDocument();
            expect(screen.getByText(/Fries x1/)).toBeInTheDocument();
        });
    });

    test("shows bill total", async () => {
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText(/450/)).toBeInTheDocument();
        });
    });

    test("shows In Progress chip for non-delivered order", async () => {
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText("In Progress")).toBeInTheDocument();
        });
    });

    test("shows View All Orders button", async () => {
        renderTracking();
        await waitFor(() => {
            expect(screen.getByRole("button", { name: /View All Orders/i })).toBeInTheDocument();
        });
    });

    test("shows polling message for non-delivered order", async () => {
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText("Status updates every 30 seconds")).toBeInTheDocument();
        });
    });
});

describe("OrderTracking — stepper states", () => {
    test("renders all 5 step labels", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockOrder("PLACED")),
            })
        );
        renderTracking();
        await waitFor(() => {
            expect(screen.getByText("Order Placed")).toBeInTheDocument();
            expect(screen.getByText("Confirmed")).toBeInTheDocument();
            expect(screen.getByText("Preparing")).toBeInTheDocument();
            expect(screen.getByText("Out for Delivery")).toBeInTheDocument();
            expect(screen.getByText("Delivered")).toBeInTheDocument();
        });
    });

    test("shows Delivered chip when order is delivered", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockOrder("DELIVERED")),
            })
        );
        renderTracking();
        await waitFor(() => {
            expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
        });
    });

    test("hides polling message when delivered", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockOrder("DELIVERED")),
            })
        );
        renderTracking();
        await waitFor(() => {
            expect(screen.queryByText("Status updates every 30 seconds")).not.toBeInTheDocument();
        });
    });
});

describe("OrderTracking — polling behavior", () => {
    test("polls every 30 seconds", async () => {
        let callCount = 0;
        global.fetch = jest.fn(() => {
            callCount++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockOrder("PREPARING")),
            });
        });
        renderTracking();
        await waitFor(() => {
            expect(callCount).toBe(1);
        });

        await act(async () => { jest.advanceTimersByTime(30000); });
        expect(callCount).toBe(2);

        await act(async () => { jest.advanceTimersByTime(30000); });
        expect(callCount).toBe(3);
    });

    test("stops polling when order is delivered", async () => {
        let callCount = 0;
        global.fetch = jest.fn(() => {
            callCount++;
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockOrder("DELIVERED")),
            });
        });
        renderTracking();

        await act(async () => {
            await Promise.resolve();
        });
        await waitFor(() => {
            expect(screen.queryByText("In Progress")).not.toBeInTheDocument();
        });
        await act(async () => {
            await Promise.resolve();
        });
        const countAfterDelivered = callCount;

        await act(async () => { jest.advanceTimersByTime(60000); });
        expect(callCount).toBe(countAfterDelivered);
    });
});

describe("OrderTracking — sends auth header", () => {
    test("includes Bearer token in fetch", async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockOrder("PLACED")),
            })
        );
        renderTracking();
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
        const headers = global.fetch.mock.calls[0][1].headers;
        expect(headers.authorization).toBe("Bearer test-token");
    });
});
