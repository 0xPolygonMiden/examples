import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import Explainer from '../markdown/Explainer.md';

export default function ExplainerPage(): JSX.Element {
  const [explainer, setExplainer] = useState('');

  // Fetch Explainer
  useEffect(() => {
    fetch(Explainer)
      .then((res) => res.text())
      .then((text) => setExplainer(text));
  });

  return (
    <div className="pt-6 px-6 flex justify-center h-full w-full">
      <div className="bg-primary h-fit w-full md:w-auto px-12 rounded-lg shadow">
        <article className="prose prose-headings:text-white prose-code:text-white prose-strong:text-white prose-a:text-white dark:format-invert text-white">
          <ReactMarkdown className="pb-40 pt-10" remarkPlugins={[remarkGfm]}>
            {explainer}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
