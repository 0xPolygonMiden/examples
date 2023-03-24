import EditorLabel from "./EditorLabel";
import Editor from "./Editor";

const MidenInputs = (props: any): JSX.Element =>
    <div className="min-w-0 flex-1 box-border">
        <EditorLabel label="inputs" />
        <Editor height="150px" {...props} />
    </div>

export default MidenInputs