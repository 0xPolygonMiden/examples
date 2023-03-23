import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Link from "../components/Link";
import MidenLogo from "./MidenLogo";

type TabType = {
  name: string;
  href: string;
  current: boolean;
}

const tabs: TabType[] = [
  { name: 'Instruction Set', href: '/instruction-set', current: false },
  { name: 'Playground', href: '/examples', current: true },
  { name: 'Help', href: '/explainer', current: false },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const NavBar = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Playground');

  const handleChange = (tab: TabType) => {
    setActiveTab(tab.name);
    navigate(tab.href);
  };

  const handleChangeMobile = (e: any) => {
    e.preventDefault();
    const name = e.target.value;
    setActiveTab(name);
    const href = tabs.find((tab) => tab.name == name)?.href || "#";
    navigate(href);
  };

  return (
    <>
      <div className="flex items-center justify-between flex-wrap bg-blue-700">
        <div
          className="flex items-center flex-shrink-0 text-white mr-6"
          data-testid="logo"
        >
          <MidenLogo />
          <span className="font-semibold text-xl tracking-tight">
            MidenVM Playground
          </span>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow" data-testid="top-links">
            <Link
              label="Documentation"
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
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={tabs.find((tab) => tab.current)?.name}
            onChange={handleChangeMobile}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Navigation Tabs">
              {tabs.map((tab) => (
                <div
                  key={tab.name}
                  className={classNames(
                    tab.name == activeTab
                      ? 'border-indigo-500 text-indigo-600 hover:cursor-pointer'
                      : 'border-transparent text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700',
                    'w-1/3 border-b-2 py-4 px-1 text-center text-sm font-medium'
                  )}
                  aria-current={tab.name == activeTab ? 'page' : undefined}
                  onClick={() => handleChange(tab)}
                >
                  {tab.name}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
