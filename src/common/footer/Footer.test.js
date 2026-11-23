import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

const renderFooter = () =>
    render(
        <MemoryRouter>
            <Footer />
        </MemoryRouter>
    );

test("renders brand name", () => {
    renderFooter();
    expect(screen.getByText("Food Ordering App")).toBeInTheDocument();
});

test("renders tagline", () => {
    renderFooter();
    expect(
        screen.getByText("Made with care for food lovers everywhere")
    ).toBeInTheDocument();
});
