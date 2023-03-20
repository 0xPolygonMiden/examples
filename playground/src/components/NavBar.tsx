import { NavLink } from "react-router-dom";
import Link from "../components/Link";
import MidenLogo from "./MidenLogo";

const NavBar = () => {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap bg-blue-700 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6" data-testid="logo">
          <MidenLogo />
          <span className="font-semibold text-xl tracking-tight">
            Playground for Miden Examples in Miden Assembly
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
      <div className="grid grid-cols-2 gap-4 bg-blue-700 p-6 hover:bg-blue-700" data-testid="nav-links">
        <NavLink
          className="font-semibold text-xl text-center hover:bg-blue-700"
          to="/examples/"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "#fff",
            background: isActive ? "#7b3fe4" : "#3b82f6",
          })}
        >
          Playground
        </NavLink>
        <NavLink
          className="font-semibold text-xl text-center hover:bg-blue-700"
          to="/instruction-set/"
          style={({ isActive }) => ({
            color: isActive ? "#fff" : "#fff",
            background: isActive ? "#7b3fe4" : "#3b82f6",
          })}
        >
          Instruction Set
        </NavLink>
      </div>
    </>
  );
};

export default NavBar;
