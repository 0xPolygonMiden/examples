import { Fragment, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import math from "remark-math";
import katex from "rehype-katex";
import { assemblerInstructions } from "../data/instructions";

import "katex/dist/katex.min.css";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/** TODO:
 * Table loads slowly - consider loading only the first 10 rows and then loading more as the user scrolls
 * or use react table (https://react-table.tanstack.com/docs/overview)`
 */
export default function InstructionTable() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
<div className="px-4 sm:px-6 lg:px-8 pt-6">
  <div className="flex grid-col-2 justify-between">
    <h1 className="text-xl font-semibold text-blue">Instructions</h1>
    <div className="mt-4">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        type="text"
        name="search"
        id="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
        placeholder="Search instructions"
      />
    </div>
  </div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <p className="mt-2 text-sm text-gray-700">
            A list of all Miden assembly instructions. If you want to learn more
            about Miden Assembly and the Miden VM you can read the
            <a
              href="https://wiki.polygon.technology/docs/miden/user_docs/assembly/main/"
              className="text-blue-600 hover:text-blue-800"
            >
              {" "}
              Miden Assembly documentation
            </a>
            .
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="table -my-2 -mx-4 sm:-mx-6 lg:-mx-8 max-h-96">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full">
                <thead className="bg-white sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Instruction
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Stack Input
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Stack Output
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Cycles
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white h-96 overflow-y-auto">
                  {assemblerInstructions
                    .filter((instructionClass) =>
                      instructionClass.instructions.some((instruction) =>
                        instruction.instruction.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    )
                    .map((instructionClass) => (
                    <Fragment key={instructionClass.class}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={6}
                          scope="colgroup"
                          className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-black sm:px-6"
                        >
                          {instructionClass.class}
                        </th>
                      </tr>
                      {instructionClass.instructions
                        .filter(instruction => instruction.instruction.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(
                        (instruction, instructionIdx) => (
                          <tr
                            key={instruction.instruction}
                            className={classNames(
                              instructionIdx === 0
                                ? "border-gray-300"
                                : "border-gray-200",
                              "border-t"
                            )}
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6">
                              <ReactMarkdown
                                remarkPlugins={[math]}
                                rehypePlugins={[katex]}
                              >
                                {instruction.instruction}
                              </ReactMarkdown>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                              <ReactMarkdown
                                remarkPlugins={[math, gfm]}
                                rehypePlugins={[katex]}
                              >
                                {instruction.stackInput}
                              </ReactMarkdown>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                              <ReactMarkdown
                                remarkPlugins={[math, gfm]}
                                rehypePlugins={[katex]}
                              >
                                {instruction.stackOutput}
                              </ReactMarkdown>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                              <ReactMarkdown
                                remarkPlugins={[math, gfm]}
                                rehypePlugins={[katex]}
                              >
                                {instruction.cycles}
                              </ReactMarkdown>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                              <ReactMarkdown
                                remarkPlugins={[math, gfm]}
                                rehypePlugins={[katex]}
                              >
                                {instruction.notes}
                              </ReactMarkdown>
                            </td>
                          </tr>
                        )
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}