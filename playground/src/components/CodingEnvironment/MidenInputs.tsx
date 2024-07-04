import { createTheme } from '@uiw/codemirror-themes';
import CodeMirror from '@uiw/react-codemirror';
import { tags as t } from '@lezer/highlight';
import { json } from '@codemirror/lang-json';

type MidenInputsProps = {
  value: string;
  onChange: (value: string) => void;
};

const codeTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#141318',
    foreground: '#f8f8f2',
    caret: '#f8f8f0',
    selection: '#44475a',
    selectionMatch: '#44475a',
    lineHighlight: '#24202F',
    gutterBackground: '#141318',
    gutterForeground: '#569CD6'
  },
  styles: [
    { tag: t.comment, color: '#6272a4' }, // Comments (light blue)
    { tag: t.keyword, color: '#569CD6' }, // Keywords (blue)
    { tag: t.string, color: '#f1fa8c' }, // Strings (yellow)
    { tag: t.number, color: '#CB694A' }, // Numbers (orange)
    { tag: t.operator, color: '#ffb86c' }, // Operators (orange)
    { tag: t.variableName, color: '#569CD6' }, // Variable names (green)
    { tag: t.className, color: '#ff79c6' }, // Class names (pink)
    { tag: t.definition(t.typeName), color: '#569CD6' }, // Type names (green)
    { tag: t.typeName, color: '#8be9fd' }, // Type names (cyan)
    { tag: t.angleBracket, color: '#f8f8f2' }, // Angle brackets (white)
    { tag: t.tagName, color: '#ff79c6' }, // Tag names (pink)
    { tag: t.attributeName, color: '#ffb86c' } // Attribute names (orange)
  ]
});

const extensions = [json()];

const MidenInputs: React.FC<MidenInputsProps> = (props) => {
  return (
    <div className="flex w-full overflow-auto">
      <CodeMirror
        value={props.value}
        theme={codeTheme}
        extensions={extensions}
        onChange={props.onChange}
        basicSetup={{
          foldGutter: true,
          highlightActiveLineGutter: true,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
          lineNumbers: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          autocompletion: true,
          highlightActiveLine: true
        }}
        className="grow overflow-auto h-full w-full pr-3"
      />
    </div>
  );
};

export default MidenInputs;
