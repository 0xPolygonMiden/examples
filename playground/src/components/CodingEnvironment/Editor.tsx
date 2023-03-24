import CodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";

type EditorProps = {
    height: string;
    value: string;
    onChange: (value: string) => void;
    theme: ReactCodeMirrorProps["theme"];
};

const Editor = (props: EditorProps): JSX.Element =>
    <dl className="mt-3 grid grid-cols-1">
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
            className="overflow-hidden rounded-lg bg-white p-2 shadow sm:p-3"
        />
    </dl>

export default Editor