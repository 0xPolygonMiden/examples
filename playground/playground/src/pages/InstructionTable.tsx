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
    <div >
      <div >
        <div>
          <h1 >Instructions</h1>
          <div >
            <div >
              <p >
                A list of all Miden assembly instructions. If you want to learn more
                about Miden Assembly and the Miden VM you can read the
                <a
                  href="https://wiki.polygon.technology/docs/miden/user_docs/assembly/main/"
                  
                >
                  {" "}
                  Miden Assembly documentation
                </a>
                .
              </p>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="search" >
            Search
          </label>
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            
            placeholder="Search instructions"
          />
        </div>
      </div>
      <div >
        <div >
          <div >
            <div >
              <table >
                <thead >
                  <tr>
                    <th
                      scope="col"
                      
                    >
                      Instruction
                    </th>
                    <th
                      scope="col"
                      
                    >
                      Stack Input
                    </th>
                    <th
                      scope="col"
                      
                    >
                      Stack Output
                    </th>
                    <th
                      scope="col"
                      
                    >
                      Cycles
                    </th>
                    <th
                      scope="col"
                      
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody >
                  {assemblerInstructions
                    .filter((instructionClass) =>
                      instructionClass.instructions.some((instruction) =>
                        instruction.instruction.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                    )
                    .map((instructionClass) => (
                      <Fragment key={instructionClass.class}>
                        <tr >
                          <th
                            colSpan={6}
                            scope="colgroup"
                            
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
                                <td >
                                  <ReactMarkdown
                                    remarkPlugins={[math]}
                                    rehypePlugins={[katex]}
                                  >
                                    {instruction.instruction}
                                  </ReactMarkdown>
                                </td>
                                <td >
                                  <ReactMarkdown
                                    remarkPlugins={[math, gfm]}
                                    rehypePlugins={[katex]}
                                  >
                                    {instruction.stackInput}
                                  </ReactMarkdown>
                                </td>
                                <td >
                                  <ReactMarkdown
                                    remarkPlugins={[math, gfm]}
                                    rehypePlugins={[katex]}
                                  >
                                    {instruction.stackOutput}
                                  </ReactMarkdown>
                                </td>
                                <td >
                                  <ReactMarkdown
                                    remarkPlugins={[math, gfm]}
                                    rehypePlugins={[katex]}
                                  >
                                    {instruction.cycles}
                                  </ReactMarkdown>
                                </td>
                                <td >
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
