mod expected_test_proof;
use miden_vm::math::StarkField;
use miden_vm::{
    math::{Felt, FieldElement},
    AdviceInputs, Assembler, ExecutionProof, Kernel, MemAdviceProvider, ProgramInfo, ProofOptions,
    StackInputs, StackOutputs, VmState, VmStateIterator,
};
use wasm_bindgen::prelude::*;
extern crate console_error_panic_hook;

/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
pub struct InputFile {
    pub stack_init: Option<Vec<String>>,
    pub advice_tape: Option<Vec<String>>,
}

#[wasm_bindgen(getter_with_clone)]
#[derive(serde::Deserialize, serde::Serialize)]
pub struct Outputs {
    pub stack_output: Vec<u64>,
    pub trace_len: Option<usize>,
    pub overflow_addrs: Option<Vec<u64>>,
    pub proof: Option<Vec<u8>>,
}

// Parse stack_init vector of strings to a vector of u64
fn parse_advice_provider(advice_input_file: &InputFile) -> Result<MemAdviceProvider, String> {
    let tape = advice_input_file
        .advice_tape
        .as_ref()
        .map(Vec::as_slice)
        .unwrap_or(&[])
        .iter()
        .map(|v| v.parse::<u64>().map_err(|e| e.to_string()))
        .collect::<Result<Vec<_>, _>>()?;
    let advice_inputs = AdviceInputs::default()
        .with_tape_values(tape)
        .map_err(|e| e.to_string())?;
    Ok(MemAdviceProvider::from(advice_inputs))
}

// Parse advice_tape vector of strings to a vector of u64
fn parse_stack_inputs(stack_input_file: &InputFile) -> Result<StackInputs, String> {
    let stack_inputs = stack_input_file
        .stack_init
        .as_ref()
        .map(Vec::as_slice)
        .unwrap_or(&[])
        .iter()
        .map(|v| v.parse::<u64>().map_err(|e| e.to_string()))
        .collect::<Result<Vec<_>, _>>()?;

    StackInputs::try_from_values(stack_inputs).map_err(|e| e.to_string())
}

// Parse the outputs as str and return a vector of u64
fn parse_str_to_outputs(input: &str) -> Result<Outputs, String> {
    let input: Outputs = serde_json::from_str(&input)
        .map_err(|err| format!("Failed to deserialize Outputs - {}", err))
        .unwrap();

    Ok(input)
}

/// Runs the Miden VM with the given inputs
#[wasm_bindgen]
pub fn run_program(asm: &str, inputs_frontend: &str) -> Outputs {
    console_error_panic_hook::set_once();

    let assembler = Assembler::default();
    let program = assembler.compile(&asm).expect("Could not compile source");

    let mut stack_input = StackInputs::new(vec![Felt::ZERO]);
    let mut advice_provider = MemAdviceProvider::default();

    if inputs_frontend.trim().is_empty() == false {
        let inputs_des: InputFile = serde_json::from_str(&inputs_frontend)
            .map_err(|err| format!("Failed to deserialize input data - {}", err))
            .unwrap();

        stack_input = parse_stack_inputs(&inputs_des).unwrap();
        advice_provider = parse_advice_provider(&inputs_des).unwrap();
    }

    let trace = miden_vm::execute(&program, stack_input, advice_provider)
        .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
        .unwrap();

    let result = Outputs {
        stack_output: trace.stack_outputs().stack().to_vec(),
        trace_len: Some(trace.get_trace_len()),
        overflow_addrs: None,
        proof: None,
    };

    result
}

