use miden_stdlib::StdLibrary;
use miden_vm::{Assembler, Kernel, Program, ProgramInfo};

pub struct MidenProgram {
    pub assembler: Assembler,
    pub masm_code: String,
    pub debug: bool,
    pub program: Option<Program>,
    pub program_info: Option<ProgramInfo>,
}

pub const DEBUG_OFF: bool = false;
pub const DEBUG_ON: bool = true;

impl MidenProgram {
    pub fn new(code_as_str: &str, debug: bool) -> Self {
        Self {
            assembler: Assembler::default(),
            masm_code: code_as_str.to_string(),
            debug,
            program: None,
            program_info: None,
        }
    }

    pub fn compile_program(&mut self) -> Result<(), String> {
        self.assembler = Assembler::default()
            .with_library(&StdLibrary::default())
            .map_err(|err| format!("Failed to load stdlib - {}", err))?
            .with_debug_mode(self.debug);

        self.program = Some(
            self.assembler
                .compile(&self.masm_code)
                .map_err(|err| format!("Failed to compile program - {}", err))?,
        );

        self.program_info = Some(ProgramInfo::new(
            self.program
                .clone()
                .expect("Could not compile program")
                .hash(),
            Kernel::default(),
        ));

        Ok(())
    }
}
