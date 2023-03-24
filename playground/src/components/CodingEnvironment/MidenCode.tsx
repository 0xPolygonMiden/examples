import { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import EditorLabel from "./EditorLabel";
import Editor from "./Editor";

type MidenCodeProps = {
    value: string;
    onChange: (value: string) => void;
    theme: ReactCodeMirrorProps["theme"];
};

const MidenCode = (props: MidenCodeProps): JSX.Element => {
    return (
        <div className="min-w-0 flex-1 box-border">
            <EditorLabel label="miden assembly code" />
            <Editor height="700px" {...props} />
        </div>
    )
}

export default MidenCode;