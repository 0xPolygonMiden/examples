mod utils_input;
mod utils_program;
use clap::Parser;
use miden_vm::{ProvingOptions, DefaultHost, MemAdviceProvider};
use miden_air::ExecutionOptions;
use std::fs;
use std::time::Instant;

#[derive(Parser)]
#[clap(
    author = "Miden",
    version,
    about = "A very simple benchmarking CLI for Miden examples"
)]

struct Cli {
    #[arg(
        short,
        long,
        help("Provide example name as in ../examples"),
        required(true)
    )]
    example: String,

    #[arg(
        short,
        long,
        help("Set to 'high' if 128-bit is needed"),
        default_value("")
    )]
    security: String,

    #[arg(
        short,
        long,
        help("Set the number of desired stack outputs"),
        default_value("1")
    )]
    output: usize,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // The CLI should take a path to the example directory as input, execute/prove the example, and output the following metrics:

    // Cold compilation time (i.e., when the example is compiled with a new assembler).
    // Hot compilation time (i.e., when the example is compiled with an assembler which was already used to compile the same code).
    // Execution time.
    // Proving time.
    // Verification time.

    println!("============================================================");
    println!("Benchmarking Miden examples");
    println!("============================================================");

    let args = Cli::parse();

    // let's read the program
    let program_string = fs::read_to_string(format!("../examples/{}.masm", &args.example))?;

    let input_string = fs::read_to_string(format!("../examples/{}.inputs", &args.example))?;
    let mut inputs = utils_input::Inputs::new();
    inputs
        .deserialize_inputs(input_string.as_str())
        .map_err(|err| format!("Failed to deserialize inputs - {:?}", err))?;

    // Compilation time
    let now = Instant::now();
    let mut program = utils_program::MidenProgram::new(program_string.as_str());
    program
        .compile_program()
        .map_err(|err| format!("Failed to compile program - {:?}", err))?;

    println! {"Compilation Time (cold): {} ms", now.elapsed().as_millis()}

    let program_to_run = program.program.clone().unwrap();

    let host = DefaultHost::new(MemAdviceProvider::from(inputs.advice_provider.clone()));
    
    let execution_options = ExecutionOptions::new(None, 64)
    .map_err(|err| format!("{err}"))?;

    // Execution time
    let now = Instant::now();
    let trace = miden_vm::execute(
        &program_to_run,
        inputs.stack_inputs.clone(),
        host,
        execution_options,
    )
    .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
    .unwrap();

    println! {"Execution Time: {} steps in {} ms", trace.get_trace_len(), now.elapsed().as_millis()}

    // Proving time
    let proof_options = if args.security == "high" {
        ProvingOptions::with_128_bit_security(false)
    } else {
        ProvingOptions::with_96_bit_security(false)
    };

    let host = DefaultHost::new(MemAdviceProvider::from(inputs.advice_provider));

    let now = Instant::now();
    let (output, proof) = miden_vm::prove(
        &program.program.unwrap(),
        inputs.stack_inputs.clone(),
        host,
        proof_options,
    )
    .expect("Proving failed");

    println! {"Proving Time: {} ms", now.elapsed().as_millis()}

    // Verification time
    let program_info = program.program_info.unwrap();

    let now = Instant::now();
    miden_vm::verify(program_info, inputs.stack_inputs, output.clone(), proof)
        .map_err(|err| format!("Program failed verification! - {}", err))?;

    println! {"Verification Time: {} ms", now.elapsed().as_millis()}

    // We return the stack as defined by the user
    println! {"Result: {:?}", output.stack_truncated(args.output)};

    Ok(())
}
