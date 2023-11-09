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
        <Editor height="300px" {...props} />
    )
}

export default MidenCode;