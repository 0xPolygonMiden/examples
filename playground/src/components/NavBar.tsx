import { NavLink } from "react-router-dom";
import Link from "../components/Link";
import MidenLogo from "./MidenLogo";

const NavBar = () => {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap bg-blue-700 p-6">
        <div
          className="flex items-center flex-shrink-0 text-white mr-6"
          data-testid="logo"
        >
          <MidenLogo />
          <span className="font-semibold text-xl tracking-tight">
            Playground for Miden VM
          </span>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow" data-testid="top-links">
            <Link
              label="Docs"
              address="https://wiki.polygon.technology/docs/miden/user_docs/assembly/main"
            />
            <Link
              label="Examples"
              address="https://github.com/0xPolygonMiden/examples#available-examples"
            />
            <Link
              label="Homepage"
              address="https://polygon.technology/solutions/polygon-miden/"
            />
          </div>
        </div>
      </div>
      <div
        className="grid grid-cols-3 gap-4 bg-white p-2 hover:bg-white"
        data-testid="nav-links"
      >
        <NavLink
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          to="/examples/"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "#fff",
            background: isActive ? "bg-blue-700" : "bg-blue-500",
          })}
        >
          Playground
        </NavLink>
        <NavLink
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          to="/instruction-set/"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "#fff",
            background: isActive ? "bg-blue-700" : "bg-blue-500",
          })}
        >
          Instruction Set
        </NavLink>
        <NavLink
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          to="/explainer/"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "#fff",
            background: isActive ? "bg-blue-700" : "bg-blue-500",
          })}
        >
          Help
        </NavLink>
      </div>
    </>
  );
};

export default NavBar;
