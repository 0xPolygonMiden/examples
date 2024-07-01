import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { LOCAL_STORAGE } from '../utils/constants';

const examples = [
  'addition',
  'conditional',
  'fibonacci',
  'standard_library',
  'game_of_life_4x4',
  'catalan',
  'dft',
  'shamir_secret_share',
  'provable_compliance',
  'collatz',
  'comparison',
  'nprime',
  'matrix_multiplication'
  //'advice_provider',
  //'bsearch',
];

function classExamples(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type DropDownProps = {
  onExampleValueChange?: (newType: string) => void;
};

export default function DropDown({
  onExampleValueChange
}: DropDownProps): JSX.Element {
  const [selected, setSelected] = useState(
    localStorage.getItem(LOCAL_STORAGE.SELECTED_EXAMPLE_ITEM) ?? examples[0]
  );

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE.MIDEN_CODE)) {
      onExampleValueChange?.(selected);
    }
  }, []);

  return (
    <Listbox
      value={selected}
      onChange={(value) => {
        onExampleValueChange?.(value);
        setSelected(value);
      }}
    >
      {({ open }) => (
        <>
          <div className="relative flex-grow sm:flex-grow-0 ml-auto sm:mb-0">
            <Listbox.Button className="relative hover:bg-secondary-8 cursor-pointer w-28 sm:w-44 rounded-md border text-white border-secondary-4 bg-primary py-2 pl-3 pr-10 text-left shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm">
              <span className="block truncate max-w-xs text-xs sm:max-w-none capitalize">
                {selected}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-3 w-3 stroke-accent-1 stroke-2" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-primary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {examples.map((example) => (
                  <Listbox.Option
                    key={example}
                    className={({ active }) =>
                      classExamples(
                        active ? 'text-accent-1 bg-secondary-8' : 'text-white',
                        'relative cursor-pointer select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={example}
                    data-testid="select-option"
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classExamples(
                            selected
                              ? 'font-semibold text-accent-1'
                              : 'font-normal text-white',
                            'block truncate'
                          )}
                        >
                          {example}
                        </span>

                        {selected ? (
                          <span
                            className={classExamples(
                              active ? 'text-accent-1' : 'text-accent-1',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
