/*


1. Inputs can be entered in different ways:

• A user can enter the operand_stack in a line under the code window (similar to the 8086 compiler

• A user can click on the + symbol to add another line to also enter the advice_stack or secret input the same way

• A user can also enter an input file (or the copy thereof) by first clicking the +-Document symbol. This opens another window right next to the code window. Here the user can input JSON data

2. When a user runs a program, the stack output should be shown under the input line and some information right next to the code window

3. Debugging shows a lot of info right next to the code window. The format could change, let's see what looks best

4. We need another tab to switch to Move / Rust as a secondary language. Move / Rust can then be compiled to Miden Assembly

5. We want to add some syntax highlighting for Miden Assembly. This is possible using CodeMirror

*/

class MidenPlayground {
    private code: string;
    private operandStack: string[];
    private adviceStack: string[];
    private inputJSON: object;
    private moveRustMode: boolean;
    private debugMode: boolean;

    constructor() {
        this.code = '';
        this.operandStack = [];
        this.adviceStack = [];
        this.inputJSON = {};
        this.moveRustMode = false;
        this.debugMode = false;
    }

    setCode(code: string): void {
        this.code = code;
    }

    addOperand(value: string): void {
        this.operandStack.push(value);
    }

    addAdvice(value: string): void {
        this.adviceStack.push(value);
    }

    setInputJSON(data: object): void {
        this.inputJSON = data;
    }

    loadFromFile(fileContent: string): void {
        this.code = fileContent;
    }

    saveToFile(): string {
        // Logic to save code to a file and return the file content.
        return this.code;
    }

    runProgram(): void {
        // Logic to execute the program based on this.code, this.operandStack,
        // this.adviceStack, and this.inputJSON.
        // Display output and execution information.
        // Show stack output under input line and information next to the code window.
        if (this.debugMode) {
            // Implement debugging logic here.
        } else {
            // Implement regular execution logic here.
        }
    }

    switchDebugMode(): void {
        this.debugMode = !this.debugMode;
        // Logic to switch between debug mode and regular mode.
    }

    switchLanguage(language: string): void {
        if (language.toLowerCase() === 'move' || language.toLowerCase() === 'rust') {
            this.moveRustMode = true;
        } else {
            this.moveRustMode = false;
        }
        // Logic to switch between Miden Assembly and Move/Rust languages.
        // Compile to Miden Assembly if in Move/Rust mode.
    }

    setSyntaxHighlighting(): void {
        // Logic to set up syntax highlighting using CodeMirror.
        // Apply syntax highlighting for Miden Assembly if not in Move/Rust mode.
    }

    getInstructions(): string[] {
        // Logic to fetch instructions based on the current code.
        return []; // Return fetched instructions.
    }

    // Additional methods for handling inputs, breakpoints, stepping through code, etc. can be added here.
}

// Example usage:
const playground = new MidenPlayground();
// playground.loadFromFile("..."); // Load code from a file.
// playground.addOperand("..."); // Add operand to operand stack.
// playground.addAdvice("..."); // Add advice to advice stack.
// playground.setInputJSON({ /* JSON data */ }); // Set input data.
// playground.runProgram(); // Execute the program.
// playground.switchLanguage("Move"); // Switch to Move/Rust language.
// playground.setSyntaxHighlighting(); // Set up syntax highlighting.
// const instructions = playground.getInstructions(); // Get instructions for code.
// playground.switchDebugMode(); // Toggle debug mode.
// playground.runProgram(); // Execute the program in debug mode.


export default MidenPlayground;