import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";

type EditorProps = {
    height: string;
    value: string;
    onChange: (value: string) => void;
    theme: ReactCodeMirrorProps["theme"];
};

const Editor = (props: EditorProps): JSX.Element =>
    <dl >
        <CodeMirror
            value={props.value}
            height={props.height}
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
                highlightActiveLine: true,
            }}
        />
    </dl>

export default Editor