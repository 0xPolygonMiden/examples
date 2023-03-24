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
    <div className="pt-6 pb-20 px-6 flex justify-center">
      <div className="bg-white w-full md:w-auto py-20 px-12 rounded-lg shadow">
        <article className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{explainer}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}    
