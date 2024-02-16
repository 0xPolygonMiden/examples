import CodeMirror from '@uiw/react-codemirror';
import {
  DocumentDuplicateIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid';
import { BsChevronBarLeft, BsChevronBarRight } from 'react-icons/bs';
import { DebugCommand } from 'miden-wasm';

type MidenCodeProps = {
  value: string;
  showDebug: boolean;
  onChange: (value: string) => void;
  handleCopyClick: () => void;
  executeDebug: (command: DebugCommand, params?: bigint) => void;
};

const codeTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#19181F',
    foreground: '#ffffff',
    caret: '#ffffff',
    selection: '#036dd626',
    selectionMatch: '#036dd626',
    lineHighlight: '#19181F',
    gutterBackground: '#19181F',
    gutterForeground: '#ffffff'
  },
  styles: [{ tag: t.comment, color: '#787b8099' }]
});

const MidenCode = (props: MidenCodeProps): JSX.Element => {
  const saveFile = () => {
    const blob = new Blob([props.value], { type: 'text/plain' });

    // Step 3: Create a URL for the Blob
    const fileDownloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = fileDownloadUrl;
    link.download = 'code.masm'; // File name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(fileDownloadUrl);
  };

  return (
    <div className="flex w-full overflow-auto">
      <CodeMirror
        value={props.value}
        theme={codeTheme}
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
        className="grow overflow-auto pr-3"
      />

      <div className="flex-col mr-2">
        {!props.showDebug && (
          <div className="flex flex-col gap-y-3">
            <DocumentDuplicateIcon
              className="h-6 w-6 stroke-white hover:cursor-pointer"
              aria-hidden="true"
              onClick={props.handleCopyClick}
            />

            <DocumentTextIcon
              className="h-6 w-6 stroke-white hover:cursor-pointer"
              aria-hidden="true"
              onClick={saveFile}
            />
          </div>
        )}

        {props.showDebug ? (
          <div className="flex flex-col gap-y-3 mt-3">
            <BsChevronBarLeft
              className=" h-6 w-6 fill-white cursor-pointer"
              aria-hidden="true"
              title="Go to start"
              onClick={() => props.executeDebug(DebugCommand.RewindAll)}
            />

            <ChevronDoubleLeftIcon
              className="h-6 w-6 fill-white cursor-pointer"
              aria-hidden="true"
              title="100 cycles back"
              onClick={() =>
                props.executeDebug(DebugCommand.Rewind, BigInt(100))
              }
            />

            <ChevronLeftIcon
              className="h-6 w-6 fill-white cursor-pointer"
              aria-hidden="true"
              title="1 cycle back"
              onClick={() => props.executeDebug(DebugCommand.Rewind, BigInt(1))}
            />

            <ChevronRightIcon
              className="h-6 w-6 fill-white cursor-pointer"
              aria-hidden="true"
              title="1 cycles"
              onClick={() => props.executeDebug(DebugCommand.Play, BigInt(1))}
            />

            <ChevronDoubleRightIcon
              className="h-6 w-6 fill-white cursor-pointer"
              aria-hidden="true"
              title="100 cycles"
              onClick={() => props.executeDebug(DebugCommand.Play, BigInt(100))}
            />

            <BsChevronBarRight
              className="h-6 w-6 fill-white cursor-pointer"
              aria-hidden="true"
              title="Go to end"
              onClick={() => props.executeDebug(DebugCommand.PlayAll)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MidenCode;
