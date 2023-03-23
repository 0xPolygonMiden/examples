import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import MidenLogo from "./MidenLogo";
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'


const navigation = [
  { name: 'Documentation', href: 'https://wiki.polygon.technology/docs/miden/user_docs/assembly/main' },
  { name: 'Examples', href: 'https://github.com/0xPolygonMiden/examples#available-examples' },
  { name: 'Homepage', href: 'https://polygon.technology/solutions/polygon-miden/' },
]

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
      <header className="bg-gray-900">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex items-center">
            <a href="https://polygon.technology/solutions/polygon-miden/" className="-m-1.5 px-1.5">
              <span className="sr-only">Polygon Miden</span>
              <MidenLogo className="fill-white h-10 w-auto" />
            </a>
            <h1 className="text-xl font-semibold leading-6 text-white">MidenVM Playground</h1>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold leading-6 text-white">
                {item.name}
              </a>
            ))}
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Polygon Miden</span>
                <MidenLogo className="fill-gray-900 h-10 w-auto" />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
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
