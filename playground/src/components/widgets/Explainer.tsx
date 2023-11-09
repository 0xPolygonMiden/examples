import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import md from "../../data/explainer.md";

const Explainer = () => {
    const [ explainer, setExplainer] = useState("");

    useEffect(() => {
        fetch(md)
            .then(res => res.text())
            .then(text => setExplainer(text));
    }, []);

    return <>
        <div className="markdown">
            <Markdown>{explainer}</Markdown>
        </div>
    </>
}

export default Explainer;