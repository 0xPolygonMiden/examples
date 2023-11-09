import React, { createContext, useContext, useState, useEffect } from "react";

interface MidenPlaygroundProviderProps {
    children: React.ReactNode;
}

type MidenPlaygroundContextProps = {
    code: string;
    operandStack: string[];
    adviceStack: string[];
    inputJSON: object;
    moveRustMode: boolean;
    debugMode: boolean;
    setCode: (code: string) => void;
    addOperand: (value: string) => void;
    addAdvice: (value: string) => void;
    setInputJSON: (data: object) => void;
    loadFromFile: (fileContent: string) => void;
    saveToFile: () => void;
    runProgram: () => void;
    switchDebugMode: () => void;
    switchLanguage: (language: string) => void;
    setSyntaxHighlighting: () => void;
    getInstructions: () => string[];
};

export const MidenPlaygroundContext = createContext({} as MidenPlaygroundContextProps);

export const useMidenPlayground = () => {
    return useContext(MidenPlaygroundContext);
};

export const MidenPlaygroundProvider = ({ children }: MidenPlaygroundProviderProps) => {
    const [code, setCode] = useState<string>("");
    const [operandStack, setOperandStack] = useState<string[]>([]);
    const [adviceStack, setAdviceStack] = useState<string[]>([]);
    const [inputJSON, setInputJSON] = useState<object>({});
    const [moveRustMode, setMoveRustMode] = useState<boolean>(false);
    const [debugMode, setDebugMode] = useState<boolean>(false);

    // Load state from LocalStorage on initial render
    useEffect(() => {
        const savedCode = localStorage.getItem("code");
        const savedOperandStack = JSON.parse(localStorage.getItem("operandStack") || "[]");
        const savedAdviceStack = JSON.parse(localStorage.getItem("adviceStack") || "[]");
        const savedInputJSON = JSON.parse(localStorage.getItem("inputJSON") || "{}");
        const savedMoveRustMode = localStorage.getItem("moveRustMode") === "true";
        const savedDebugMode = localStorage.getItem("debugMode") === "true";

        if (savedCode) setCode(savedCode);
        if (savedOperandStack) setOperandStack(savedOperandStack);
        if (savedAdviceStack) setAdviceStack(savedAdviceStack);
        if (savedInputJSON) setInputJSON(savedInputJSON);
        if (savedMoveRustMode) setMoveRustMode(savedMoveRustMode);
        if (savedDebugMode) setDebugMode(savedDebugMode);
    }, []);

    // Update LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem("code", code);
        localStorage.setItem("operandStack", JSON.stringify(operandStack));
        localStorage.setItem("adviceStack", JSON.stringify(adviceStack));
        localStorage.setItem("inputJSON", JSON.stringify(inputJSON));
        localStorage.setItem("moveRustMode", moveRustMode.toString());
        localStorage.setItem("debugMode", debugMode.toString());
    }, [code, operandStack, adviceStack, inputJSON, moveRustMode, debugMode]);

    const addOperand = (value: string) => {
        setOperandStack([...operandStack, value]);
    };

    const addAdvice = (value: string) => {
        setAdviceStack([...adviceStack, value]);
    };

    const setSyntaxHighlighting = () => {
        // Logic to set up syntax highlighting using CodeMirror.
        // Apply syntax highlighting for Miden Assembly if not in Move/Rust mode.
        // Implement this logic as needed.
    };

    const loadFromFile = (fileContent: string) => {
        setCode(fileContent);
    };

    const saveToFile = () => {
        // Implement logic to save code to a file and return the file content if needed.
        // You can return the saved code or perform the save operation as required.
        // For example:
        // const savedCode = code;
        // // Save code logic...
        // return savedCode;
    };

    const runProgram = () => {
        // Logic to execute the program based on state values.
        // Display output and execution information.
        // Show stack output under input line and information next to the code window.
        if (debugMode) {
            // Implement debugging logic here.
        } else {
            // Implement regular execution logic here.
        }
    };

    const switchDebugMode = () => {
        setDebugMode(!debugMode);
        // Logic to switch between debug mode and regular mode.
    };

    const switchLanguage = (language: string) => {
        const isMoveRustMode = language.toLowerCase() === "move" || language.toLowerCase() === "rust";
        setMoveRustMode(isMoveRustMode);
        // Logic to switch between Miden Assembly and Move/Rust languages.
        // Compile to Miden Assembly if in Move/Rust mode.
    };

    const getInstructions = () => {
        // Logic to fetch instructions based on the current code.
        return []; // Return fetched instructions.
    };

    return <MidenPlaygroundContext.Provider
            value={{
                code,
                operandStack,
                adviceStack,
                inputJSON,
                moveRustMode,
                debugMode,
                setCode,
                addOperand,
                addAdvice,
                setInputJSON,
                loadFromFile,
                saveToFile,
                runProgram,
                switchDebugMode,
                switchLanguage,
                setSyntaxHighlighting,
                getInstructions,
            }}
        >
            {children}
        </MidenPlaygroundContext.Provider>
}

export default MidenPlaygroundProvider;