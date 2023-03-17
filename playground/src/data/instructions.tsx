export const assemblerInstructions = [
  {
    class: "Assertions and tests",
    instructions: [
      {
        instruction: "assert",
        stackInput: "[a, ...]",
        stackOutput: "[...]",
        cycles: "1",
        notes:
          "If $a = 1$, removes it from the stack. \n \n Fails if $a \\ne 1$",
      },
      {
        instruction: "assertz",
        stackInput: "[ a, ...]",
        stackOutput: "[...]",
        cycles: "2",
        notes:
          "if $a = 0$, removes it from the stack, \n \n Fails if $a \\ne 0$",
      },
      {
        instruction: "assert_eq",
        stackInput: "[b, a, ...]",
        stackOutput: "[...]",
        cycles: "2",
        notes:
          "If $a = b$, removes them from the stack. \n \n Fails if $a \\ne b$",
      },
      {
        instruction: "assert_eqw",
        stackInput: "[B, A, ...]",
        stackOutput: "[...]",
        cycles: "11",
        notes:
          "If $A = B$, removes them from the stack. \n \n Fails if $A \\ne B$. A, B are 64-bit words.",
      },
    ],
  },
  {
    class: "Arithmetic and Boolean operations",
    instructions: [
      {
        instruction: "add \n \n add.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "1 \n \n 1-2",
        notes: "$c \\leftarrow (a + b) \\mod p$",
      },
      {
        instruction: "sub \n \n sub.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "2 \n \n 2",
        notes: "$c \\leftarrow (a - b) \\mod p$",
      },
      {
        instruction: "mul \n \n mul.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "1 \n \n 2",
        notes: "$c \\leftarrow (a \\cdot b) \\mod p$",
      },
      {
        instruction: "div \n \n div.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "2 \n \n 2",
        notes:
          "$c \\leftarrow (a \\cdot b^{-1}) \\mod p$ \n \n Fails if $b = 0$",
      },
      {
        instruction: "neg",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "1",
        notes: "$b \\leftarrow -a \\mod p$",
      },
      {
        instruction: "inv",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "1",
        notes: "$b \\leftarrow a^{-1} \\mod p$ \n \n Fails if $a = 0$",
      },
      {
        instruction: "pow2",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "16",
        notes: "$b \\leftarrow 2^a$ \n \n Fails if $a > 63$",
      },
      {
        instruction: "exp.*uxx* \n \n exp.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "9 + xx \n \n 9 + log2(b)",
        notes:
          "$c \\leftarrow a^b$ \n \n Fails if xx is outside [0, 63) \n \n exp is equivalent to exp.u64 and needs 73 cycles",
      },
      {
        instruction: "not",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "1",
        notes: "$b \\leftarrow 1 - a$ \n \n Fails if $a > 1$",
      },
      {
        instruction: "and",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "1",
        notes: "$c \\leftarrow a \\cdot b$ \n \n Fails if $max(a, b) > 1$",
      },
      {
        instruction: "or",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "1",
        notes:
          "$c \\leftarrow a + b - a \\cdot b$ \n \n Fails if $max(a, b) > 1$",
      },
      {
        instruction: "xor",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "7",
        notes:
          "$c \\leftarrow a + b - 2 \\cdot a \\cdot b$ \n \n Fails if $max(a, b) > 1$",
      },
    ],
  },
  {
    class: "Comparison operations",
    instructions: [
      {
        instruction: "eq \n \n eq.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "1 \n \n 1-2",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a=b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
      {
        instruction: "neq \n \n neq.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "2 \n \n 2-3",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a \\ne b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
      {
        instruction: "lt",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "17",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a < b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
      {
        instruction: "lte",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "18",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a \\le b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
      {
        instruction: "gt",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "18",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a > b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
      {
        instruction: "gte",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "19",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a \\ge b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
      {
        instruction: "is_odd",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "5",
        notes:
          "Pushes 1 to the stack if the number $a$ is an odd number 0 otherwise",
      },
      {
        instruction: "eqw",
        stackInput: "[A, B, ...]",
        stackOutput: "[c, A, B, ...]",
        cycles: "15",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a_i = b_i \\; \\forall i \\in \\{0, 1, 2, 3\\} \\\\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
    ],
  },
  {
    class: "Extension Field Operations",
    instructions: [
      {
        instruction: "ext2add",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "5",
        notes:
          "",
      },
      {
        instruction: "ext2sub",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "7",
        notes:
          "",
      },
      {
        instruction: "ext2mul",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "3",
        notes:
          "",
      },
      {
        instruction: "ext2div",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "11",
        notes:
          "",
      },
      {
        instruction: "ext2neg",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "4",
        notes:
          "",
      },
      {
        instruction: "ext2inv",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "8",
        notes:
          "",
      },
    ],
  },
  {
    class: "Constant inputs",
    instructions: [
      {
        instruction: "push.*a* \n \n push.*a*.*b* \n \n push.*a*.*b*.*c*...",
        stackInput: "[ ... ]",
        stackOutput: "[a, ... ] \n \n [b, a, ... ] \n \n [c, b, a, ... ]",
        cycles: "1-2 \n \n 2-4 \n \n 4-6",
        notes:
          "Pushes values $a$, $b$, $c$ etc. onto the stack. Up to $16$ values can be specified. \n \n All values must be valid field elements in decimal (e.g., $123$) or hexadecimal \n \n (e.g., $0x7b$) representation.",
      },
    ],
  },
  {
    class: "Environment inputs",
    instructions: [
      {
        instruction: "sdepth",
        stackInput: "[ ... ]",
        stackOutput: "[d, ... ]",
        cycles: "1",
        notes:
          "$d \\leftarrow stack.depth()$ \n \n Pushes the current depth of the stack onto the stack.",
      },
      {
        instruction: "caller",
        stackInput: "[ A, b, ... ]",
        stackOutput: "[H, b, ... ]",
        cycles: "1",
        notes:
          "$H \\leftarrow context.fn\\_hash()$ \n \n Overwrites the top four stack items with the hash of a function which initiated the current SYSCALL. \n \n Executing this instruction outside of SYSCALL context will fail.",
      },
      {
        instruction: "locaddr.*i*",
        stackInput: "[ ... ]",
        stackOutput: "[a, ... ]",
        cycles: "2",
        notes:
          "$a \\leftarrow address\\_of(i)$ \n \n Pushes the absolute memory address of local memory at index $i$ onto the stack.",
      },
      {
        instruction: "clk",
        stackInput: "[ ... ]",
        stackOutput: "[t, ... ]",
        cycles: "1",
        notes:
          "$t \\leftarrow clock\\_value()$ \n \n Pushes the current value of the clock cycle counter onto the stack.",
      },
    ],
  },
  {
    class: "Non-deterministic inputs",
    instructions: [
      {
        instruction: "adv_push.*n*",
        stackInput: "[ ... ]",
        stackOutput: "[a, ... ]",
        cycles: "n",
        notes:
          "$a \\leftarrow tape.next()$ \n \n Removes the next $n$ values from advice tape and pushes them onto the stack. \n \n Valid for $n \\in \\{1, ..., 16\\}$. Fails if the advice tape has fewer than $n$ values.",
      },
      {
        instruction: "adv_loadw",
        stackInput: "[0, 0, 0, 0, ... ]",
        stackOutput: "[A, ... ]",
        cycles: "1",
        notes:
          "$A \\leftarrow tape.next(4)$ \n \n Removes the next word (4 elements) from the advice tape \n \n and overwrites the top four stack elements with it. Fails if the advice tape has fewer than $4$ values.",
      },
      {
        instruction: "adv_pipe",
        stackInput: "[S2, S1, S0, a, ... ]",
        stackOutput: "[T2, T1, T0, b, ... ]",
        cycles: "2",
        notes:
          "$[T_0, T_1, T_2] \\leftarrow permute(S_0, S_1 + tape.next(4), S_2 + tape.next(4))$ \n \n $b \\leftarrow a + 2$ \n \n Removes the next two words (8 elements) from the advice tape, \n \n  inserts them into memory sequentially starting from address $a$, \n \n then adds them to the top 8 elements of the stack and applies a Rescue Prime permutation \n \n to the top 12 elements of the stack. At the end of the operation, the address is incremented by $2$. \n \n Fails if the advice tape has fewer than $8$ values.",
      },
    ],
  },
  {
    class: "Random access memory",
    instructions: [
      {
        instruction: "mem_load \n \n mem_load.*a*",
        stackInput: "[a, ... ]",
        stackOutput: "[v, ... ]",
        cycles: "1 \n \n 2",
        notes:
          "$v \\leftarrow mem[a][0]$ \n \n Reads a word (4 elements) from memory at address *a*, \n \n and pushes the first element of the word onto the stack. \n \n If $a$ is provided via the stack, it is removed from the stack first. \n \n Fails if $a \\ge 2^{32}$",
      },
      {
        instruction: "mem_loadw \n \n mem_loadw.*a*",
        stackInput: "[a, 0, 0, 0, 0, ... ]",
        stackOutput: "[A, ... ]",
        cycles: "1 \n \n 2",
        notes:
          "$A \\leftarrow mem[a]$ \n \n Reads a word from memory at address $a$ and overwrites top four stack elements with it. \n \n If $a$ is provided via the stack, it is removed from the stack first. \n \n Fails if $a \\ge 2^{32}$",
      },
      {
        instruction: "mem_store \n \n mem_store.*a*",
        stackInput: "[a, v, ... ]",
        stackOutput: "[ ... ]",
        cycles: "2 \n \n 3-4",
        notes:
          "$v \\rightarrow mem[a][0]$ \n \n Pops the top element off the stack and stores it as the first element of the word in memory \n \n at address $a$. All other elements of the word are not affected. If $a$ is provided via the stack, \n \n it is removed from the stack first. \n \n Fails if $a \\ge 2^{32}$",
      },
      {
        instruction: "mem_storew \n \n mem_storew.*a*",
        stackInput: "[a, A, ... ]",
        stackOutput: "[A, ... ]",
        cycles: "1 \n \n 2-3",
        notes:
          "$A \\rightarrow mem[a]$ \n \n Stores the top four elements of the stack in memory at address $a$. \n \n If $a$ is provided via the stack, it is removed from the stack first. \n \n Fails if $a \\ge 2^{32}$",
      },
      {
        instruction: "mem_stream",
        stackInput: "[S2, S1, S0, a, ...]",
        stackOutput: "[T2, T1, T0, b, ...]",
        cycles: "2",
        notes:
          "$[T_0, T_1, T_2] \\leftarrow permute(S_0, S_1 + mem[a], S_2 + mem[a+1])$ \n \n $b \\leftarrow a + 2$ \n \n Loads two words from memory starting at the address $a$, \n \n adds them to the top 8 elements of the stack, and applies Rescue Prime permutation to the top 12 \n \n elements of the stack. At the end of the operation the address is incremented by $2$.",
      },
      {
        instruction: "loc_load.*i*",
        stackInput: "[ ... ]",
        stackOutput: "[v, ... ]",
        cycles: "3-4",
        notes:
          "$v \\leftarrow local[i][0]$ \n \n Reads a word (4 elements) from local memory at index *i*, \n \n and pushes the first element of the word onto the stack.",
      },
      {
        instruction: "loc_loadw.*i*",
        stackInput: "[0, 0, 0, 0, ... ]",
        stackOutput: "[A, ... ]",
        cycles: "3-4",
        notes:
          "$A \\leftarrow local[i]$ \n \n Reads a word from local memory at index $i$ and overwrites top four stack elements with it.",
      },
      {
        instruction: "loc_store.*i*",
        stackInput: "[v, ... ]",
        stackOutput: "[ ... ]",
        cycles: "4-5",
        notes:
          "$v \\rightarrow local[i][0]$ \n \n Pops the top element off the stack and stores it as the first element of the word \n \n in local memory at index $i$. All other elements of the word are not affected.",
      },
      {
        instruction: "loc_storew.*i*",
        stackInput: "[A, ... ]",
        stackOutput: "[A, ... ]",
        cycles: "3-4",
        notes:
          "$A \\rightarrow local[i]$ \n \n Stores the top four elements of the stack in local memory at index $i$.",
      },
    ],
  },
  {
    class: "Stack manipulation",
    instructions: [
      {
        instruction: "drop",
        stackInput: "[a, ... ]",
        stackOutput: "[ ... ]",
        cycles: "1",
        notes: "Deletes the top stack item.",
      },
      {
        instruction: "dropw",
        stackInput: "[A, ... ]",
        stackOutput: "[ ... ]",
        cycles: "4",
        notes: "Deletes a word (4 elements) from the top of the stack.",
      },
      {
        instruction: "padw",
        stackInput: "[ ... ]",
        stackOutput: "[0, 0, 0, 0, ... ]",
        cycles: "4",
        notes:
          "Pushes four $0$ values onto the stack. \n \n Note: simple `pad` is not provided because `push.0` does the same thing.",
      },
      {
        instruction: "dup.*n*",
        stackInput: "[ ..., a, ... ]",
        stackOutput: "[a, ..., a, ... ]",
        cycles: "1-3",
        notes:
          "Pushes a copy of the $n$th stack item onto the stack. `dup` and `dup.0` are the same instruction. \n \n Valid for $n \\in \\{0, ..., 15\\}$",
      },
      {
        instruction: "dupw.*n*",
        stackInput: "[ ..., A, ... ]",
        stackOutput: "[A, ..., A, ... ]",
        cycles: "4",
        notes:
          "Pushes a copy of the $n$th stack word onto the stack. `dupw` and `dupw.0` are the same instruction. \n \n Valid for $n \\in \\{0, 1, 2, 3\\}$",
      },
      {
        instruction: "swap.*n*",
        stackInput: "[a, ..., b, ... ]",
        stackOutput: "[b, ..., a, ... ]",
        cycles: "1-6",
        notes:
          "Swaps the top stack item with the $n$th stack item. `swap` and `swap.1` are the same instruction. \n \n  Valid for $n \\in \\{1, ..., 15\\}$",
      },
      {
        instruction: "swapw.*n*",
        stackInput: "[A, ..., B, ... ]",
        stackOutput: "[B, ..., A, ... ]",
        cycles: "1",
        notes:
          "Swaps the top stack word with the $n$th stack word. `swapw` and `swapw.1` are the same instruction. \n \n  Valid for $n \\in \\{1, 2, 3\\}$",
      },
      {
        instruction: "movup.*n*",
        stackInput: "[ ..., a, ... ]",
        stackOutput: "[a, ... ]",
        cycles: "1-4",
        notes:
          "Moves the $n$th stack item to the top of the stack. Valid for $n \\in \\{2, ..., 15\\}$",
      },
      {
        instruction: "movupw.*n*",
        stackInput: "[ ..., A, ... ]",
        stackOutput: "[A, ... ]",
        cycles: "2-3",
        notes:
          "Moves the $n$th stack word to the top of the stack. Valid for $n \\in \\{2, 3\\}$",
      },
      {
        instruction: "movdn.*n*",
        stackInput: "[a, ... ]",
        stackOutput: "[ ..., a, ... ]",
        cycles: "1-4",
        notes:
          "Moves the top stack item to the $n$th position of the stack. Valid for $n \\in \\{2, ..., 15\\}$",
      },
      {
        instruction: "movdnw.*n*",
        stackInput: "[A, ... ]",
        stackOutput: "[ ..., A, ... ]",
        cycles: "2-3",
        notes:
          "Moves the top stack word to the $n$th word position of the stack. Valid for $n \\in \\{2, 3\\}$",
      },
    ],
  },
  {
    class: "Conditional manipulation",
    instructions: [
      {
        instruction: "cswap",
        stackInput: "[c, b, a, ... ]",
        stackOutput: "[e, d, ... ]",
        cycles: "1",
        notes:
          "$d = \\begin{cases} a, & ext{if}\\ c = 0 \\ b, & \\text{if}\\ c = 1\\ \\end{cases}$ \n \n $e = \\begin{cases} b, & \\text{if}\\ c = 0 \\ a, & \\text{if}\\ c = 1\\ \\end{cases}$  \n \n Fails if $c > 1$",
      },
      {
        instruction: "cswapw",
        stackInput: "[c, B, A, ... ]",
        stackOutput: "[E, D, ... ]",
        cycles: "1",
        notes:
          "$D = \\begin{cases} A, & \\text{if}\\ c = 0 \\\\ B, & \\text{if}\\ c = 1\\ \\end{cases}$ \n \n $E = \\begin{cases} B, & \\text{if}\\ c = 0 \\\\ A, & \\text{if}\\ c = 1\\ \\end{cases}$  \n \n Fails if $c > 1$",
      },
      {
        instruction: "cdrop",
        stackInput: "[c, b, a, ... ]",
        stackOutput: "[d, ... ]",
        cycles: "2",
        notes:
          "$d = \\begin{cases} a, & \\text{if}\\ c = 0 \\\\ b, & \\text{if}\\ c = 1\\ \\end{cases}$ \n \n Fails if $c > 1$",
      },
      {
        instruction: "cdropw",
        stackInput: "[c, B, A, ... ]",
        stackOutput: "[D, ... ]",
        cycles: "5",
        notes:
          "$D = \\begin{cases} A, & \\text{if}\\ c = 0 \\\\ B, & \\text{if}\\ c = 1\\ \\end{cases}$ \n \n Fails if $c > 1$",
      },
    ],
  },
  {
    class: "Conversions and tests",
    instructions: [
      {
        instruction: "u32test",
        stackInput: "[a, ...]",
        stackOutput: "[b, a, ...]",
        cycles: "5",
        notes: "$b \\leftarrow \\begin{cases} 1, &",
        undefined:
          "ext{if}\\ a < 2^{32} \\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
      {
        instruction: "u32testw",
        stackInput: "[A, ...]",
        stackOutput: "[b, A, ...]",
        cycles: "23",
        notes:
          "$b \\leftarrow \\begin{cases} 1, & \\text{if}\\ \\forall\\ i \\in \\{0, 1, 2, 3\\}\\ a_i < 2^{32} \\\\ 0, & \\text{otherwise}\\ \\end{cases}$",
      },
      {
        instruction: "u32assert \n \n u32assert.1",
        stackInput: "[a, ...]",
        stackOutput: "[a, ...]",
        cycles: "3",
        notes: "Fails if $a \\ge 2^{32}$",
      },
      {
        instruction: "u32assert.2",
        stackInput: "[b, a,...]",
        stackOutput: "[b, a,...]",
        cycles: "1",
        notes: "Fails if $a \\ge 2^{32}$ or $b \\ge 2^{32}$",
      },
      {
        instruction: "u32assertw",
        stackInput: "[A, ...]",
        stackOutput: "[A, ...]",
        cycles: "6",
        notes:
          "Fails if $\\exists\\ i \\in \\{0, 1, 2, 3\\} \\\ni a_i \\ge 2^{32}$",
      },
      {
        instruction: "u32cast",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "2",
        notes: "$b \\leftarrow a \\mod 2^{32}$",
      },
      {
        instruction: "u32split",
        stackInput: "[a, ...]",
        stackOutput: "[c, b, ...]",
        cycles: "1",
        notes:
          "$b \\leftarrow a \\mod 2^{32}$, $c \\leftarrow \\lfloor{a / 2^{32}}\\rfloor$",
      },
    ],
  },
  {
    class: "Arithmetic operations",
    instructions: [
      {
        instruction: "u32checked_add \n \n u32checked_add.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "4 \n \n 5-6",
        notes:
          "$c \\leftarrow a + b$ \n \n Fails if $max(a, b, c) \\ge 2^{32}$",
      },
      {
        instruction: "u32overflowing_add \n \n u32overflowing_add.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[d, c, ...]",
        cycles: "1 \n \n 2-3",
        notes:
          "$c \\leftarrow (a + b) \\mod 2^{32}$ \n \n $d \\leftarrow \\begin{cases} 1, &",
        undefined:
          "ext{if}\\ (a + b) \\ge 2^{32} \\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32wrapping_add \n \n u32wrapping_add.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "2 \n \n 3-4",
        notes:
          "$c \\leftarrow (a + b) \\mod 2^{32}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32overflowing_add3",
        stackInput: "[c, b, a, ...]",
        stackOutput: "[e, d, ...]",
        cycles: "1",
        notes:
          "$d \\leftarrow (a + b + c) \\mod 2^{32}$, \n \n $e \\leftarrow \\lfloor (a + b + c) / 2^{32}\\rfloor$ \n \n Undefined if $max(a, b, c) \\ge 2^{32}$ \n \n",
      },
      {
        instruction: "u32wrapping_add3",
        stackInput: "[c, b, a, ...]",
        stackOutput: "[d, ...]",
        cycles: "2",
        notes:
          "$d \\leftarrow (a + b + c) \\mod 2^{32}$, \n \n Undefined if $max(a, b, c) \\ge 2^{32}$ \n \n",
      },
      {
        instruction: "u32checked_sub \n \n u32checked_sub.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "4 \n \n 5-6",
        notes:
          "$c \\leftarrow (a - b)$ \n \n Fails if $max(a, b) \\ge 2^{32}$ or $a < b$",
      },
      {
        instruction: "u32overflowing_sub \n \n u32overflowing_sub.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[d, c, ...]",
        cycles: "1 \n \n 2-3",
        notes:
          "$c \\leftarrow (a - b) \\mod 2^{32}$ \n \n $d \\leftarrow \\begin{cases} 1, & \\text{if}\\ a < b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32wrapping_sub \n \n u32wrapping_sub.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "2 \n \n 3-4",
        notes:
          "$c \\leftarrow (a - b) \\mod 2^{32}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_mul \n \n u32checked_mul.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "4 \n \n 5-6",
        notes:
          "$c \\leftarrow a \\cdot b$ \n \n Fails if $max(a, b, c) \\ge 2^{32}$",
      },
      {
        instruction: "u32overflowing_mul \n \n u32overflowing_mul.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[d, c, ...]",
        cycles: "1 \n \n 2-3",
        notes:
          "$c \\leftarrow (a \\cdot b) \\mod 2^{32}$ \n \n $d \\leftarrow \\lfloor(a \\cdot b) / 2^{32}\\rfloor$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32wrapping_mul \n \n u32wrapping_mul.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "2 \n \n 3-4",
        notes:
          "$c \\leftarrow (a \\cdot b) \\mod 2^{32}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32overflowing_madd",
        stackInput: "[b, a, c, ...]",
        stackOutput: "[e, d, ...]",
        cycles: "1",
        notes:
          "$d \\leftarrow (a \\cdot b + c) \\mod 2^{32}$ \n \n $e \\leftarrow \\lfloor(a \\cdot b + c) / 2^{32}\\rfloor$ \n \n Undefined if $max(a, b, c) \\ge 2^{32}$",
      },
      {
        instruction: "u32wrapping_madd",
        stackInput: "[b, a, c, ...]",
        stackOutput: "[d, ...]",
        cycles: "2",
        notes:
          "$d \\leftarrow (a \\cdot b + c) \\mod 2^{32}$ \n \n Undefined if $max(a, b, c) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_div \n \n u32checked_div.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "3 \n \n 4-5",
        notes:
          "$c \\leftarrow \\lfloor a / b\\rfloor$ \n \n Fails if $max(a, b) \\ge 2^{32}$ or $b = 0$",
      },
      {
        instruction: "u32unchecked_div \n \n u32unchecked_div.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "2 \n \n 3-4",
        notes:
          "$c \\leftarrow \\lfloor a / b\\rfloor$ \n \n Fails if $b = 0$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_mod \n \n u32checked_mod.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "4 \n \n 5-6",
        notes:
          "$c \\leftarrow a \\mod b$ \n \n Fails if $max(a, b) \\ge 2^{32}$ or $b = 0$",
      },
      {
        instruction: "u32unchecked_mod \n \n u32unchecked_mod.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "3 \n \n 4-5",
        notes:
          "$c \\leftarrow a \\mod b$ \n \n Fails if $b = 0$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_divmod \n \n u32checked_divmod.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[d, c, ...]",
        cycles: "2 \n \n 3-4",
        notes:
          "$c \\leftarrow \\lfloor a / b\\rfloor$ \n \n $d \\leftarrow a \\mod b$ \n \n Fails if $max(a, b) \\ge 2^{32}$ or $b = 0$",
      },
      {
        instruction: "u32unchecked_divmod \n \n u32unchecked_divmod.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[d, c, ...]",
        cycles: "1 \n \n 2-3",
        notes:
          "$c \\leftarrow \\lfloor a / b\\rfloor$ \n \n $d \\leftarrow a \\mod b$ \n \n Fails if $b = 0$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
    ],
  },
  {
    class: "Bitwise operations",
    instructions: [
      {
        instruction: "u32checked_and",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "1",
        notes:
          "Computes $c$ as a bitwise `AND` of binary representations of $a$ and $b$. \n \n Fails if $max(a,b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_or",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "6",
        notes:
          "Computes $c$ as a bitwise `OR` of binary representations of $a$ and $b$. \n \n Fails if $max(a,b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_xor",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "1",
        notes:
          "Computes $c$ as a bitwise `XOR` of binary representations of $a$ and $b$. \n \n Fails if $max(a,b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_not",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "5",
        notes:
          "Computes $b$ as a bitwise `NOT` of binary representation of $a$. \n \n Fails if $a \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_shl \n \n u32checked_shl.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "47 \n \n 4",
        notes:
          "$c \\leftarrow (a \\cdot 2^b) \\mod 2^{32}$ \n \n Fails if $a \\ge 2^{32}$ or $b > 31$",
      },
      {
        instruction: "u32unchecked_shl \n \n u32unchecked_shl.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "40 \n \n 3",
        notes:
          "$c \\leftarrow (a \\cdot 2^b) \\mod 2^{32}$ \n \n Undefined if $a \\ge 2^{32}$ or $b > 31$",
      },
      {
        instruction: "u32checked_shr \n \n u32checked_shr.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "47\n \n 4",
        notes:
          "$c \\leftarrow \\lfloor a/2^b \\rfloor$ \n \n Fails if $a \\ge 2^{32}$ or $b > 31$",
      },
      {
        instruction: "u32unchecked_shr \n \n u32unchecked_shr.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "40 \n \n 3",
        notes:
          "$c \\leftarrow \\lfloor a/2^b \\rfloor$ \n \n Undefined if $a \\ge 2^{32}$ or $b > 31$",
      },
      {
        instruction: "u32checked_rotl \n \n u32checked_rotl.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "47 \n \n 4",
        notes:
          "Computes $c$ by rotating a 32-bit representation of $a$ to the left by $b$ bits. \n \n Fails if $a \\ge 2^{32}$ or $b > 31$",
      },
      {
        instruction: "u32unchecked_rotl \n \n u32unchecked_rotl.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "40 \n \n 3",
        notes:
          "Computes $c$ by rotating a 32-bit representation of $a$ to the left by $b$ bits. \n \n Undefined if $a \\ge 2^{32}$ or $b > 31$",
      },
      {
        instruction: "u32checked_rotr \n \n u32checked_rotr.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "59 \n \n 6",
        notes:
          "Computes $c$ by rotating a 32-bit representation of $a$ to the right by $b$ bits. \n \n Fails if $a \\ge 2^{32}$ or $b > 31$",
      },
      {
        instruction: "u32unchecked_rotr \n \n u32unchecked_rotr.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "44 \n \n 3",
        notes:
          "Computes $c$ by rotating a 32-bit representation of $a$ to the right by $b$ bits. \n \n Undefined if $a \\ge 2^{32}$ or $b > 31$",
      },
      {
        instruction: "u32checked_popcnt",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "36",
        notes:
          "Computes $b$ by counting the number of set bits in $a$ (hamming weight of $a$).\n \n Fails if $a \\ge 2^{32}$",
      },
      {
        instruction: "u32unchecked_popcnt",
        stackInput: "[a, ...]",
        stackOutput: "[b, ...]",
        cycles: "33",
        notes:
          "Computes $b$ by counting the number of set bits in $a$ (hamming weight of $a$).\n \n Fails if $a \\ge 2^{32}$",
      },
    ],
  },
  {
    class: "Comparison operations u32",
    instructions: [
      {
        instruction: "u32checked_eq \n \n u32checked_eq.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "2 \n \n 3-4",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a=b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Fails if $max(a, b) \\ge 2^{32}$ \n \n Note: unchecked version is not provided because it is equivalent to simple `eq`.",
      },
      {
        instruction: "u32checked_neq \n \n u32checked_neq.*b*",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "3 \n \n 4-5",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a \\ne b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Fails if $max(a, b) \\ge 2^{32}$ \n \n Note: unchecked version is not provided because it is equivalent to simple `neq`.",
      },
      {
        instruction: "u32checked_lt",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "6",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a < b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Fails if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32unchecked_lt",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "5",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a < b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_lte",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "8",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a \\le b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Fails if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32unchecked_lte",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "7",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a \\le b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_gt",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "7",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a > b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Fails if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32unchecked_gt",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "6",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a > b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_gte",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "7",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a \\ge b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Fails if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32unchecked_gte",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "6",
        notes:
          "$c \\leftarrow \\begin{cases} 1, & \\text{if}\\ a \\ge b \\\\ 0, & \\text{otherwise}\\ \\end{cases}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_min",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "9",
        notes:
          "$c \\leftarrow \\begin{cases} a, & \\text{if}\\ a < b \\\\ b, & \\text{otherwise}\\ \\end{cases}$ \n \n Fails if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32unchecked_min",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "8",
        notes:
          "$c \\leftarrow \\begin{cases} a, & \\text{if}\\ a < b \\\\ b, & \\text{otherwise}\\ \\end{cases}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32checked_max",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "10",
        notes:
          "$c \\leftarrow \\begin{cases} a, & \\text{if}\\ a > b \\\\ b, & \\text{otherwise}\\ \\end{cases}$ \n \n Fails if $max(a, b) \\ge 2^{32}$",
      },
      {
        instruction: "u32unchecked_max",
        stackInput: "[b, a, ...]",
        stackOutput: "[c, ...]",
        cycles: "9",
        notes:
          "$c \\leftarrow \\begin{cases} a, & \\text{if}\\ a > b \\\\ b, & \\text{otherwise}\\ \\end{cases}$ \n \n Undefined if $max(a, b) \\ge 2^{32}$",
      },
    ],
  },
  {
    class: "Hashing and Merkle trees",
    instructions: [
      {
        instruction: "hperm",
        stackInput: "[C, B, A, ...]",
        stackOutput: "[F, E, D, ...]",
        cycles: "1",
        notes:
          "$\\{D, E, F\\} \\leftarrow permute(A, B, C)$ \n \n where, $permute()$ computes a Rescue Prime Optimized permutation.",
      },
      {
        instruction: "hash",
        stackInput: "[A, ...]",
        stackOutput: "[B, ...]",
        cycles: "20",
        notes:
          "$B \\leftarrow hash(A)$ \n \n where, $hash()$ computes a 1-to-1 Rescue Prime Optimized hash.",
      },
      {
        instruction: "hmerge",
        stackInput: "[B, A, ...]",
        stackOutput: "[C, ...]",
        cycles: "16",
        notes:
          "$C \\leftarrow hash(A, B)$ \n \n where, $hash()$ computes a 2-to-1 Rescue Prime Optimized hash.",
      },
      {
        instruction: "mtree_get",
        stackInput: "[d, i, R, ...]",
        stackOutput: "[V, R, ...]",
        cycles: "9",
        notes:
          "Verifies that a Merkle tree with root $R$ opens to node $V$ at depth $d$ and index $i$. \n \n  Merkle tree with root $R$ must be present in the advice provider, otherwise execution fails.",
      },
      {
        instruction: "mtree_set",
        stackInput: "[d, i, R, V, ...]",
        stackOutput: "[R', V, ...]",
        cycles: "29",
        notes:
          "Updates a node in the Merkle tree with root $R$ at depth $d$ and index $i$ to value $V$. \n \n $R'$ is the Merkle root of the resulting tree. \n \n  Merkle tree with root $R$ must be present in the advice provider, otherwise execution fails. \n \n At the end of the operation Merkle tree in the advice provider with root $R$ \n \n is replaced with the Merkle tree with root $R'$.",
      },
      {
        instruction: "mtree_cwm",
        stackInput: "[d, i, R, V, ...]",
        stackOutput: "[R', V, R, ...]",
        cycles: "29",
        notes:
          "Copies a Merkle tree with root $R$ and updates a node at depth $d$ and index $i$ \n \n in the copied tree to value $V$. $R'$ is the Merkle root of the new tree. \n \n Merkle tree with root $R$ must be present in the advice provider, otherwise execution fails. \n \n At the end of the operation the advice provider will contain both Merkle trees.",
      },
    ],
  },
];