/// Proves the program with the given inputs
#[wasm_bindgen]
pub fn prove_program(asm: &str, inputs_frontend: &str) -> Outputs {
    console_error_panic_hook::set_once();

    let assembler = Assembler::default();
    let program = assembler.compile(&asm).expect("Could not compile source");

    let mut stack_input = StackInputs::new(vec![Felt::ZERO]);
    let mut advice_provider = MemAdviceProvider::default();

    if inputs_frontend.trim().is_empty() == false {
        let inputs_des: InputFile = serde_json::from_str(&inputs_frontend)
            .map_err(|err| format!("Failed to deserialize input data - {}", err))
            .unwrap();

        stack_input = parse_stack_inputs(&inputs_des).unwrap();
        advice_provider = parse_advice_provider(&inputs_des).unwrap();
    }

    // default (96 bits of security)
    let proof_options = ProofOptions::with_96_bit_security();

    let stack_input_cloned = stack_input.clone();
    let (output, proof) =
        miden_vm::prove(&program, stack_input_cloned, advice_provider, proof_options)
            .map_err(|err| format!("Failed to generate exection trace = {:?}", err))
            .unwrap();

    let result = Outputs {
        stack_output: output.stack().to_vec(),
        trace_len: Some(proof.stark_proof().trace_length()),
        overflow_addrs: Some(output.overflow_addrs().to_vec()),
        proof: Some(proof.to_bytes()),
    };

    let program_info = ProgramInfo::new(program.hash(), Kernel::default());

    miden_vm::verify(program_info, stack_input, output, proof)
        .map_err(|err| format!("Failed to verify proof at test verification = {:?}", err))
        .unwrap();

    result
}

// Debugging the program

#[wasm_bindgen]
pub struct DebugExecutor {
    vm_state_iter: VmStateIterator,
    vm_state: VmState,
}

#[wasm_bindgen]
pub enum DebugCommand {
    PlayAll,
    Play,
    RewindAll,
    Rewind,
    PrintState,
    PrintStack,
    PrintMem,
    PrintMemAddress,
    Clock,
}

#[wasm_bindgen]
impl DebugExecutor {
    // CONSTRUCTOR
    // --------------------------------------------------------------------------------------------
    /// Returns a new DebugExecutor for the specified program, inputs and advice provider.
    ///
    /// # Errors
    /// Returns an error if the command cannot be parsed.
    #[wasm_bindgen(constructor)]
    pub fn new(program: &str, inputs_frontend: &str) -> Result<DebugExecutor, String> {
        // Parse inputs
        console_error_panic_hook::set_once();

        let assembler = Assembler::default();
        let program = assembler
            .compile(&program)
            .expect("Could not compile source");

        let mut stack_input = StackInputs::new(vec![Felt::ZERO]);
        let mut advice_provider = MemAdviceProvider::default();

        if inputs_frontend.trim().is_empty() == false {
            let inputs_des: InputFile = serde_json::from_str(&inputs_frontend)
                .map_err(|err| format!("Failed to deserialize input data - {}", err))
                .unwrap();

            stack_input = parse_stack_inputs(&inputs_des).unwrap();
            advice_provider = parse_advice_provider(&inputs_des).unwrap();
        }

        let mut vm_state_iter = miden_vm::execute_iter(&program, stack_input, advice_provider);
        let vm_state = vm_state_iter
            .next()
            .ok_or(format!(
                "Failed to instantiate DebugExecutor - `VmStateIterator` is not yielding!"
            ))?
            .expect("initial state of vm must be healthy!");

        Ok(Self {
            vm_state_iter,
            vm_state,
        })
    }

    // MODIFIERS
    // --------------------------------------------------------------------------------------------

