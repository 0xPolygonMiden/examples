import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid';
import { DebugCommand } from 'miden-wasm';
import { tags as t } from '@lezer/highlight';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import { StreamLanguage } from '@codemirror/language';
import { c } from '@codemirror/legacy-modes/mode/clike'; // Import the gas mode

type MidenCodeProps = {
  value: string;
  codeSize: number;
  showDebug: boolean;
  onChange: (value: string) => void;
  executeDebug: (command: DebugCommand, params?: bigint) => void;
};

export interface MidenCodeHandles {
  downloadCode: () => void;
}

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

const extensions = [StreamLanguage.define(c)];

const MidenCode = forwardRef<MidenCodeHandles, MidenCodeProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    downloadCode() {
      const blob = new Blob([props.value], { type: 'text/plain' });

      const fileDownloadUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = fileDownloadUrl;
      link.download = 'code.masm'; // File name for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(fileDownloadUrl);
    }
  }));

  const onChange = useCallback((value: any, viewUpdate: any) => {
    props.onChange(value);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-auto miden-code-layout">
      <div className="flex w-full py-1.5 px-2">
        {props.showDebug ? (
          <div className="flex items-center ml-auto gap-x-2">
            <ChevronDoubleLeftIcon
              className="h-6 w-6 fill-green cursor-pointer"
              aria-hidden="true"
              title="100 cycles back"
              onClick={() =>
                props.executeDebug(DebugCommand.Rewind, BigInt(100))
              }
            />

            <ChevronLeftIcon
              className="h-6 w-6 fill-green cursor-pointer"
              aria-hidden="true"
              title="1 cycle back"
              onClick={() => props.executeDebug(DebugCommand.Rewind, BigInt(1))}
            />

            <ChevronRightIcon
              className="h-6 w-6 fill-green cursor-pointer"
              aria-hidden="true"
              title="1 cycles"
              onClick={() => props.executeDebug(DebugCommand.Play, BigInt(1))}
            />

            <ChevronDoubleRightIcon
              className="h-6 w-6 fill-green cursor-pointer"
              aria-hidden="true"
              title="100 cycles"
              onClick={() => props.executeDebug(DebugCommand.Play, BigInt(100))}
            />
          </div>
        ) : null}
      </div>

      <CodeMirror
        value={props.value}
        theme={codeTheme}
        extensions={extensions}
        onChange={onChange}
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
        style={{ fontSize: `${props.codeSize}px` }}
        className={`grow overflow-auto pr-3`}
      />
    </div>
  );
});

export default MidenCode;
