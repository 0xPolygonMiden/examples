import { fireEvent, render, screen, cleanup, within } from "@testing-library/react";
import '@testing-library/jest-dom'
import React from "react";
import {BrowserRouter as Router} from 'react-router-dom';
import ActionButton from "../src/components/ActionButton";
import DropDown from "../src/components/DropDown";
import Link from "../src/components/Link";
import NavBar from "../src/components/NavBar";

/** Testing the ActionButton Component */
describe("Rendering Components ", () => {
  it("should display the ActionButton", async () => {
    render(<ActionButton label="test button"/>);
    expect(
      screen.getByRole('button', { name: /test button/i }),
    );
  });
});

/** Testing the Dropdown Component */
describe("Rendering Components ", () => {
  it("should call onChange at the Dropdown", async () => {
    const { getByRole, getAllByRole, getByTestId } = render(<DropDown />)

    fireEvent.mouseDown(getByRole('button'));
    const listbox = within(getByRole('listbox'));

    fireEvent.click(listbox.getByText("comparison"));
    expect(getByTestId('listbox')).toHaveTextContent('comparison');

    fireEvent.click(listbox.getByText("collatz"));
    expect(getByTestId('listbox')).toHaveTextContent('collatz');
  });
});

/** Testing the Link Component */
describe("Rendering Components ", () => {
  it("should display a link", async () => {
    
    render(<Link label="test" address='http://xyz.de'/>);

    expect(
      screen.getByRole('link', { name: /test/i })
    ).toHaveAttribute('href', 'http://xyz.de');

  });
});

/** Testing the NavBar Component */
describe("Rendering Components ", () => {
  it("should display the Navigation bar", async () => {
    const { getByTestId } = render(
      <Router> 
        <NavBar />
      </Router>); 

    expect(getByTestId('logo')).toBeInTheDocument();
    expect(getByTestId('logo')).toHaveTextContent('Playground for Miden Examples in Miden Assembly');
   
    expect(getByTestId('top-links')).toBeInTheDocument();
    
    expect(getByTestId('nav-links')).toBeInTheDocument();
    expect(getByTestId('nav-links')).toHaveTextContent('Playground');
    expect(getByTestId('nav-links')).toHaveTextContent('Instruction Set');
  });
});
