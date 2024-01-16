import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import {
  DocumentDuplicateIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

type EditorProps = {
  height: string;
  value: string;
  onChange: (value: string) => void;
  theme: ReactCodeMirrorProps['theme'];
};

const Editor = (props: EditorProps): JSX.Element => (
  <div className="flex">
    <CodeMirror
      value={props.value}
      height={props.height}
      theme={props.theme}
      onChange={props.onChange}
      basicSetup={{
        foldGutter: true,
        highlightActiveLineGutter: true,
        dropCursor: true,
        allowMultipleSelections: false,
        indentOnInput: false,
        lineNumbers: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        autocompletion: true,
        highlightActiveLine: true
      }}
      className="flex overflow-auto pr-3"
    />

    <div className="flex-col">
      <DocumentDuplicateIcon
        className="h-6 w-6 stroke-white"
        aria-hidden="true"
      />

      <DocumentTextIcon
        className="h-6 w-6 stroke-white mt-3"
        aria-hidden="true"
      />
    </div>
  </div>
);

export default Editor;
