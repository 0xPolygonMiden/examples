# Miden Assembly Playground

Playground for example programs for [Miden](https://github.com/maticnetwork/miden) in Miden Assembly.

[Use the playground!](https://0xpolygonmiden.github.io/examples/)

The goal of this playground is for developers to see how easy it is to write and execute code in Miden Assembly. The examples come from the community and the team. If you come up with an example of your own, we are happy to include it here to the list.

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