use clap::Parser;
use miden_vm::{
    AdviceInputs, Assembler, Kernel, MemAdviceProvider, ProgramInfo, ProofOptions, StackInputs,
};
use std::fs;
use std::time::Instant;

#[derive(serde::Deserialize, serde::Serialize)]
pub struct InputFile {
    pub operand_stack: Vec<String>,
    pub advice_stack: Option<Vec<String>>,
}

// Parse operand_stack vector of strings to a vector of u64
fn parse_advice_provider(advice_input_file: &InputFile) -> Result<MemAdviceProvider, String> {
    let tape = advice_input_file
        .advice_stack
        .as_ref()
        .map(Vec::as_slice)
        .unwrap_or(&[])
        .iter()
        .map(|v| v.parse::<u64>().map_err(|e| e.to_string()))
        .collect::<Result<Vec<_>, _>>()?;
    let advice_inputs = AdviceInputs::default()
        .with_stack_values(tape)
        .map_err(|e| e.to_string())?;
    Ok(MemAdviceProvider::from(advice_inputs))
}

// Parse advice_stack vector of strings to a vector of u64
fn parse_stack_inputs(stack_input_file: &InputFile) -> Result<StackInputs, String> {
    let stack_inputs = stack_input_file
        .operand_stack
        .iter()
        .map(|v| v.parse::<u64>().map_err(|e| e.to_string()))
        .collect::<Result<Vec<_>, _>>()?;

    StackInputs::try_from_values(stack_inputs).map_err(|e| e.to_string())
}

#[derive(Parser)]
#[clap(
    author = "Polygon Miden",
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

    // let's read the input files
    let input_string = fs::read_to_string(format!("../examples/{}.inputs", &args.example))
        .map_err(|err| format!("Failed to open input file `{}` - {}", &args.example, err))?;
    let inputs_des: InputFile = serde_json::from_str(&input_string)
        .map_err(|err| format!("Failed to deserialize input data - {}", err))
        .unwrap();

    let advice_provider = parse_advice_provider(&inputs_des).unwrap();
    let stack_input = parse_stack_inputs(&inputs_des).unwrap();

    // Compilation time
    let now = Instant::now();
    let assembler = Assembler::default();
    let program = assembler
        .compile(&program_string)
        .expect("Could not compile source");

    println! {"Compilation Time (cold): {} ms", now.elapsed().as_millis()}

    let program_hash = program.hash();
    let kernel = Kernel::default();
    let program_info = ProgramInfo::new(program_hash, kernel);

    let now = Instant::now();
    let _program2 = assembler
        .compile(&program_string)
        .expect("Could not compile source");

    println! {"Compilation Time (hot): {} ms", now.elapsed().as_millis()}

    let stack_input_cloned = stack_input.clone();
    let advice_provider_cloned = advice_provider.clone();

    // Execution time
    let now = Instant::now();
    let trace = miden_vm::execute(&program, stack_input_cloned, advice_provider_cloned)
        .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
        .unwrap();

    println! {"Execution Time: {} steps in {} ms", trace.get_trace_len(), now.elapsed().as_millis()}

    // Proving time
    let proof_options = if args.security == "high" {
        ProofOptions::with_128_bit_security()
    } else {
        ProofOptions::with_96_bit_security()
    };

    // let's clone the stack_input and advice_provider
    // because they are moved into the closure
    let stack_input_cloned = stack_input.clone();
    let advice_provider_cloned = advice_provider.clone();

    let now = Instant::now();
    let (output, proof) = miden_vm::prove(
        &program,
        stack_input_cloned,
        advice_provider_cloned,
        proof_options,
    )
    .expect("Proving failed");

    println! {"Proving Time: {} ms", now.elapsed().as_millis()}

    // let's clone the stack_input and output
    // because they are moved into the closure
    let stack_input_cloned = stack_input.clone();
    let output_cloned = output.clone();

    // Verification time
    let now = Instant::now();
    miden_vm::verify(program_info, stack_input_cloned, output_cloned, proof)
        .map_err(|err| format!("Program failed verification! - {}", err))?;

    println! {"Verification Time: {} ms", now.elapsed().as_millis()}

    // We return the stack as defined by the user
    println! {"Result: {:?}", output.stack_truncated(args.output)};

    Ok(())
}
