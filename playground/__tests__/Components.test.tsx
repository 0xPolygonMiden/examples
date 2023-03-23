import {
  fireEvent,
  render,
  screen,
  cleanup,
  within,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ActionButton from "../src/components/ActionButton";
import DropDown from "../src/components/DropDown";
import Link from "../src/components/Link";
import NavBar from "../src/components/NavBar";

/** Testing the ActionButton Component */
describe("ActionButton component", () => {
  it("should display the ActionButton when it is rendered", async () => {
    render(<ActionButton label="test button" />);
    expect(screen.getByRole("button", { name: /test button/i }));
  });
});

/** Testing the Dropdown Component */
describe("Dropdown Component", () => {
  it("should change the selected example when clicked", async () => {
    const { getByRole, getByTestId } = render(<DropDown />);

    fireEvent.mouseDown(getByRole('button'));
    const listbox = within(getByRole('listbox'));

    fireEvent.click(listbox.getByText('example'));
    expect(getByTestId('listbox')).toHaveTextContent('example');

    fireEvent.click(listbox.getByText('collatz'));
    expect(getByTestId('listbox')).toHaveTextContent('collatz');
  });
});

/** Testing the Link Component */
describe("Link Component", () => {
  it("should have the correct link address when rendered", async () => {
    render(<Link label="test" address="http://xyz.de" />);

    expect(screen.getByRole("link", { name: /test/i })).toHaveAttribute(
      "href",
      "http://xyz.de"
    );
  });
});

/** Testing the NavBar Component */
describe("NavBar Component", () => {
  it("should contain the correct logo, text, and links when rendered", async () => {
    const { getByTestId } = render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(getByTestId("logo")).toBeInTheDocument();
    expect(getByTestId("logo")).toHaveTextContent(
      "Playground for Miden VM"
    );

    expect(getByTestId("top-links")).toBeInTheDocument();

    expect(getByTestId("nav-links")).toBeInTheDocument();
    expect(getByTestId("nav-links")).toHaveTextContent("Playground");
    expect(getByTestId("nav-links")).toHaveTextContent("Instruction Set");
  });
});
