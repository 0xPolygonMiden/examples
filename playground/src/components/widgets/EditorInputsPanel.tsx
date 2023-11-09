import { useCallback, useEffect, useRef, useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import Widget from "../Widget";
import useTheme from "../../hooks/useTheme";
import useFileManager from "../../hooks/useFileManager";
import { usePlayground } from "../../hooks/usePlayground";
import JsonView from "@uiw/react-json-view";

const example = {
    string: "Hello World",
    integer: 42,
    float: 3.14159,
    date: new Date(),
    boolean: true,
    array: [1, 2, 3],
    object: {
        foo: "bar"
    },
    null: null
};


const editorOptions = {
    foldGutter: true,
    highlightActiveLineGutter: true,
    dropCursor: true,
    allowMultipleSelections: false,
    indentOnInput: false,
    lineNumbers: true,
    syntaxHighlighting: true,
    bracketMatching: true,
    autocompletion: true,
    highlightActiveLine: true,
    mode: 'javascript'
};


const formatJSON = (json: any) => {
    /* returns a string with each element in a single line and indent with 4 spaces per child */
    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 4);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let formatted = '';
    let indent = '';
    let lastChar = '';
    for (let i = 0; i < json.length; i += 1) {
        const char = json[i];
        if (char === '}' || char === ']') {
            indent = indent.substring(0, indent.length - 4);
            formatted += `\n${indent}${char}`;
            lastChar = char;
        } else if (char === '{' || char === '[') {
            if (lastChar === '}' || lastChar === ']') {
                formatted += `\n${indent}${char}`;
            } else {
                formatted += char;
            }
            indent += '    ';
        } else if (char === ',') {
            formatted += `${char}\n${indent}`;
        } else {
            formatted += char;
        }
        lastChar = char;
    }
    //remove empty lines
    formatted = formatted.replace(/^\s*[\r\n]/gm, '');
    return formatted;
};

const EditorInputsPanel = () => {
    const [ code, setCode ] = useState({});
    const [ tmpCode, setTmpCode ] = useState("{}"); 
    const [ enableEdit, setEnableEdit ] = useState(false);
    const { theme } = useTheme();
    const {
        open: fileManagerOpen,
        save,
        load
    } = useFileManager();
    const {
        setInputs,
        inputs
    } = usePlayground();

    useEffect(() => {
        if(inputs){
            setCode(JSON.parse(inputs));
        }
    }, [inputs]);

    useEffect(() => {
        if(code) {
            setTmpCode(formatJSON(code));
        }
    }, [code]);

    
    const handleSave = useCallback(async (path: string) => {
        await save(path, inputs);
    }, [save, inputs]);

    const handleLoad = useCallback(async (path: string) => {
        try {
            const inputs = JSON.parse(await load(path))
            setInputs(inputs);
        } catch(e) {
            alert('Invalid JSON')
        }
    }, [load, setInputs]);

    if(!fileManagerOpen
        || !save
        || !load
        || !code
    ) return (<div>loading...</div>);




    const handleSaveClick = () => {
        fileManagerOpen({
            title: "Save file",
            okText: "Save",
            cancelText: "Cancel",
            onOk: handleSave,
        });
    }

    const handleLoadClick = () => {
        const fm = fileManagerOpen({
            title: "Load file",
            okText: "Load",
            cancelText: "Cancel",
            onOk: handleLoad,
        });
    }

    return <>
        <Widget collapsible={true} collapsed={true}>
        <Widget.Header name="Inputs">
                <div className="panel">
                    <button type="button" className="fas fa-save" onClick={handleSaveClick} />
                    <button type="button"  className="fas fa-folder-open" onClick={handleLoadClick} />
                </div>
            </Widget.Header>
            <Widget.Body style={{display: "block"}}>
                { enableEdit 
                ?<CodeMirror
                    value={tmpCode}
                    height="100%"
                    basicSetup={editorOptions}
                    onChange={(value:any) => {
                        setTmpCode(value);
                    }}
                />
                :<JsonView 
                    value={code}
                    enableClipboard={false} 
                    displayObjectSize={false}
                    displayDataTypes={false}
                    indentWidth={2}                    
                />}
                <button 
                    type="button" 
                    className={
                        enableEdit 
                        ?"fas fa-list"
                        :"fas fa-pen-to-square"
                    }
                    onClick={() => {
                        try {
                            setCode(JSON.parse(tmpCode));
                            setEnableEdit(!enableEdit)
                        } catch(e) {
                            alert('Invalid JSON')
                        }
                    }}
                    style={{position: 'sticky', bottom: '10px', right:'10px'}}
                ></button>
            </Widget.Body>
        </Widget>
    </>
}

export default EditorInputsPanel;