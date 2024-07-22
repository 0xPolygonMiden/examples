import { useState } from 'react';
import MidenLogo from './MidenLogo';
import { Dialog } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';

/** External links for the top navigation menu */
const navigation = [
  {
    name: 'HOME',
    href: 'https://polygon.technology/solutions/polygon-miden/'
  },
  {
    name: 'DOCUMENTATION',
    href: 'https://docs.polygon.technology/miden/'
  },
  {
    name: 'DEVELOPER TOOLS',
    href: 'https://0xpolygonmiden.github.io/miden-vm/tools/main.html'
  }
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary">
      <nav
        className="mx-auto flex items-center justify-between sm:py-6 py-4 px-4 sm:px-16"
        aria-label="Global"
      >
        <div className="flex items-center">
          <a
            href="https://polygon.technology/solutions/polygon-miden/"
            className="flex -m-1.5 px-1.5"
          >
            <span className="sr-only">Polygon Miden</span>
            <MidenLogo className="fill-white h-10 w-auto" />

            <h1 className="flex text-xl items-center font-semibold leading-6 text-white">
              Polygon Miden
            </h1>
          </a>

          <h1 className="inline-flex px-2 py-1 bg-secondary-3 rounded-full ml-2 text-xs font-normal text-accent-1">
            PLAYGROUND
          </h1>
        </div>

        <div className="hidden sm:flex lg:gap-x-8">
          <a
            key="Documentation"
            href="https://docs.polygon.technology/miden/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold leading-6 text-secondary-2 hover:text-[#787580]"
          >
            <div className="flex items-center">
              <p>Documentation</p>
              <ArrowUpRightIcon className="h-5 w-5 ml-1" aria-hidden="true" />
            </div>
          </a>
        </div>

        <div className="flex sm:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a
                href="https://polygon.technology/solutions/polygon-miden/"
                className="flex -m-1.5 px-1.5"
              >
                <span className="sr-only">Polygon Miden</span>
                <MidenLogo className="fill-white h-10 w-auto" />

                <h1 className="flex text-sm items-center font-semibold leading-6 text-white">
                  Polygon Miden
                </h1>
              </a>

              <h1 className="inline-flex px-2 py-1 bg-secondary-3 rounded-full ml-2 text-xs font-normal text-accent-1">
                PLAYGROUND
              </h1>
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6 stroke-white" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <div className="flex flex-col" key={item.name}>
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="-mx-3 block rounded-lg py-2 px-3 text-sm font-semibold leading-7 text-white hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                    <div className="h-px bg-secondary-4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
