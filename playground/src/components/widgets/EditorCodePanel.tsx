import { useCallback, useState, MouseEvent } from "react";
import CodeMirror from '@uiw/react-codemirror';
import DebuggerPanel from "./DebuggerPanel";
import useTheme from "../../hooks/useTheme";
import usePlayground from "../../hooks/usePlayground";
import useFileManager from "../../hooks/useFileManager";
import Widget from "../Widget";
import Modal from "../Modal";
import useDebugger from "../../hooks/useDebugger";


const EditorCodePanel = () => {
    const [ expanded, setExpanded ] = useState(false);
    const [ showDebugger, setShowDebugger ] = useState(false);
    const { theme } = useTheme();
    const {
        open: fileManagerOpen,
        save,
        load,
    } = useFileManager();
    const {
        reset,
        setCode,
        code,
        isDebugging,
        debug,
        run,
        error,
        isRunning
    } = usePlayground();

    const handleSave = useCallback(async (path: string) => {
        await save(path, code);
    }, [save, code]);

    const handleLoad = useCallback(async (path: string) => {
        const code = await load(path);
        setCode(code);
    }, [load, setCode]);
    

    if(!fileManagerOpen) return (<div>loading...</div>);
    if(!save) return (<div>loading...</div>);
    if(!load) return (<div>loading...</div>);


    const handleSaveClick = () => {
        fileManagerOpen({
            title: "Save file",
            okText: "Save",
            cancelText: "Cancel",
            onOk: handleSave
        });
    }

    const handleLoadClick = () => {
        fileManagerOpen({
            title: "Load file",
            okText: "Load",
            cancelText: "Cancel",
            onOk: handleLoad
        });
    }

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

    const handleRunClick = async (e: MouseEvent) => {
        e.preventDefault();
        reset();
        run();
    };


    return <>
        <Widget name="editor" collapsible={true} collapsed={false} expanded={expanded}  >
            <Widget.Header name="Editor">
                <div className="panel" >
                    {/* Save and Load */}
                    <button type="button" className="fas fa-save" onClick={handleSaveClick} />
                    <button type="button" className="fas fa-folder-open" onClick={handleLoadClick} />
                </div>
                <div className="panel">
                    <button id="runbtn" 
                        className={
                            isRunning ? ' running' : '' +
                            error != "" ? ' error' : ''
                        }
                        onClick={handleRunClick}>Run <i className="fas fa-caret-right secondary-color"></i></button>
                    <button
                        id="debugbtn"
                        className={showDebugger?'active':''}
                        onClick={e => setShowDebugger(!showDebugger)}
                    >
                        Debug
                    </button>
                    {expanded
                        ? <button className="fas fa-compress" onClick={() => setExpanded(false)} title="Collapse editor" />
                        : <button className="fas fa-expand" onClick={() => setExpanded(true)} title="Expand editor" />
                    }
                </div>
            </Widget.Header>
            <Widget.Body>
                {showDebugger && <DebuggerPanel />}
                <div id="editor" style={{flexGrow:"1"}}>
                    <CodeMirror
                        value={code}
                        height={expanded?"100%":(window.innerHeight - 500).toString() + "px"}
                        theme={theme === 'dark' ? 'dark' : 'light'}
                        onChange={(value: string) => setCode(value)}
                        basicSetup={editorOptions}
                    />
                </div>
            </Widget.Body>
        </Widget>
        <Modal
            title="Error"
            isOpen={error != ""}
            onClose={() => { reset() }}
            variant="error"
        >
            {error}
        </Modal>
    </>
};

export default EditorCodePanel