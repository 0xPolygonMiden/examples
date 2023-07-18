import { useState } from "react";
import { useNavigate } from 'react-router-dom';

type TabType = {
  name: string;
  href: string;
  current: boolean;
}

/** Names and links for the navigation tabs within the playground */
const tabs: TabType[] = [
  { name: 'Instruction Set', href: '/instruction-set', current: false },
  { name: 'Playground', href: '/examples', current: true },
  { name: 'Help', href: '/explainer', current: false },
  { name: 'TX-Proof', href: '/tx-proof', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const NavigationTabs = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Playground');

  const handleChange = (tab: TabType) => {
    setActiveTab(tab.name);
    navigate(tab.href);
  };

  const handleChangeMobile = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const name = e.target.value;
    setActiveTab(name);
    const href = tabs.find((tab) => tab.name == name)?.href || "#";
    navigate(href);
  };

  return (
    <div className="bg-white">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-violet-600 focus:ring-violet-600 text-transform: uppercase"
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
                    ? 'border-violet-600 text-violet-700 hover:cursor-pointer text-transform: uppercase'
                    : 'border-transparent text-gray-500 hover:cursor-pointer hover:border-gray-300 hover:text-gray-700 ',
                  'w-1/3 border-b-2 py-4 px-1 text-center text-sm font-medium text-transform: uppercase'
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
  );
};

export default NavigationTabs;
