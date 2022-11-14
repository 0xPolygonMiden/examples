use miden::{Assembler, ProgramInputs, ProofOptions};
use wasm_bindgen::prelude::*;
use wasm_bindgen_test::*;
extern crate console_error_panic_hook;


/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
pub struct InputFile {
    pub stack_init: Vec<String>,
    pub advice_tape: Option<Vec<String>>,
}

fn get_program_inputs(stack_init: &[u64], advice_tape: &[u64]) -> ProgramInputs {
    ProgramInputs::new(&stack_init, &advice_tape, Vec::new()).unwrap()
}

/// Parse stack_init vector of strings to a vector of u64
fn stack_init(inputs_des: &InputFile) -> Vec<u64> {
    inputs_des.stack_init
        .iter()
        .map(|v| v.parse::<u64>().unwrap())
        .collect::<Vec<u64>>()
}

fn advice_tape(inputs_des: &InputFile) -> Vec<u64> {
    inputs_des.advice_tape
        .as_ref()
        .unwrap_or(&vec![])
        .iter()
        .map(|v| v.parse::<u64>().unwrap())
        .collect::<Vec<u64>>()
}


#[wasm_bindgen]
pub fn program(asm: &str, inputs_frontend: &str, output_count: u16) -> Vec<u64> {
    console_error_panic_hook::set_once();
    wasm_logger::init(wasm_logger::Config::default());
    log::info!("adad");


    let assembler = Assembler::new();
    let program = assembler.compile(&asm).expect("Could not compile source");
    
    let inputs_des: InputFile = serde_json::from_str(&inputs_frontend)
    .map_err(|err| format!("Failed to deserialize input data - {}", err)).unwrap();
    
    let stack_init = stack_init(&inputs_des);
    let advice_tape = advice_tape(&inputs_des);
    let inputs = get_program_inputs(&stack_init, &advice_tape); 

    // we might want to prove a program later and not only execute it
    //let options = ProofOptions::new(
    //    32,
    //    8,
    //    0,
    //    miden::HashFunction::Blake3_256,
    //    miden::FieldExtension::None,
    //    8,
    //    256,
    //);
    //println!{"AdviceTape: {:?}", advice_tape};

    let trace = miden::execute(
        &program,
        &inputs,
    )
    .map_err(|err| format!("Failed to generate exection trace = {:?}, and advice_tape = {:?}", err, advice_tape)).unwrap();
    
    // TODO: Investigate why proof verification fails when outputCount > 1
    //assert!(miden::verify(*program.hash(), &[], &outputs, proof).is_ok());
    trace.program_outputs().stack_outputs(output_count as usize).to_vec()
}

#[wasm_bindgen_test]
fn run_program() {
    let output = program(
        "begin
            push.1 push.2 add
        end",
        "",
        1,
    );
    assert_eq!(output[0], 3)
}
