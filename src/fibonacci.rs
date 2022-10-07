use super::*;
use log::debug;

// EXAMPLE BUILDER
// ================================================================================================

pub fn get_example(n: usize) -> Example {
    // generate the program and expected results
    let program = generate_fibonacci_program(n);
    let expected_result = vec![compute_fibonacci(n).as_int()];
    debug!(
        "Generated a program to compute {}-th Fibonacci term; expected result: {}",
        n, expected_result[0]
    );

    Example {
        program,
        inputs: ProgramInputs::from_stack_inputs(&[1, 0]).unwrap(),
        pub_inputs: vec![1, 0],
        expected_result,
        num_outputs: 1,
    }
}

/// Generates a program to compute the `n`-th term of Fibonacci sequence
fn generate_fibonacci_program(n: usize) -> Program {
    // the program is a simple repetition of 4 stack operations:
    // the first operation moves the 2nd stack item to the top,
    // the second operation duplicates the top 2 stack items,
    // the third operation removes the top item from the stack
    // the last operation pops top 2 stack items, adds them, and pushes
    // the result back onto the stack
    let assembler = Assembler::new(true);

    let source = format!("
    begin 
        repeat.{}
            swap dup.2 drop add
        end
    end", n);
    
    let program = assembler.compile(&source).unwrap();

    return program;

}

/// Computes the `n`-th term of Fibonacci sequence
fn compute_fibonacci(n: usize) -> Felt {
    let mut n1 = Felt::ZERO;
    let mut n2 = Felt::ONE;

    for _ in 0..(n - 1) {
        let n3 = n1 + n2;
        n1 = n2;
        n2 = n3;
    }

    n2
}

// EXAMPLE TESTER
// ================================================================================================

#[test]
fn test_fib_example() {
    let example = get_example(16);
    super::test_example(example, false);
}

#[test]
fn test_fib_example_fail() {
    let example = get_example(16);
    super::test_example(example, true);
}