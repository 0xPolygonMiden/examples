import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const examples = [
  'addition',
  'catalan',
  'collatz',
  'comparison',
  'conditional',
  'fibonacci',
  'game_of_life_4x4',
  'matrix_multiplication',
  'nprime',
  'shamir_secret_share',
  'standard_library',
  'advice_provider',
  'provable_compliance',
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
  const [selected, setSelected] = useState(examples[0]);

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
          <div className="relative w-20 flex-grow sm:flex-grow-0 sm:w-1/2 mb-2 sm:mb-0">
            <Listbox.Button className="relative w-full cursor-default rounded-md border text-white border-secondary-4 bg-primary py-2 pl-3 pr-10 text-left shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm">
              <span className="block truncate max-w-xs sm:max-w-none capitalize">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-3 w-3 fill-accent-1 stroke-2" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {examples.map((example) => (
                  <Listbox.Option
                    key={example}
                    className={({ active }) =>
                      classExamples(
                        active ? 'text-white bg-violet-600' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={example}
                    data-testid="select-option"
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classExamples(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          )}
                        >
                          {example}
                        </span>

                        {selected ? (
                          <span
                            className={classExamples(
                              active ? 'text-white' : 'text-violet-600',
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
