import { Fragment, useEffect, useMemo, useState } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import math from 'remark-math';
import katex from 'rehype-katex';
import { assemblerInstructions } from '../data/instructions';
import Fuse from 'fuse.js';

import 'katex/dist/katex.min.css';

/** TODO:
 * Table loads slowly - consider loading only the first 10 rows and then loading more as the user scrolls
 * or use react table (https://react-table.tanstack.com/docs/overview)`
 */

interface InstructionTableProps {
  searchQuery: string;
}
interface AssemblerInstruction {
  instruction: string;
  stackInput: string;
  stackOutput: string;
  cycles: string;
  notes: string;
}

const parseStringArray = (input: string): string[] => {
  return input
    .slice(1, -1)
    .split(', ')
    .map((item) => item.trim());
};

interface InstructionClass {
  class: string;
  instructions: AssemblerInstruction[];
}

const InstructionTable: React.FC<InstructionTableProps> = ({ searchQuery }) => {
  const [filteredClasses, setFilteredClasses] = useState<InstructionClass[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const allInstructions = useMemo(() => {
    return assemblerInstructions.flatMap(
      (instructionClass: InstructionClass) => instructionClass.instructions
    );
  }, []);

  const fuse = useMemo(() => {
    const options = {
      keys: ['instructions.instruction'],
      includeScore: true,
      threshold: 0.3
    };
    return new Fuse(assemblerInstructions, options);
  }, []);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setFilteredClasses(assemblerInstructions);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsLoading(true);
      const results = fuse.search(searchQuery);
      const resultData = results
        .map((result) => {
          const matchedInstructions = result.item.instructions.filter(
            (instruction) =>
              instruction.instruction
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
          return {
            ...result.item,
            instructions: matchedInstructions
          };
        })
        .filter((item) => item.instructions.length > 0);
      setFilteredClasses(resultData);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fuse]);

  return (
    <div className="h-full rounded-xl border relative overflow-y-scroll border-secondary-4">
      <div className="flex w-full">
        <div className="flex flex-col w-full pb-32">
          <div className="bg-secondary-main z-10 py-4 flex sticky top-0 text-secondary-5 items-center">
            <h1 className="pl-5 w-96 text-left text-sm font-semibold">
              Instructions
            </h1>
            <h1 className="text-left w-60 text-sm font-semibold">Input</h1>
            <h1 className="text-left w-60 text-sm font-semibold">Output</h1>
            <h1 className="text-left text-sm font-semibold">Description</h1>
          </div>
          <table>
            <tbody>
              {filteredClasses && filteredClasses.length === 0 && (
                <h1 className="text-center text-white mt-16 text-sm font-semibold">
                  No results found
                </h1>
              )}
              {filteredClasses &&
                filteredClasses.length > 0 &&
                filteredClasses.map((instructionClass) => {
                  const filteredInstructions =
                    instructionClass.instructions.filter((instruction) =>
                      instruction.instruction
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    );

                  if (filteredInstructions.length === 0) {
                    return null;
                  }

                  return (
                    <Fragment key={instructionClass.class}>
                      <tr>
                        <th
                          colSpan={6}
                          scope="colgroup"
                          className="text-left text-base font-semibold text-white py-2 px-3"
                        >
                          {instructionClass.class}
                        </th>
                      </tr>
                      {filteredInstructions.map((instruction) => (
                        <tr
                          key={instruction.instruction}
                          className="border border-secondary-4"
                        >
                          <td className="pl-3 w-96 py-4 text-xs font-normal text-secondary-6">
                            <ReactMarkdown
                              remarkPlugins={[math]}
                              rehypePlugins={[katex]}
                            >
                              {instruction.instruction}
                            </ReactMarkdown>
                          </td>
                          <td className="text-xs font-normal py-4 text-secondary-6">
                            <div className="flex flex-wrap gap-3 w-60">
                              {parseStringArray(instruction.stackInput).map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className="w-10 h-10 flex items-center justify-center bg-[#B490FF1A] text-xs text-white rounded-md"
                                  >
                                    {item}
                                  </div>
                                )
                              )}
                            </div>
                          </td>
                          <td className="text-xs font-normal py-4 text-secondary-6">
                            <div className="w-60 flex gap-3">
                              {parseStringArray(instruction.stackOutput).map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className="w-10 h-10 flex items-center justify-center bg-[#B490FF1A] text-xs text-white rounded-md"
                                  >
                                    {item}
                                  </div>
                                )
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-xs font-normal text-secondary-6 pr-8">
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
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructionTable;
