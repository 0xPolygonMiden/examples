import EditorLabel from "./EditorLabel";
import Editor from "./Editor";

const MidenCode = (props: any): JSX.Element => {

    return (
        <div className="min-w-0 flex-1 box-border">
            <EditorLabel label="miden assembly code" />
            <Editor height="700px" {...props} />
        </div>
    )

}

export default MidenCode;