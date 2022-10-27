use super::*;
use log::debug;


// EXAMPLE BUILDER
// ================================================================================================

pub fn get_example(value: usize) -> Example {
    // determine the expected result
    let value = value as u64;
    let expected_result = if value < 9 { value * 9 } else { value + 9 };

    // construct the program which checks if the value provided via secret inputs is
    // less than 9; if it is, the value is multiplied by 9, otherwise, 9 is added
    // to the value; then we check if the value is odd.
    let assembler = Assembler::new(true);
    let program = assembler.compile(
    
        "
    begin
        adv_push.1
        dup
        push.9
        lt
        if.true
            push.9
            mul
        else
            push.9
            add
        end
        push.2
        u32checked_mod
    end",
    )
    .unwrap();

    debug!(
        "Generated a program to test comparisons; expected result: {}",
        expected_result
    );

    Example {
        program,
        inputs: ProgramInputs::new(&[], &[value], vec![]).unwrap(),
        pub_inputs: vec![],
        expected_result: vec![expected_result & 1, expected_result],
        num_outputs: 2,
    }
}

// EXAMPLE TESTER
// ================================================================================================

#[test]
fn test_comparison_example() {
    let example = get_example(10);
    super::test_example(example, false);
}

#[test]
fn test_comparison_example_fail() {
    let example = get_example(10);
    super::test_example(example, true);
}