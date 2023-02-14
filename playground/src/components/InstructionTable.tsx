import { Fragment } from 'react'

const instructionSet = [
  {
    name: 'Assertions and tests',
    instructions: [
      { name: 'assert', stack_input: '[a, ...]', stack_output: '[...]', cycles: '1' },
      { name: 'assert_eq', stack_input: '[b, a, ...]', stack_output: '[...]', cycles: '1' },
      { name: '...', stack_input: '...', stack_output: '...', cycles: '...' },
    ],
  },
  // More instructions...
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function InstructionTable() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="mt-2 text-sm text-gray-700">
            A list of all the instructions currently possible to be used in the Miden VM.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="column">
                      Instruction
                    </th>
                    <th scope="col" className="column">
                      Stack Input
                    </th>
                    <th scope="col" className="column">
                      Stack Output
                    </th>
                    <th scope="col" className="column">
                      Cycles
                    </th>
                    <th scope="col" className="column">
                      Notes
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Expand</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {instructionSet.map((instruction) => (
                    <Fragment key={instruction.name}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
                        >
                          {instruction.name}
                        </th>
                      </tr>
                      {instruction.instructions.map((instruction, instructionIdx) => (
                        <tr
                          key={instruction.name}
                          className={classNames(instructionIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {instruction.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{instruction.stack_input}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{instruction.stack_output}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{instruction.cycles}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                              Expand<span className="sr-only">, {instruction.name}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
