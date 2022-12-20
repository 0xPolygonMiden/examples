use clap::Parser;
use miden::{Assembler, ProgramInputs, ProofOptions};
use winter_math::StarkField;
use std::fs;
use std::time::Instant;

#[derive(serde::Deserialize, serde::Serialize)]
pub struct InputFile {
    pub stack_init: Vec<String>,
    pub advice_tape: Option<Vec<String>>,
}

// Creates a `ProgramInputs` struct for Miden VM from the specified inputs.
// ToDo: we should allow other types of advice inputs as well. We'll want to make the same update to the playground as well.
fn get_program_inputs(stack_init: &[u64], advice_tape: &[u64]) -> ProgramInputs {
    ProgramInputs::new(stack_init, advice_tape, Vec::new()).unwrap()
}

// Parse stack_init vector of strings to a vector of u64
fn get_stack_init(inputs: &InputFile) -> Vec<u64> {
    inputs
        .stack_init
        .iter()
        .map(|v| v.parse::<u64>().unwrap())
        .collect::<Vec<u64>>()
}

// Parse advice_tape vector of strings to a vector of u64
fn get_advice_tape(inputs: &InputFile) -> Vec<u64> {
    inputs
        .advice_tape
        .as_ref()
        .unwrap_or(&vec![])
        .iter()
        .map(|v| v.parse::<u64>().unwrap())
        .collect::<Vec<u64>>()
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

    // let's read the input fils
    let input_string = fs::read_to_string(format!("../examples/{}.inputs", &args.example))
        .map_err(|err| format!("Failed to open input file `{}` - {}", &args.example, err))?;
    let inputs_des: InputFile = serde_json::from_str(&input_string)
        .map_err(|err| format!("Failed to deserialize input data - {}", err))
        .unwrap();

    let stack_init = get_stack_init(&inputs_des);
    let advice_tape = get_advice_tape(&inputs_des);

    let inputs = get_program_inputs(&stack_init, &advice_tape);

    // Compilation time
    let now = Instant::now();
    let assembler = Assembler::new();
    let program = assembler
        .compile(&program_string)
        .expect("Could not compile source");

    println! {"Compilation Time (cold): {} ms", now.elapsed().as_millis()}

    let now = Instant::now();
    let _program2 = assembler
        .compile(&program_string)
        .expect("Could not compile source");

    println! {"Compilation Time (hot): {} ms", now.elapsed().as_millis()}

    // Execution time
    let now = Instant::now();
    miden::execute(&program, &inputs)
        .map_err(|err| {
            format!(
                "Failed to generate exection trace = {:?}, and advice_tape = {:?}",
                err, advice_tape
            )
        })
        .unwrap();

    println! {"Execution Time: {} ms", now.elapsed().as_millis()}

    // Proving time
    let proof_options = if args.security == "high" {
        ProofOptions::with_128_bit_security()
    } else {
        ProofOptions::with_96_bit_security()
    };

    let now = Instant::now();
    let (output, proof) = miden::prove(&program, &inputs, &proof_options).expect("Proving failed");

    println! {"Proving Time: {} ms", now.elapsed().as_millis()}

    // Verification time
    let program_input_u64 = inputs
        .stack_init()
        .iter()
        .map(|x| x.as_int())
        .collect::<Vec<u64>>();

    let now = Instant::now();
    miden::verify(program.hash(), &program_input_u64, &output, proof)
        .map_err(|err| format!("Program failed verification! - {}", err))?;
    println! {"Verification Time: {} ms", now.elapsed().as_millis()}

    // We return the stack as defined by the user
    println! {"Result: {:?}", output.stack_outputs(args.output)};

    Ok(())
}
