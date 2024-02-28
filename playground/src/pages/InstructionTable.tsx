import { Fragment, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import math from 'remark-math';
import katex from 'rehype-katex';
import { assemblerInstructions } from '../data/instructions';

import 'katex/dist/katex.min.css';

/** TODO:
 * Table loads slowly - consider loading only the first 10 rows and then loading more as the user scrolls
 * or use react table (https://react-table.tanstack.com/docs/overview)`
 */
export default function InstructionTable() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full">
        <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-white items-center">
          <h1 className="pl-5 mr-10 text-left text-sm font-semibold">
            Instruction
          </h1>
          <h1 className="text-left mr-20 text-sm font-semibold">Input</h1>
          <h1 className="text-left mr-16 text-sm font-semibold">Output</h1>
          <h1 className="text-left text-sm font-semibold">Description</h1>
          <div className="ml-auto pr-8">
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              autoComplete="off"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-secondary-3 bg-secondary-4 sm:text-sm rounded-xl w-28 focus:ring-accent-2 focus:border-accent-2"
              placeholder="Search ..."
            />
          </div>
        </div>
        <table className="min-w-full">
          <tbody className="bg-primary">
            {assemblerInstructions
              .filter((instructionClass) =>
                instructionClass.instructions.some((instruction) =>
                  instruction.instruction
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
              )
              .map((instructionClass) => (
                <Fragment key={instructionClass.class}>
                  <tr>
                    <th
                      colSpan={6}
                      scope="colgroup"
                      className="text-left text-sm font-normal text-white py-2 px-3"
                    >
                      {instructionClass.class}
                    </th>
                  </tr>
                  {instructionClass.instructions
                    .filter((instruction) =>
                      instruction.instruction
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((instruction) => (
                      <tr
                        key={instruction.instruction}
                        className="border border-secondary-4"
                      >
                        <td className="whitespace-nowrap pl-2 py-4 text-xs font-normal text-secondary-5">
                          <ReactMarkdown
                            remarkPlugins={[math]}
                            rehypePlugins={[katex]}
                          >
                            {instruction.instruction}
                          </ReactMarkdown>
                        </td>
                        <td className="whitespace-nowrap py-4 text-xs font-normal text-secondary-5">
                          <ReactMarkdown
                            remarkPlugins={[math, gfm]}
                            rehypePlugins={[katex]}
                          >
                            {instruction.stackInput}
                          </ReactMarkdown>
                        </td>
                        <td className="whitespace-nowrap py-4 text-xs font-normal text-secondary-5">
                          <ReactMarkdown
                            remarkPlugins={[math, gfm]}
                            rehypePlugins={[katex]}
                          >
                            {instruction.stackOutput}
                          </ReactMarkdown>
                        </td>
                        <td className="py-4 text-xs font-normal text-secondary-5 pr-8">
                          <ReactMarkdown
                            remarkPlugins={[math, gfm]}
                            rehypePlugins={[katex]}
                          >
                            {instruction.notes}
                          </ReactMarkdown>
                        </td>
                      </tr>
                    ))}
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
