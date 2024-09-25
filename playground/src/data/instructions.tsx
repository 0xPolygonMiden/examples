export const assemblerInstructions = [
  {
    "class": "Hashing and Merkle trees",
    "instructions": [
      {
        "instruction": "hash \n - (20 cycles)",
        "stackInput": "[A, ...]",
        "stackOutput": "[B, ...]",
        "cycles": "20",
        "notes": "${B} \\leftarrow hash(A)$ \n where, $hash()$ computes a 1-to-1 Rescue Prime Optimized hash."
      },
      {
        "instruction": "hperm  \n - (1 cycle)",
        "stackInput": "[C, B, A, ...]",
        "stackOutput": "[F, E, D, ...]",
        "cycles": "1",
        "notes": "${D, E, F} \\leftarrow permute(A, B, C)$ \n Performs a Rescue Prime Optimized permutation on the top 3 words of the operand stack, where the top 2 words elements are the rate (words C and B), the deepest word is the capacity (word A), the digest output is the word E."
      },
      {
        "instruction": "hmerge  \n - (16 cycles)",
        "stackInput": "[B, A, ...]",
        "stackOutput": "[C, ...]",
        "cycles": "16",
        "notes": "$C \\leftarrow hash(A,B)$ \n where, $hash()$ computes a 2-to-1 Rescue Prime Optimized hash."
      },
      {
        "instruction": "mtree_get  \n - (9 cycles)",
        "stackInput": "[d, i, R, ...]",
        "stackOutput": "[V, R, ...]",
        "cycles": "9",
        "notes": "Fetches the node value from the advice provider and runs a verification equivalent to mtree_verify, returning the value if succeeded."
      },
      {
        "instruction": "mtree_set \n - (29 cycles)",
        "stackInput": "[d, i, R, V', ...]",
        "stackOutput": "[V, R', ...]",
        "cycles": "29",
        "notes": "Updates a node in the Merkle tree with root $R$ at depth $d$ and index $i$ to value $V'$. $R'$ is the Merkle root of the resulting tree and $V$ is old value of the node. Merkle tree with root $R$ must be present in the advice provider, otherwise execution fails. At the end of the operation the advice provider will contain both Merkle trees."
      },
      {
        "instruction": "mtree_merge \n - (16 cycles)",
        "stackInput": "[R, L, ...]",
        "stackOutput": "[M, ...]",
        "cycles": "16",
        "notes": "Merges two Merkle trees with the provided roots R (right), L (left) into a new Merkle tree with root M (merged). The input trees are retained in the advice provider."
      },
      {
        "instruction": "mtree_verify  \n - (1 cycle)",
        "stackInput": "[V, d, i, R, ...]",
        "stackOutput": "[V, d, i, R, ...]",
        "cycles": "1",
        "notes": "Verifies that a Merkle tree with root $R$ opens to node $V$ at depth $d$ and index $i$. Merkle tree with root $R$ must be present in the advice provider, otherwise execution fails."
      }
    ]
  },
  {
    "class": "Assertions and tests",
    "instructions": [
      {
        "instruction": "assert \n - (1 cycle)",
        "stackInput": "[a, ...]",
        "stackOutput": "[...]",
        "cycles": "1",
        "notes": "If $a = 1$, removes it from the stack. \n Fails if $a \\ne 1$"
      },
      {
        "instruction": "assertz \n - (2 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[...]",
        "cycles": "2",
        "notes": "If $a = 0$, removes it from the stack, \n Fails if $a \\ne 0$"
      },
      {
        "instruction": "assert_eq \n - (2 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[...]",
        "cycles": "2",
        "notes": "If $a = b$, removes them from the stack. \n Fails if $a \\ne b$"
      },
      {
        "instruction": "assert_eqw \n - (11 cycles)",
        "stackInput": "[B, A, ...]",
        "stackOutput": "[...]",
        "cycles": "11",
        "notes": "If $A = B$, removes them from the stack. \n Fails if $A \\ne B$"
      }
    ]
  },
  {
    "class": "Arithmetic and Boolean operations",
    "instructions": [
      {
        "instruction": "add \n - (1 cycle)  \n add.b \n - (1-2 cycle)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow (a + b) \\mod p$"
      },
      {
        "instruction": "sub \n - (2 cycles)  \n sub.b \n - (2 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "2",
        "notes": "$c \\leftarrow (a - b) \\mod p$"
      },
      {
        "instruction": "mul \n - (1 cycle)  \n mul.b \n - (2 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow (a \\cdot b) \\mod p$"
      },
      {
        "instruction": "div \n - (2 cycles)  \n div.b \n - (2 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "2",
        "notes": "$c \\leftarrow (a \\cdot b^{-1}) \\mod p$ \n Fails if $b = 0$"
      },
      {
        "instruction": "neg \n - (1 cycle)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "1",
        "notes": "$b \\leftarrow -a \\mod p$"
      },
      {
        "instruction": "inv \n - (1 cycle)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "1",
        "notes": "$b \\leftarrow a^{-1} \\mod p$ \n Fails if $a = 0$"
      },
      {
        "instruction": "pow2 \n - (16 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "16",
        "notes": "$b \\leftarrow 2^a$ \n Fails if $a > 63$"
      },
      {
        "instruction": "exp.uxx \n - (9 + xx cycles)  \n exp.b \n - (9 + log2(b) cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "",
        "notes": "$c \\leftarrow a^b$ \n Fails if xx is outside [0, 63) \n exp is equivalent to exp.u64 and needs 73 cycles"
      },
      {
        "instruction": "ilog2 \n - (44 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "44",
        "notes": "$b \\leftarrow \\lfloor{log_2{a}}\\rfloor$ \n Fails if $a = 0 $"
      },
      {
        "instruction": "not \n - (1 cycle)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "1",
        "notes": "$b \\leftarrow 1 - a$ \n Fails if $a > 1$"
      },
      {
        "instruction": "and \n - (1 cycle)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow a \\cdot b$ \n Fails if $max(a, b) > 1$"
      },
      {
        "instruction": "or \n - (1 cycle)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow a + b - a \\cdot b$ \n Fails if $max(a, b) > 1$"
      },
      {
        "instruction": "xor \n - (7 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "7",
        "notes": "$c \\leftarrow a + b - 2 \\cdot a \\cdot b$ \n Fails if $max(a, b) > 1$"
      }
    ]
  },
  {
    "class": "Comparison operations",
    "instructions": [
      {
        "instruction": "eq \n - (1 cycle)  \n eq.b \n - (1-2 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a=b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "neq \n - (2 cycle)  \n neq.b \n - (2-3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "2",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a \\ne b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "lt \n - (14 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "14",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a &lt; b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "lte \n - (15 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "15",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a \\le b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "gt \n - (15 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "15",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a > b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "gte \n - (16 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "16",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a \\ge b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "is_odd \n - (5 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "5",
        "notes": "$b \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a \\text{ is odd} \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "eqw \n - (15 cycles)",
        "stackInput": "[A, B, ...]",
        "stackOutput": "[c, A, B, ...]",
        "cycles": "15",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a_i = b_i ; \\forall i \\in {0, 1, 2, 3} \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      }
    ]
  },
  {
    "class": "Extension Field Operations",
    "instructions": [
      {
        "instruction": "ext2add \n - (5 cycles)   \n",
        "stackInput": "[b1, b0, a1, a0, ...]",
        "stackOutput": "[c1, c0, ...]",
        "cycles": "5",
        "notes": "$c1 \\leftarrow (a1 + b1) \\mod p$ and \n $c0 \\leftarrow (a0 + b0) \\mod p$"
      },
      {
        "instruction": "ext2sub \n - (7 cycles)   \n",
        "stackInput": "[b1, b0, a1, a0, ...]",
        "stackOutput": "[c1, c0, ...]",
        "cycles": "7",
        "notes": "$c1 \\leftarrow (a1 - b1) \\mod p$ and \n $c0 \\leftarrow (a0 - b0) \\mod p$"
      },
      {
        "instruction": "ext2mul \n - (3 cycles)   \n",
        "stackInput": "[b1, b0, a1, a0, ...]",
        "stackOutput": "[c1, c0, ...]",
        "cycles": "3",
        "notes": "$c1 \\leftarrow (a0 + a1) * (b0 + b1) \\mod p$ and \n $c0 \\leftarrow (a0 * b0) - 2 * (a1 * b1) \\mod p$"
      },
      {
        "instruction": "ext2neg \n - (4 cycles)   \n",
        "stackInput": "[a1, a0, ...]",
        "stackOutput": "[a1', a0', ...]",
        "cycles": "4",
        "notes": "$a1' \\leftarrow -a1$ and $a0' \\leftarrow -a0$"
      },
      {
        "instruction": "ext2inv \n - (8 cycles)   \n",
        "stackInput": "[a1, a0, ...]",
        "stackOutput": "[a1', a0', ...]",
        "cycles": "8",
        "notes": "$a' \\leftarrow a^{-1} \\mod q$ \n Fails if $a = 0$"
      },
      {
        "instruction": "ext2div \n - (11 cycles)  \n",
        "stackInput": "[b1, b0, a1, a0, ...]",
        "stackOutput": "[c1, c0,]",
        "cycles": "11",
        "notes": "$c \\leftarrow a * b^{-1}$ fails if $b=0$, where multiplication and inversion are as defined by the operations above"
      }
    ]
  },
  {
    "class": "Constant inputs",
    "instructions": [
      {
        "instruction": "push.a \n - (1-2 cycles) \n\n push.a.b \n\n push.a.b.c...",
        "stackInput": "[ ... ]",
        "stackOutput": "[a, ... ] \n [b, a, ... ] \n [c, b, a, ... ]",
        "cycles": "",
        "notes": "Pushes values $a$, $b$, $c$ etc. onto the stack. Up to $16$ values can be specified. All values must be valid field elements in decimal (e.g., $123$) or hexadecimal (e.g., $0x7b$) representation."
      }
    ]
  },
  {
    "class": "Environment inputs",
    "instructions": [
      {
        "instruction": "clk \n - (1 cycle)",
        "stackInput": "[ ... ]",
        "stackOutput": "[t, ... ]",
        "cycles": "1",
        "notes": "$t \\leftarrow clock_value()$ \n Pushes the current value of the clock cycle counter onto the stack."
      },
      {
        "instruction": "sdepth \n - (1 cycle)",
        "stackInput": "[ ... ]",
        "stackOutput": "[d, ... ]",
        "cycles": "1",
        "notes": "$d \\leftarrow stack.depth()$ \n Pushes the current depth of the stack onto the stack."
      },
      {
        "instruction": "caller \n - (1 cycle)",
        "stackInput": "[A, b, ... ]",
        "stackOutput": "[H, b, ... ]",
        "cycles": "1",
        "notes": "$H \\leftarrow context.fn_hash()$ \n Overwrites the top four stack items with the hash of a function which initiated the current SYSCALL. \n Executing this instruction outside of SYSCALL context will fail."
      },
      {
        "instruction": "locaddr.i \n - (2 cycles)",
        "stackInput": "[ ... ]",
        "stackOutput": "[a, ... ]",
        "cycles": "2",
        "notes": "$a \\leftarrow address_of(i)$ \n Pushes the absolute memory address of local memory at index $i$ onto the stack."
      },
      {
        "instruction": "procref.name \n - (4 cycles)",
        "stackInput": "[ ... ]",
        "stackOutput": "[A, ... ]",
        "cycles": "4",
        "notes": "$A \\leftarrow mast_root()$ \n Pushes MAST root of the procedure with name $name$ onto the stack."
      }
    ]
  },
  {
    "class": "Nondeterministic inputs",
    "instructions": [
      {
        "instruction": "adv_push.n \n - (n cycles)",
        "stackInput": "[ ... ]",
        "stackOutput": "[a, ... ]",
        "cycles": "",
        "notes": "$a \\leftarrow stack.pop()$ \n Pops $n$ values from the advice stack and pushes them onto the operand stack. Valid for $n \\in {1, ..., 16}$. \n Fails if the advice stack has fewer than $n$ values."
      },
      {
        "instruction": "adv_loadw \n - (1 cycle)",
        "stackInput": "[0, 0, 0, 0, ... ]",
        "stackOutput": "[A, ... ]",
        "cycles": "1",
        "notes": "$A \\leftarrow stack.pop(4)$ \n Pop the next word (4 elements) from the advice stack and overwrites the first word of the operand stack (4 elements) with them. \n Fails if the advice stack has fewer than $4$ values."
      },
      {
        "instruction": "adv_pipe \n - (1 cycle)",
        "stackInput": "[C, B, A, a, ... ]",
        "stackOutput": "[E, D, A, a', ... ]",
        "cycles": "1",
        "notes": "$[D, E] \\leftarrow [adv_stack.pop(4), adv_stack.pop(4)]$ \n $a' \\leftarrow a + 2$ \n Pops the next two words from the advice stack, overwrites the top of the operand stack with them and also writes these words into memory at address $a$ and $a + 1$.\n Fails if the advice stack has fewer than $8$ values."
      }
    ]
  },
  {
    "class": "Random access memory",
    "instructions": [
      {
        "instruction": "adv.push_mapval \n\n  adv.push_mapval.s",
        "stackInput": "[K, ... ]",
        "stackOutput": "[K, ... ]",
        "cycles": "",
        "notes": "Pushes a list of field elements onto the advice stack. The list is looked up in the advice map using word $K$ as the key. If offset $s$ is provided, the key is taken starting from item $s$ on the stack."
      },
      {
        "instruction": "adv.push_mapvaln \n\n adv.push_mapvaln.s",
        "stackInput": "[K, ... ]",
        "stackOutput": "[K, ... ]",
        "cycles": "",
        "notes": "Pushes a list of field elements together with the number of elements onto the advice stack. The list is looked up in the advice map using word $K$ as the key. If offset $s$ is provided, the key is taken starting from item $s$ on the stack."
      },
      {
        "instruction": "adv.push_mtnode",
        "stackInput": "[d, i, R, ... ]",
        "stackOutput": "[d, i, R, ... ]",
        "cycles": "",
        "notes": "Pushes a node of a Merkle tree with root $R$ at depth $d$ and index $i$ from Merkle store onto the advice stack."
      },
      {
        "instruction": "adv.push_u64div",
        "stackInput": "[b1, b0, a1, a0, ...]",
        "stackOutput": "[b1, b0, a1, a0, ...]",
        "cycles": "",
        "notes": "Pushes the result of u64 division $a / b$ onto the advice stack. Both $a$ and $b$ are represented using 32-bit limbs. The result consists of both the quotient and the remainder."
      },
      {
        "instruction": "adv.push_ext2intt",
        "stackInput": "[osize, isize, iptr, ... ]",
        "stackOutput": "[osize, isize, iptr, ... ]",
        "cycles": "",
        "notes": "Given evaluations of a polynomial over some specified domain, interpolates the evaluations into a polynomial in coefficient form and pushes the result into the advice stack."
      },
      {
        "instruction": "adv.push_sig.kind",
        "stackInput": "[K, M, ...]",
        "stackOutput": "[K, M, ...]",
        "cycles": "",
        "notes": "Pushes values onto the advice stack which are required for verification of a DSA with scheme specified by kind against the public key commitment $K$ and message $M$."
      },
      {
        "instruction": "adv.push_smtpeek",
        "stackInput": "[K, R, ... ]",
        "stackOutput": "[K, R, ... ]",
        "cycles": "",
        "notes": "Pushes value onto the advice stack which is associated with key $K$ in a Sparse Merkle Tree with root $R$."
      },
      {
        "instruction": "adv.insert_mem",
        "stackInput": "[K, a, b, ... ]",
        "stackOutput": "[K, a, b, ... ]",
        "cycles": "",
        "notes": "Reads words $data \\leftarrow mem[a] .. mem[b]$ from memory, and save the data into $advice_map[K] \\leftarrow data$."
      },
      {
        "instruction": "adv.insert_hdword \n\n adv.insert_hdword.d",
        "stackInput": "[B, A, ... ]",
        "stackOutput": "[B, A, ... ]",
        "cycles": "",
        "notes": "Reads top two words from the stack, computes a key as $K \\leftarrow hash(A"
      },
      {
        "instruction": "adv.insert_hperm",
        "stackInput": "[B, A, C, ...]",
        "stackOutput": "[B, A, C, ...]",
        "cycles": "",
        "notes": "Reads top three words from the stack, computes a key as $K \\leftarrow permute(C, A, B).digest$, and saves data into $advice_mpa[K] \\leftarrow [A, B]$."
      }
    ]
  },
  {
    "class": "Procedures",
    "instructions": [
      {
        "instruction": "mem_load \n - (1 cycle)  \n mem_load.a \n - (2 cycles)",
        "stackInput": "[a, ... ]",
        "stackOutput": "[v, ... ]",
        "cycles": "1",
        "notes": "$v \\leftarrow mem[a][0]$ \n Reads a word (4 elements) from memory at address a, and pushes the first element of the word onto the stack. If $a$ is provided via the stack, it is removed from the stack first. \n Fails if $a \\ge 2^{32}$"
      },
      {
        "instruction": "mem_loadw \n - (1 cycle)  \n mem_loadw.a \n - (2 cycles)",
        "stackInput": "[a, 0, 0, 0, 0, ... ]",
        "stackOutput": "[A, ... ]",
        "cycles": "1",
        "notes": "$A \\leftarrow mem[a]$ \n Reads a word from memory at address $a$ and overwrites top four stack elements with it. If $a$ is provided via the stack, it is removed from the stack first. \n Fails if $a \\ge 2^{32}$"
      },
      {
        "instruction": "mem_store \n - (2 cycles)  \n mem_store.a  \n - (3-4 cycles)",
        "stackInput": "[a, v, ... ]",
        "stackOutput": "[ ... ]",
        "cycles": "2",
        "notes": "$v \\rightarrow mem[a][0]$ \n Pops the top element off the stack and stores it as the first element of the word in memory at address $a$. All other elements of the word are not affected. If $a$ is provided via the stack, it is removed from the stack first. \n Fails if $a \\ge 2^{32}$"
      },
      {
        "instruction": "mem_storew \n - (1 cycle)  \n mem_storew.a \n - (2-3 cycles)",
        "stackInput": "[a, A, ... ]",
        "stackOutput": "[A, ... ]",
        "cycles": "1",
        "notes": "$A \\rightarrow mem[a]$ \n Stores the top four elements of the stack in memory at address $a$. If $a$ is provided via the stack, it is removed from the stack first. \n Fails if $a \\ge 2^{32}$"
      },
      {
        "instruction": "mem_stream \n - (1 cycle)",
        "stackInput": "[C, B, A, a, ... ]",
        "stackOutput": "[E, D, A, a', ... ]",
        "cycles": "1",
        "notes": "$[E, D] \\leftarrow [mem[a], mem[a+1]]$ \n $a' \\leftarrow a + 2$ \n Read two sequential words from memory starting at address $a$ and overwrites the first two words in the operand stack."
      }
    ]
  },
  {
    "class": "Procedures",
    "instructions": [
      {
        "instruction": "loc_load.i \n - (3-4 cycles)",
        "stackInput": "[ ... ]",
        "stackOutput": "[v, ... ]",
        "cycles": "",
        "notes": "$v \\leftarrow local[i][0]$ \n Reads a word (4 elements) from local memory at index i, and pushes the first element of the word onto the stack."
      },
      {
        "instruction": "loc_loadw.i  \n - (3-4 cycles)",
        "stackInput": "[0, 0, 0, 0, ... ]",
        "stackOutput": "[A, ... ]",
        "cycles": "",
        "notes": "$A \\leftarrow local[i]$ \n Reads a word from local memory at index $i$ and overwrites top four stack elements with it."
      },
      {
        "instruction": "loc_store.i \n - (4-5 cycles)",
        "stackInput": "[v, ... ]",
        "stackOutput": "[ ... ]",
        "cycles": "",
        "notes": "$v \\rightarrow local[i][0]$ \n Pops the top element off the stack and stores it as the first element of the word in local memory at index $i$. All other elements of the word are not affected."
      },
      {
        "instruction": "loc_storew.i \n - (3-4 cycles)",
        "stackInput": "[A, ... ]",
        "stackOutput": "[A, ... ]",
        "cycles": "",
        "notes": "$A \\rightarrow local[i]$ \n Stores the top four elements of the stack in local memory at index $i$."
      }
    ]
  },
  {
    "class": "Conditional manipulation",
    "instructions": [
      {
        "instruction": "drop \n - (1 cycle)",
        "stackInput": "[a, ... ]",
        "stackOutput": "[ ... ]",
        "cycles": "1",
        "notes": "Deletes the top stack item."
      },
      {
        "instruction": "dropw \n - (4 cycles)",
        "stackInput": "[A, ... ]",
        "stackOutput": "[ ... ]",
        "cycles": "4",
        "notes": "Deletes a word (4 elements) from the top of the stack."
      },
      {
        "instruction": "padw  \n - (4 cycles)",
        "stackInput": "[ ... ]",
        "stackOutput": "[0, 0, 0, 0, ... ]",
        "cycles": "4",
        "notes": "Pushes four $0$ values onto the stack. \n Note: simple pad is not provided because push.0 does the same thing."
      },
      {
        "instruction": "dup.n \n - (1-3 cycles)",
        "stackInput": "[ ..., a, ... ]",
        "stackOutput": "[a, ..., a, ... ]",
        "cycles": "",
        "notes": "Pushes a copy of the $n$th stack item onto the stack. dup and dup.0 are the same instruction. Valid for $n \\in {0, ..., 15}$"
      },
      {
        "instruction": "dupw.n \n - (4 cycles)",
        "stackInput": "[ ..., A, ... ]",
        "stackOutput": "[A, ..., A, ... ]",
        "cycles": "4",
        "notes": "Pushes a copy of the $n$th stack word onto the stack. dupw and dupw.0 are the same instruction. Valid for $n \\in {0, 1, 2, 3}$"
      },
      {
        "instruction": "swap.n \n - (1-6 cycles)",
        "stackInput": "[a, ..., b, ... ]",
        "stackOutput": "[b, ..., a, ... ]",
        "cycles": "",
        "notes": "Swaps the top stack item with the $n$th stack item. swap and swap.1 are the same instruction. Valid for $n \\in {1, ..., 15}$"
      },
      {
        "instruction": "swapw.n \n - (1 cycle)",
        "stackInput": "[A, ..., B, ... ]",
        "stackOutput": "[B, ..., A, ... ]",
        "cycles": "1",
        "notes": "Swaps the top stack word with the $n$th stack word. swapw and swapw.1 are the same instruction. Valid for $n \\in {1, 2, 3}$"
      },
      {
        "instruction": "swapdw \n - (1 cycle)",
        "stackInput": "[D, C, B, A, ... ]",
        "stackOutput": "[B, A, D, C ... ]",
        "cycles": "1",
        "notes": "Swaps words on the top of the stack. The 1st with the 3rd, and the 2nd with the 4th."
      },
      {
        "instruction": "movup.n \n - (1-4 cycles)",
        "stackInput": "[ ..., a, ... ]",
        "stackOutput": "[a, ... ]",
        "cycles": "",
        "notes": "Moves the $n$th stack item to the top of the stack. Valid for $n \\in {2, ..., 15}$"
      },
      {
        "instruction": "movupw.n \n - (2-3 cycles)",
        "stackInput": "[ ..., A, ... ]",
        "stackOutput": "[A, ... ]",
        "cycles": "",
        "notes": "Moves the $n$th stack word to the top of the stack. Valid for $n \\in {2, 3}$"
      },
      {
        "instruction": "movdn.n \n - (1-4 cycles)",
        "stackInput": "[a, ... ]",
        "stackOutput": "[ ..., a, ... ]",
        "cycles": "",
        "notes": "Moves the top stack item to the $n$th position of the stack. Valid for $n \\in {2, ..., 15}$"
      },
      {
        "instruction": "movdnw.n \n - (2-3 cycles)",
        "stackInput": "[A, ... ]",
        "stackOutput": "[ ..., A, ... ]",
        "cycles": "",
        "notes": "Moves the top stack word to the $n$th word position of the stack. Valid for $n \\in {2, 3}$"
      }
    ]
  },
  {
    "class": "Procedures",
    "instructions": [
      {
        "instruction": "cswap  \n - (1 cycle)",
        "stackInput": "[c, b, a, ... ]",
        "stackOutput": "[e, d, ... ]",
        "cycles": "1",
        "notes": "$d = \\begin{cases} a, &amp; \\text{if}\\ c = 0 \\ b, &amp; \\text{if}\\ c = 1\\ \\end{cases}$ \n $e = \\begin{cases} b, &amp; \\text{if}\\ c = 0 \\ a, &amp; \\text{if}\\ c = 1\\ \\end{cases}$  \n Fails if $c > 1$"
      },
      {
        "instruction": "cswapw  \n - (1 cycle)",
        "stackInput": "[c, B, A, ... ]",
        "stackOutput": "[E, D, ... ]",
        "cycles": "1",
        "notes": "$D = \\begin{cases} A, &amp; \\text{if}\\ c = 0 \\ B, &amp; \\text{if}\\ c = 1\\ \\end{cases}$ \n $E = \\begin{cases} B, &amp; \\text{if}\\ c = 0 \\ A, &amp; \\text{if}\\ c = 1\\ \\end{cases}$  \n Fails if $c > 1$"
      },
      {
        "instruction": "cdrop   \n - (2 cycles)",
        "stackInput": "[c, b, a, ... ]",
        "stackOutput": "[d, ... ]",
        "cycles": "2",
        "notes": "$d = \\begin{cases} a, &amp; \\text{if}\\ c = 0 \\ b, &amp; \\text{if}\\ c = 1\\ \\end{cases}$ \n Fails if $c > 1$"
      },
      {
        "instruction": "cdropw  \n - (5 cycles)",
        "stackInput": "[c, B, A, ... ]",
        "stackOutput": "[D, ... ]",
        "cycles": "5",
        "notes": "$D = \\begin{cases} A, &amp; \\text{if}\\ c = 0 \\ B, &amp; \\text{if}\\ c = 1\\ \\end{cases}$ \n Fails if $c > 1$"
      }
    ]
  },
  {
    "class": "Conversions and tests",
    "instructions": [
      {
        "instruction": "u32test \n - (5 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, a, ...]",
        "cycles": "5",
        "notes": "$b \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a &lt; 2^{32} \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "u32testw \n - (23 cycles)",
        "stackInput": "[A, ...]",
        "stackOutput": "[b, A, ...]",
        "cycles": "23",
        "notes": "$b \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ \\forall\\ i \\in {0, 1, 2, 3}\\ a_i &lt; 2^{32} \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$"
      },
      {
        "instruction": "u32assert \n - (3 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[a, ...]",
        "cycles": "3",
        "notes": "Fails if $a \\ge 2^{32}$"
      },
      {
        "instruction": "u32assert2 \n - (1 cycle)",
        "stackInput": "[b, a,...]",
        "stackOutput": "[b, a,...]",
        "cycles": "1",
        "notes": "Fails if $a \\ge 2^{32}$ or $b \\ge 2^{32}$"
      },
      {
        "instruction": "u32assertw \n - (6 cycles)",
        "stackInput": "[A, ...]",
        "stackOutput": "[A, ...]",
        "cycles": "6",
        "notes": "Fails if $\\exists\\ i \\in {0, 1, 2, 3} : a_i \\ge 2^{32}$"
      },
      {
        "instruction": "u32cast \n - (2 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "2",
        "notes": "$b \\leftarrow a \\mod 2^{32}$"
      },
      {
        "instruction": "u32split \n - (1 cycle)",
        "stackInput": "[a, ...]",
        "stackOutput": "[c, b, ...]",
        "cycles": "1",
        "notes": "$b \\leftarrow a \\mod 2^{32}$, $c \\leftarrow \\lfloor{a / 2^{32}}\\rfloor$"
      }
    ]
  },
  {
    "class": "Arithmetic operations",
    "instructions": [
      {
        "instruction": "u32overflowing_add \n - (1 cycle) \n\n u32overflowing_add.b \n - (2-3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[d, c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow (a + b) \\mod 2^{32}$ \n $d \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ (a + b) \\ge 2^{32} \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32wrapping_add \n - (2 cycles) \n\n u32wrapping_add.b \n - (3-4 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "2",
        "notes": "$c \\leftarrow (a + b) \\mod 2^{32}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32overflowing_add3 \n - (1 cycle)",
        "stackInput": "[c, b, a, ...]",
        "stackOutput": "[e, d, ...]",
        "cycles": "1",
        "notes": "$d \\leftarrow (a + b + c) \\mod 2^{32}$, \n $e \\leftarrow \\lfloor (a + b + c) / 2^{32}\\rfloor$ \n Undefined if $max(a, b, c) \\ge 2^{32}$ \n"
      },
      {
        "instruction": "u32wrapping_add3 \n - (2 cycles)",
        "stackInput": "[c, b, a, ...]",
        "stackOutput": "[d, ...]",
        "cycles": "2",
        "notes": "$d \\leftarrow (a + b + c) \\mod 2^{32}$, \n Undefined if $max(a, b, c) \\ge 2^{32}$ \n"
      },
      {
        "instruction": "u32overflowing_sub \n - (1 cycle) \n\n u32overflowing_sub.b \n - (2-3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[d, c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow (a - b) \\mod 2^{32}$ \n $d \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a &lt; b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32wrapping_sub \n - (2 cycles) \n\n u32wrapping_sub.b \n - (3-4 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "2",
        "notes": "$c \\leftarrow (a - b) \\mod 2^{32}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32overflowing_mul \n - (1 cycle) \n\n u32overflowing_mul.b \n - (2-3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[d, c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow (a \\cdot b) \\mod 2^{32}$ \n $d \\leftarrow \\lfloor(a \\cdot b) / 2^{32}\\rfloor$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32wrapping_mul \n - (2 cycles) \n\n u32wrapping_mul.b \n - (3-4 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "2",
        "notes": "$c \\leftarrow (a \\cdot b) \\mod 2^{32}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32overflowing_madd \n - (1 cycle)",
        "stackInput": "[b, a, c, ...]",
        "stackOutput": "[e, d, ...]",
        "cycles": "1",
        "notes": "$d \\leftarrow (a \\cdot b + c) \\mod 2^{32}$ \n $e \\leftarrow \\lfloor(a \\cdot b + c) / 2^{32}\\rfloor$ \n Undefined if $max(a, b, c) \\ge 2^{32}$"
      },
      {
        "instruction": "u32wrapping_madd \n - (2 cycles)",
        "stackInput": "[b, a, c, ...]",
        "stackOutput": "[d, ...]",
        "cycles": "2",
        "notes": "$d \\leftarrow (a \\cdot b + c) \\mod 2^{32}$ \n Undefined if $max(a, b, c) \\ge 2^{32}$"
      },
      {
        "instruction": "u32div \n - (2 cycles) \n\n u32div.b \n - (3-4 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "2",
        "notes": "$c \\leftarrow \\lfloor a / b\\rfloor$ \n Fails if $b = 0$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32mod \n - (3 cycles) \n u32mod.b \n - (4-5 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "3",
        "notes": "$c \\leftarrow a \\mod b$ \n Fails if $b = 0$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32divmod \n - (1 cycle) \n\n u32divmod.b \n - (2-3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[d, c, ...]",
        "cycles": "1",
        "notes": "$c \\leftarrow \\lfloor a / b\\rfloor$ \n $d \\leftarrow a \\mod b$ \n Fails if $b = 0$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      }
    ]
  },
  {
    "class": "Bitwise operations",
    "instructions": [
      {
        "instruction": "u32and \n - (1 cycle)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "1",
        "notes": "Computes $c$ as a bitwise AND of binary representations of $a$ and $b$. \n Fails if $max(a,b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32or \n - (6 cycle)s",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "6",
        "notes": "Computes $c$ as a bitwise OR of binary representations of $a$ and $b$. \n Fails if $max(a,b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32xor \n - (1 cycle)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "1",
        "notes": "Computes $c$ as a bitwise XOR of binary representations of $a$ and $b$. \n Fails if $max(a,b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32not \n - (5 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "5",
        "notes": "Computes $b$ as a bitwise NOT of binary representation of $a$. \n Fails if $a \\ge 2^{32}$"
      },
      {
        "instruction": "u32shl \n - (18 cycles) \n\n u32shl.b \n - (3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "18",
        "notes": "$c \\leftarrow (a \\cdot 2^b) \\mod 2^{32}$ \n Undefined if $a \\ge 2^{32}$ or $b > 31$"
      },
      {
        "instruction": "u32shr \n - (18 cycles) \n\n u32shr.b \n - (3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "18",
        "notes": "$c \\leftarrow \\lfloor a/2^b \\rfloor$ \n Undefined if $a \\ge 2^{32}$ or $b > 31$"
      },
      {
        "instruction": "u32rotl \n - (18 cycles) \n\n u32rotl.b \n - (3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "18",
        "notes": "Computes $c$ by rotating a 32-bit representation of $a$ to the left by $b$ bits. \n Undefined if $a \\ge 2^{32}$ or $b > 31$"
      },
      {
        "instruction": "u32rotr \n - (22 cycles) \n\n u32rotr.b \n - (3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "22",
        "notes": "Computes $c$ by rotating a 32-bit representation of $a$ to the right by $b$ bits. \n Undefined if $a \\ge 2^{32}$ or $b > 31$"
      },
      {
        "instruction": "u32popcnt \n - (33 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "33",
        "notes": "Computes $b$ by counting the number of set bits in $a$ (hamming weight of $a$). \n Undefined if $a \\ge 2^{32}$"
      },
      {
        "instruction": "u32clz \n - (37 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "37",
        "notes": "Computes $b$ as a number of leading zeros of $a$. \n Undefined if $a \\ge 2^{32}$"
      },
      {
        "instruction": "u32ctz \n - (34 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "34",
        "notes": "Computes $b$ as a number of trailing zeros of $a$. \n Undefined if $a \\ge 2^{32}$"
      },
      {
        "instruction": "u32clo \n - (36 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "36",
        "notes": "Computes $b$ as a number of leading ones of $a$. \n Undefined if $a \\ge 2^{32}$"
      },
      {
        "instruction": "u32cto \n - (33 cycles)",
        "stackInput": "[a, ...]",
        "stackOutput": "[b, ...]",
        "cycles": "33",
        "notes": "Computes $b$ as a number of trailing ones of $a$. \n Undefined if $a \\ge 2^{32}$"
      }
    ]
  },
  {
    "class": "Comparison operations",
    "instructions": [
      {
        "instruction": "u32lt \n - (3 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "3",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a &lt; b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32lte \n - (5 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "5",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a \\le b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32gt \n - (4 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "4",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a > b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32gte \n - (4 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "4",
        "notes": "$c \\leftarrow \\begin{cases} 1, &amp; \\text{if}\\ a \\ge b \\ 0, &amp; \\text{otherwise}\\ \\end{cases}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32min \n - (8 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "8",
        "notes": "$c \\leftarrow \\begin{cases} a, &amp; \\text{if}\\ a &lt; b \\ b, &amp; \\text{otherwise}\\ \\end{cases}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      },
      {
        "instruction": "u32max \n - (9 cycles)",
        "stackInput": "[b, a, ...]",
        "stackOutput": "[c, ...]",
        "cycles": "9",
        "notes": "$c \\leftarrow \\begin{cases} a, &amp; \\text{if}\\ a > b \\ b, &amp; \\text{otherwise}\\ \\end{cases}$ \n Undefined if $max(a, b) \\ge 2^{32}$"
      }
    ]
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Terms and notations",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  },
  {
    "class": "Procedures",
    "instructions": []
  }
];