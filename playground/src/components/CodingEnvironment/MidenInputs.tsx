import { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import EditorLabel from "./EditorLabel";
import Editor from "./Editor";

type MidenInputsProps = {
    value: string;
    onChange: (value: string) => void;
    theme: ReactCodeMirrorProps["theme"];
};

const MidenInputs = (props: MidenInputsProps): JSX.Element =>
    <div className="min-w-0 flex-1 box-border">
        <EditorLabel label="inputs" />
        <Editor height="250px" {...props} />
    </div>

export default MidenInputs