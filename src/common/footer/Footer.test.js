import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

test("renders brand name", () => {
    render(<Footer />);
    expect(screen.getByText("Food Ordering App")).toBeInTheDocument();
});

test("renders tagline", () => {
    render(<Footer />);
    expect(
        screen.getByText("Made with care for food lovers everywhere")
    ).toBeInTheDocument();
});
