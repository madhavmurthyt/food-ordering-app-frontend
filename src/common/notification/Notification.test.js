import React from "react";
import { render, screen } from "@testing-library/react";
import Notification from "./Notification";

test("renders message when open", () => {
    render(
        <Notification open={true} messageText="Item added!" onClose={jest.fn()} />
    );
    expect(screen.getByText("Item added!")).toBeInTheDocument();
});

test("does not render message when closed", () => {
    render(
        <Notification open={false} messageText="Hidden" onClose={jest.fn()} />
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
});
