# A short explainer

This is a Builder's Playground for the Miden Virtual Machine. You can create any program in Miden Assembly run, debug, prove and verify it. Or just check out our examples. All in the browser.

## What is the Miden VM?
The Miden VM is a zero-knowledge virtual machine. A regular virtual machine consumes an initial state and a program and produces a final state.

![](https://i.imgur.com/y3yYt2R.png)

The Miden VM works like a regular virtual machine. Only that you can provide secret inputs (Witness) and together with the final state the Miden VM creates a proof for it. A zero-knowledge virtual machines proves that a given set of inputs and program code results in the final state.  

![](https://i.imgur.com/t517366.png)

## Inputs of the Miden VM
External inputs can be provided to the Miden VM in the Playground in two ways:

```json
{
  "operand_stack": ["0"],
  "advice_stack": ["0"],
  "advice_map": {
    "0000000000000000000000000000000000000000000000000000000000000000": [5, 6, 7, 8],
    "0000001000000000000000000000000000000000000000000000000000000000": [9, 10, 11, 12]
  },
  "merkle_store": [
    {"merkle_tree": [
        "0000000000000000000000000000000000000000000000000000000000000000", 
        "0000000000000000000000000000000000000000000000000000000000000000", 
        "0000000000000000000000000000000000000000000000000000000000000000", 
        "0000000000000000000000000000000000000000000000000000000000000000"]},
    {"sparse_merkle_tree": [
        [1, "0000000000000000000000000000000333000000000000000000000000000000"],
        [3, "0000000000000000000000000000000222000000000000000000000000000000"]
    ]}
  ]
}
```

* Public inputs - `operand_stack` - can be supplied to the VM by initializing the stack with desired values before a program starts executing. Up to 16 stack items can be initialized in this way.
* Secret (or nondeterministic) inputs:
  * `advice_stack` - can be supplied to the VM. There is no limit on how much data the advice provider can hold. This is provided as a string array where each
  string entry represents a field element.
  * `advice_map` - is supplied as a map of 64 character long hex keys mapped to an array of numbers.  The hex keys are interpreted as 4 field elements and the 
  array of numbers is interpreted as an array of field elements.
  * `merkle_store` - the merkle store is container that allows the user to define `merkle_tree` and `sparse_merkle_tree` data structures.
    * `merkle_tree` - is supplied as an array of 64 character long hex values where each value represents a leaf (4 elements) in the tree.
    * `sparse_merkle_tree` - is supplied an an array of tuples of (number, 64 character hex string).  The number represents the leaf index and the hex string 
    represents the leaf value (4 elements).   

*Check out the [comparison example](https://github.com/0xPolygonMiden/examples/blob/main/examples/comparison.masm) to see how the secret input works*

After a program finishes executing, up to 16 elements can remain on the stack. These elements then become the outputs of the program.

Want to know more? [Here](https://wiki.polygon.technology/docs/miden/intro/overview#inputs-and-outputs).

## Program Code
```
begin
  push.1
  push.2
  add
end
```

Our goal is to make Miden VM an easy compilation target for high-level blockchain-centric languages such as Move and Solidity.  However, compilers to help with this have not been developed yet. Thus, for now, the primary way to write programs for Miden VM is to use [Miden assembly](https://wiki.polygon.technology/docs/miden/user_docs/assembly/main).

To get to know the language, check out our examples. It's better than writing in Circuits ...

Want to know more? [Here](https://wiki.polygon.technology/docs/miden/user_docs/assembly/main).

## Outputs of the Miden VM

```json
{
"stack_output" : [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
"overflow_addrs" : [0,1],
"trace_len" : 1024
}
```

The `stack_output` represents our final state. The `overflow_addrs` is needed to reconstruct the state the is not shown in the `stack_output`. 

The **trace_len** tells you how complex the computation is - it is the length of the execution trace. We need to always have an execution trace that is a power of 2 and >1024.  

The Outputs must also be a valid JSON (if you want to verify) and it can only contain numbers. 

You can also test the VM by proving a program and tampering with the Outputs. See if you can still verify the set of (`operand_stack`, `code`, `stack_output` and `overflow_addrs`)

Want to know more? [Here](https://wiki.polygon.technology/docs/miden/user_docs/assembly/main).

## OK, but what can I do now?

![](https://i.imgur.com/Y6pkjzt.png)

### Run a program
You can create a program and run it. There will be no proof generated which is much faster. Every program that successfully executes can also be proven, so I suggest using this functionality when hacking around. 

### Debug a program
You can step through the program and see the current VM state displayed in the Output section. And the best thing is, that you can add `breakpoint` as Miden Assembly instruction, see below for an example. 

```
Clock: 2001
Stack: [1,0,4,23,1,0,2,0,23,8,50,19,17,13,11,7,5,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
Assembly Instruction: "gt"
Number of Operations: 18
Rel. Operation Index: 11
VM Operation: And
Memory (Addr, Mem): [0]: [2, 0, 0, 0] 
                    [1]: [3, 0, 0, 0] 
```

* Clock is the current (clock) cycle
* Stack shows the current state ot the stack
* VM Operation is the current miden vm operation (every Operation takes 1 cycle)
* Assembly Instruction: current Miden assembly instruction.
* Number of Operations: number of operations per instruction.
* Rel. Operation Index: current operation count.
* VM Operation: current Miden VM operation, every operation takes 1 cycle.
	
Additional documentation on how the VM executes its operations can be foound at the [Miden VM documentation page](https://0xpolygonmiden.github.io/miden-vm/design/programs.html)

Remember: Miden programs lenghts are expressed in cycles. The Miden VM will round the cycles always to the next power of 2 and has a minimum at 2^10.


Example for setting the breakpoint:

Just add `breakpoint` as instruction and the debugger will stop at this particular point. 

```
begin
  push.1
  push.2
  breakpoint
  add
end
```

### Prove a program
This is what makes the Miden VM interesting. Here you can run your program and create a proof for it. The proof is stored in memory in the backend. You can take a look at the proof by clicking "Show Proof".

You need to prove before you can verify.

### Verify a program
Ok, here you can verify that the given `operand_stack` and `code` produce indeed the given `stack_output` and `overflow_addrs`. Verify will verify a previously generated proof of execution for a given program. For the verification the proof is needed.
