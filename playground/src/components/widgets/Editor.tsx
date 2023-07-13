import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import Widget from "../Widget";
import { useContext, useEffect, useRef, useState } from "react";
import Debugger from "./Debugger";
import StorageDialog from "../StorageDialog";
import { StorageContext } from "../../contexts/StorageProvider";

type EditorProps = {
    height: string;
    value: string;
    onChange: (value: string) => void;
    theme: ReactCodeMirrorProps["theme"];
};

const Editor = (props: EditorProps) => {
    const [expanded, setExpanded] = useState(false);
    const [codeMirrorHeight, setCodeMirrorHeight] = useState("100%");
    const [isDebugging, setIsDebugging] = useState(false);
    const [showStorageDialog, setShowStorageDialog] = useState(false);
    const [filename, setFilename] = useState("");
    const [content, setContent] = useState(props.value);
    const {save, load} = useContext(StorageContext);
    const editorRef = useRef(null);

    const handleDebugClick = () => {
        //TODO - add debugging functionality

        setIsDebugging(!isDebugging);
    }

    const handleClickSave = () => {
        if(filename === "") {
            setShowStorageDialog(true);
        } else {
            const status = save(filename, props.value);
        }
    }

    const handleClickLoad = () => {
        setShowStorageDialog(true);
    }


    return <>
        <StorageDialog filter={{
                type: "application/wasm",
            }} 
            show={showStorageDialog}
            filename={filename}
            onLoad={(filename: string) => {
                const value = load(filename);
                if(value) {
                    setFilename(filename);
                    setContent(value);
                    setShowStorageDialog(false);
                }
            }}
            onSave={(filename: string) => {
                const status = save(filename, content);
                setFilename(filename);
                setShowStorageDialog(false);
            }}
        />

        <Widget name="editor" collapsible={true} collapsed={false} expanded={expanded} >
            <Widget.Header name="Editor">
                <div className="panel">
                    {/* Save and Load */}
                    <button className="fas fa-save" onClick={handleClickSave} />
                    <button className="fas fa-folder-open" onClick={handleClickLoad} />
                </div>
                <div className="panel"> 
                    <button id="runbtn">Run <i className="fas fa-caret-right"></i></button>
                    <button id="debugbtn" onClick={handleDebugClick} className={`${isDebugging && 'active'}`}>Debug</button>
                    <button className="active">Prove</button>
                    { expanded 
                        ? <button className="fas fa-compress" onClick={() => setExpanded(false)} />
                        : <button className="fas fa-expand" onClick={() => setExpanded(true)} />
                    }
                </div>
            </Widget.Header>
            <Widget.Body>
                {isDebugging && <Debugger />  }
                <div id="editor" ref={editorRef}>
                    <CodeMirror
                        value={content}
                        height="100%"
                        theme={props.theme}
                        onChange={props.onChange}
                        basicSetup={{
                            foldGutter: true,
                            highlightActiveLineGutter: true,
                            dropCursor: true,
                            allowMultipleSelections: false,
                            indentOnInput: false,
                            lineNumbers: true,
                            syntaxHighlighting: true,
                            bracketMatching: true,
                            autocompletion: true,
                            highlightActiveLine: true
                        }}
                    />
                </div>
                {/* <MidenEditor value={code} onChange={setCode} theme={darkmode ? 'dark' : 'light'} /> */}
            </Widget.Body>
        </Widget>


    </>
};

export default Editor