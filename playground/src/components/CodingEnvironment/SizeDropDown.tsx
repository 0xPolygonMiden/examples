import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { LOCAL_STORAGE } from '../../utils/constants';

const examples = [12, 14, 16, 18, 20, 22];

function classExamples(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface SizeDropDownProps {
  onSizeValueChange?: (newType: number) => void;
}

export default function SizeDropDown({
  onSizeValueChange
}: Readonly<SizeDropDownProps>): JSX.Element {
  const [selected, setSelected] = useState<number>(
    () =>
      Number(localStorage.getItem(LOCAL_STORAGE.MIDEN_CODE_SIZE)) || examples[0]
  );

  return (
    <Listbox
      value={selected}
      onChange={(value) => {
        onSizeValueChange?.(value);
        setSelected(value);
      }}
    >
      {({ open }) => (
        <div className="relative flex-grow sm:flex-grow-0 sm:mb-0 mr-3">
          <Listbox.Button className="relative hover:bg-secondary-8 cursor-pointer w-20 sm:w-20 rounded-md border text-white border-secondary-4 bg-primary py-2 pl-3 pr-10 text-left shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 sm:text-sm">
            <span className="block truncate max-w-xs text-accent-1 text-xm sm:max-w-none capitalize">
              A
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
                    <span
                      className={classExamples(
                        selected
                          ? 'font-semibold text-accent-1'
                          : 'font-normal text-white',
                        'block truncate text-center'
                      )}
                    >
                      {example}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
