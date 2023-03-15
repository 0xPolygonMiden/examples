import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


import Explainer from "../markdown/Explainer.md";

export default function ExplainerPage(): JSX.Element {
  const [explainer, setExplainer] = useState("");

  // Fetch Explainer
  useEffect(() => {
    fetch(Explainer)
      .then((res) => res.text())
      .then((text) => setExplainer(text));
  });

  return (
    <div className="flex content-center justify-center pt-3">
     <article className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{explainer}</ReactMarkdown>  
      </article>
    </div>
  );
}    
