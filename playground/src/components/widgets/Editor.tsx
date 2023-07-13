import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import Widget from "../Widget";
import { useEffect, useRef, useState } from "react";
import Debugger from "./Debugger";

type EditorProps = {
    height: string;
    value: string;
    onChange: (value: string) => void;
    theme: ReactCodeMirrorProps["theme"];
};

const Editor = (props: EditorProps): JSX.Element => {
    const [expanded, setExpanded] = useState(false);
    const [codeMirrorHeight, setCodeMirrorHeight] = useState("100%");
    const [isDebugging, setIsDebugging] = useState(false);
    const editorRef = useRef(null);

    const handleDebugClick = () => {
        //TODO - add debugging functionality

        setIsDebugging(!isDebugging);
    }

    return <>
        <Widget name="editor" collapsible={true} collapsed={false} expanded={expanded} >
            <Widget.Header name="Editor">
                <div className="panel">
                    {/* Save and Load */}
                    <button className="fas fa-save" />
                    <button className="fas fa-folder-open" />
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
                        value={props.value}
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