    /// executes a debug command against the vm in it's current state.
    pub fn execute(&mut self, command: DebugCommand, param: Option<u64>) -> String {
        match command {
            //DebugCommand::PlayAll
            DebugCommand::PlayAll => {
                while let Some(new_vm_state) = self.next_vm_state() {
                    self.vm_state = new_vm_state;
                }
                self.print_vm_state()
            }
            //DebugCommand::Play(cycles)
            DebugCommand::Play => {
                for _cycle in 0..param.unwrap() {
                    match self.next_vm_state() {
                        Some(next_vm_state) => {
                            self.vm_state = next_vm_state;
                        }
                        None => break,
                    }
                }
                self.print_vm_state()
            }
            //DebugCommand::RewindAll
            DebugCommand::RewindAll => {
                while let Some(new_vm_state) = self.prev_vm_state() {
                    self.vm_state = new_vm_state;
                }
                self.print_vm_state()
            }
            //DebugCommand::Rewind(cycles)
            DebugCommand::Rewind => {
                for _cycle in 0..param.unwrap() {
                    match self.prev_vm_state() {
                        Some(new_vm_state) => {
                            self.vm_state = new_vm_state;
                        }
                        None => break,
                    }
                }
                self.print_vm_state()
            }
            //DebugCommand::PrintState
            DebugCommand::PrintState => self.print_vm_state(),
            //DebugCommand::PrintStack
            DebugCommand::PrintStack => self.print_stack(),
            //DebugCommand::PrintMem
            DebugCommand::PrintMem => self.print_memory(),
            //DebugCommand::PrintMemAddress(address)
            DebugCommand::PrintMemAddress => self.print_memory_entry(param.unwrap()),
            //DebugCommand::Clock
            DebugCommand::Clock => format!("{}", self.vm_state.clk),
        }
    }

    /// iterates to the next clock cycle.
    fn next_vm_state(&mut self) -> Option<VmState> {
        match self.vm_state_iter.next() {
            Some(Ok(vm_state)) => Some(vm_state),
            Some(Err(err)) => {
                println!("Execution error: {err:?}");
                None
            }
            None => {
                println!("Program execution complete.");
                None
            }
        }
    }

    /// iterates to the previous clock cycle.
    fn prev_vm_state(&mut self) -> Option<VmState> {
        match self.vm_state_iter.next_back() {
            Some(prev_vm_state_result) => prev_vm_state_result.ok(),
            None => None,
        }
    }

    // ACCESSORS
    // --------------------------------------------------------------------------------------------

    /// print general VM state information.
    pub fn print_vm_state(&self) -> String {
        format!("{}", self.vm_state)
    }

    /// print all stack items.
    pub fn print_stack(&self) -> String {
        let mut res =
            self.vm_state
                .stack
                .iter()
                .enumerate()
                .fold(String::new(), |mut s, (i, f)| {
                    s.push_str(&format!("[{i}] {f}\n"));
                    s
                });
        res.pop(); // removes unnecessary line-break
        res
    }

    /// print all memory entries.
    pub fn print_memory(&self) -> String {
        let mem_result = String::new();
        for (address, mem) in self.vm_state.memory.iter() {
            format!("{}{}", mem_result, Self::print_memory_data(address, mem));
        }
        return mem_result;
    }

    /// print specified memory entry.
    pub fn print_memory_entry(&self, address: u64) -> String {
        let entry = self
            .vm_state
            .memory
            .iter()
            .find_map(|(addr, mem)| match address == *addr {
                true => Some(mem),
                false => None,
            });

        match entry {
            Some(mem) => Self::print_memory_data(&address, mem),
            None => format!("memory at address '{address}' not found"),
        }
    }

    // HELPERS
    // --------------------------------------------------------------------------------------------

    /// print memory data.
    fn print_memory_data(address: &u64, memory: &[Felt]) -> String {
        let mem_int = memory.iter().map(|&x| x.as_int()).collect::<Vec<_>>();
        return format!("{address} {mem_int:?}");
    }
}

/// Verifies the proof with the given inputs
#[wasm_bindgen]
pub fn verify_program(asm: &str, inputs_str: &str, outputs_str: &str, proof: Vec<u8>) -> u32 {
    console_error_panic_hook::set_once();

    // we need to get the program info from the program
    let assembler = Assembler::default();
    let program = assembler.compile(&asm).expect("Could not compile source");
    let program_info = ProgramInfo::new(program.hash(), Kernel::default());

    let proof = ExecutionProof::from_bytes(&proof)
        .map_err(|err| format!("Failed to deserialize proof - {}", err))
        .unwrap();

    // we don't need the advice provider for verification
    let mut stack_input = StackInputs::new([Felt::ZERO; 1].to_vec());
    if inputs_str.trim().is_empty() == false {
        let inputs_des: InputFile = serde_json::from_str(&inputs_str)
            .map_err(|err| format!("Failed to deserialize Inputs - {}", err))
            .unwrap();

        stack_input = parse_stack_inputs(&inputs_des).unwrap();
    }

    // we need to parse the Outputs from the frontend
    let outputs_json: Outputs = parse_str_to_outputs(&outputs_str).unwrap();

    let outputs = StackOutputs::new(
        outputs_json.stack_output,
        outputs_json.overflow_addrs.unwrap_or(vec![]),
    );

    let result: u32 = miden_vm::verify(program_info, stack_input, outputs, proof)
        .map_err(|err| format!("Program failed verification! - {}", err))
        .unwrap();

    result
}

