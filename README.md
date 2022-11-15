# Miden Assembly Playground

Playground for example programs for [Miden](https://github.com/maticnetwork/miden) in Miden Assembly.

[Use the playground!](https://0xpolygonmiden.github.io/examples/)

The goal of this playground is for developers to see how easy it is to write and execute code in Miden Assembly. The examples come from the community and the team. If you come up with an example of your own, we are happy to include it here to the list.

Examples are written in Miden Assembly, see [Miden Assembly Docu](https://maticnetwork.github.io/miden/user_docs/assembly/main.html). Miden Assembly programs can have two different inputs. They can have a `stack_init` as public input and the `advice_tape` as secret input. 

Next to running examples you can also write your own program and execute it. The examples can then serve as inspiration. 

## Simple examples - to see how the code works

- **Comparison**: A program which checks if the value provided as secret input via the advice tape is less than 9; if it is, the value is multiplied by 9, otherwise, 9 is added to the value; then we check if the value is odd.

- **Conditional**: A program which either adds or multiplies two numbers - 3 and 5 - based on the value provided via the advice tape as secret input.

## Math examples - see more complex numerical calculations 

- **Collatz**: A program which executes an unbounded loop to compute a Collatz sequence which starts with the provided value; the output of the program is the number of steps needed to reach 1 - the end of the sequence.

- **Fibonnacci**: Elegant way to calculate the 1000th fibonacci number. 

## Complex examples - larger complex nested operations

- **Game-of-Life**: Implementation of Conway's Game of Life. But we can prove it. The static example runs on a 4x4 cell universe and 1000 generations.



---

We use a fork of https://github.com/timgestson/miden-assembly-playground

## Prerequisites

Install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

## Starting site

We recomment using the link above to play with the examples. 

If you want to run it locally, then (in the project directory) run:

`npm install && npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Test rust code:

`cd miden-wasm && wasm-pack test --node`

Build production release:

`npm run build`