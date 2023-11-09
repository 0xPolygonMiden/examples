import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import Widget from "../Widget";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Debugger from "./Debugger";
import StorageDialog from "../StorageDialog";
import { StorageContext } from "../../contexts/StorageProvider";
import {useMidenPlayground} from "../../contexts/MidenPlaygroundProvider";

type EditorProps = {
    height: string;
    theme: ReactCodeMirrorProps["theme"];
};

const Editor = (props: EditorProps) => {
    const [expanded, setExpanded] = useState(false);
    const [codeMirrorHeight, setCodeMirrorHeight] = useState("100%");
    const [isDebugging, setIsDebugging] = useState(false);
    const [showSaveStorageDialog, setShowSaveStorageDialog] = useState(false);
    const [showLoadStorageDialog, setShowLoadStorageDialog] = useState(false);
    const [filename, setFilename] = useState("");
    const {save, get, list} = useContext(StorageContext);
    const editorRef = useRef(null);
    const {setCode, code} = useMidenPlayground();

    useEffect(() => {
        // console.log("List in plugin 0", list(0, "/dir1"));
        list(0, "")
    }, []);

    const hangleCodeChange = (value: string) => {
        setCode(value);
    }

    const handleDebugClick = () => {
        //TODO - add debugging functionality

        setIsDebugging(!isDebugging);
    }

    const handleClickSave = () => {
        if(filename === "") {
            setShowSaveStorageDialog(true);
        } else {
            //TODO - add save functionality
            // const status = save(filename, props.value);
        }
    }

    const handleClickLoad = () => {
        setShowLoadStorageDialog(true);
    }


    return <>

        <Widget name="editor" collapsible={true} collapsed={false} expanded={expanded} >
            <Widget.Header name="Editor">
                <div className="panel">
                    {/* Save and Load */}
                    <button type="button"  className="fas fa-save" onClick={handleClickSave} />
                    <button type="button"  className="fas fa-folder-open" onClick={handleClickLoad} />
                </div>
                <div className="panel"> 
                    <button id="runbtn">Run <i className="fas fa-caret-right secondary-color"></i></button>
                    <button id="debugbtn" onClick={handleDebugClick} className={`${isDebugging && 'active'}`}>Debug</button>
                    <button className="active">Prove</button>
                    { expanded 
                        ? <button className="fas fa-compress" onClick={() => setExpanded(false)} title="Collapse editor" />
                        : <button className="fas fa-expand" onClick={() => setExpanded(true)} title="Expand editor" />
                    }
                </div>
            </Widget.Header>
            <Widget.Body>
                {isDebugging && <Debugger />  }
                <div id="editor" ref={editorRef}>
                    <CodeMirror
                        value={code}
                        height="100%"
                        theme={props.theme}
                        onChange={hangleCodeChange}
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
            </Widget.Body>
        </Widget>
        

        <StorageDialog
            title="Save to Storage"
            filter={{
                type: "application/wasm",
            }}
            show={showSaveStorageDialog}
            filename={filename}
            okText={<>Save<i className="fas fa-save" /></>}
            onOk={
                file => {
                    setFilename(file.name);
                    file.value = code;
                    save(0, file);
                    setShowSaveStorageDialog(false);
                }
            }
            onCancel={() => setShowSaveStorageDialog(false)}
        />

        <StorageDialog
            filter={{
                type: "application/wasm",
            }}
            show={showLoadStorageDialog}
            filename={filename}
            okText={<>Load<i className="fas fa-folder-open" /></>}
            onOk={
                async file => {
                    setFilename(file.name);
                    
                    setCode(file.value)

                    setShowLoadStorageDialog(false);
                }
            }
            onCancel={() => setShowLoadStorageDialog(false)}
        />


    </>
};

export default Editor