/// Basic tests for the Rust part
/// Tests are run with `cargo test`
#[test]
fn test_run_program() {
    let output = run_program(
        "begin
            push.1 push.2 add
        end",
        "",
    );
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(1024));
}

#[test]
fn test_debug_program() {
    let mut debug_executor = DebugExecutor::new(
        "begin
            push.1 push.2 add
        end",
        "",
    )
    .unwrap();
    let output = debug_executor.execute(DebugCommand::PlayAll, None);

    // we test if it plays all the way to the end
    assert_eq!(
        output,
        concat!(
            "clk=6, op=Some(End), asmop=None, fmp=1073741824, ",
            "stack=[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    let mut debug_executor_2 = DebugExecutor::new(
        "begin
            push.1 push.2 add
        end",
        "",
    )
    .unwrap();

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=1, op=Some(Span), asmop=None, fmp=1073741824, ",
            "stack=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=2, op=Some(Pad), asmop=None, fmp=1073741824, ",
            "stack=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=3, op=Some(Incr), asmop=None, fmp=1073741824, ",
            "stack=[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=4, op=Some(Push(BaseElement(8589934590))), asmop=None, ",
            "fmp=1073741824, stack=[2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=5, op=Some(Add), asmop=None, fmp=1073741824, ",
            "stack=[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // we test playing one more cycle
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=6, op=Some(End), asmop=None, fmp=1073741824, ",
            "stack=[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );

    // it should not play more cycles
    let output = debug_executor_2.execute(DebugCommand::Play, Some(1));
    assert_eq!(
        output,
        concat!(
            "clk=6, op=Some(End), asmop=None, fmp=1073741824, ",
            "stack=[3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], memory=[]"
        )
    );
}

#[test]
fn test_prove_program() {
    let output = prove_program(
        "begin
            push.1 push.2 add
        end",
        "",
    );
    // this is the result of the stack output, 3
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.trace_len, Some(1024));

    // for the proof we have [0, 1] as overflow_addrs
    assert_eq!(output.overflow_addrs.is_some(), true);
    assert_eq!(output.overflow_addrs, Some(vec![0, 1]));

    // we expect a proof of []
    assert_eq!(output.proof.is_some(), true);
    assert_eq!(
        output.proof,
        Some(expected_test_proof::EXPECTED_PROOF_BYTES.to_vec())
    );
}

#[test]
fn test_parse_output() {
    let output_str: &str = r#"
    {
        "stack_output": [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "overflow_addrs": [0, 1],
        "trace_len": 1024
    }"#;

    let output: Outputs = parse_str_to_outputs(&output_str).unwrap();
    assert_eq!(
        output.stack_output,
        vec![3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assert_eq!(output.overflow_addrs, Some(vec![0, 1]));
}

#[test]
fn test_verify_program() {
    let asm: &str = "begin
        push.1 push.2 add
    end";

    let input_str: &str = r#"
    {
        "stack_init": ["0"],
        "advice_tape": ["0"]
    }"#;

    let output_str: &str = r#"
    {
        "stack_output": [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "overflow_addrs": [0, 1],
        "trace_len": 1024
    }"#;

    let proof = expected_test_proof::EXPECTED_PROOF_BYTES.to_vec();

    let result = verify_program(asm, input_str, output_str, proof);

    assert_eq!(result, 96);
}
