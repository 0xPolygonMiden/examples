import usePlayground from "../../hooks/usePlayground"
import EditorCodePanel from "./EditorCodePanel"
import EditorInputsPanel from "./EditorInputsPanel"
import EditorOutputPanel from "./EditorOutputPanel"

const Editor = () => {
    const { wasmIsInitialized } = usePlayground();

    if(!wasmIsInitialized) return <div>Initializing ...</div>;

    return <>
        <EditorCodePanel />
        <EditorInputsPanel />
        <EditorOutputPanel />
    </>
}   

export default Editor;