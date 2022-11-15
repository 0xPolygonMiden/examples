import {
  AppBar,
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import init, { program } from "miden-wasm";
import "./App.css";

async function getExample(example: string[]) {
    const inputs = fetch(`https://raw.githubusercontent.com/0xPolygonMiden/examples/main/examples/${example}.inputs`)
    const masm = fetch(`https://raw.githubusercontent.com/0xPolygonMiden/examples/main/examples/${example}.masm`)
    return [(await inputs).text(), (await masm).text()];
  }

function App() {

  const [inputs, setInputs] = React.useState(
    `{
      "stack_init": ["0"],
      "advice_tape": ["0"]
}`
  );

  var exampleCode =`begin
  push.1
  push.2
  add
end`

  const [code, setCode] = React.useState(exampleCode);

  const [output, setOutput] = React.useState({
    init: false,
    success: true,
    text: "",
  });

  const [numOfOutputs, setNumOfOutputs] = React.useState(1);

  // this should be dyncamically read from ./examples/ - buy my TS knowledge is limited
  const examples = [
    'collatz',
    'comparison',
    'conditional',
    'fibonacci',
    'game-of-life-4x4',
    'nPrime',
  ];
  
 
  const [example, setExample] = React.useState<string[]>([]);
  const handleChangeMultiple = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = event.target;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setExample(value)
    
    const example_code = await getExample(value)
    
    setInputs(await example_code[0])
    setCode(await example_code[1])    
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            Playground for Miden Examples in Miden Assembly
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <FormControl variant="outlined" sx={{ width: '100%' }}>
              <InputLabel shrink htmlFor="select-multiple-native">
                Select Example
              </InputLabel>
              <Select
                multiple
                native
                value={example}
                // @ts-ignore Typings are not considering `native`
                onChange={handleChangeMultiple}
                label="Native"
                inputProps={{
                  id: 'select-multiple-native',
                }}
              >
                {examples.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
          </FormControl>
        </Box>
        <Box sx={{ my: 4 }}>
          <CodeMirror
            value={inputs}
            height="100%"
            theme={oneDark}
            onChange={(value) => setInputs(value)}
          />
        </Box>
        <Box sx={{ my: 4 }}>
          <CodeMirror
            value={code}
            height="100%"
            theme={oneDark}
            onChange={(value) => setCode(value)}
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'row', mx: 'auto' }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              init().then(() => {
                try {
                  let resp = program(code, inputs, numOfOutputs);
                  console.log(resp);
                  setOutput({
                    init: true,
                    success: true,
                    text: resp.join(" "),
                  });
                } catch (error) {
                  setOutput({
                    init: true,
                    success: false,
                    text: "Error: Check the developer console for details.",
                  });
                }
              });
            }}
            endIcon={<SendIcon />}
          >
            Execute
          </Button>
          <Select
            value={numOfOutputs}
            onChange={(e) => setNumOfOutputs(Number(e.target.value))}
          >
            <MenuItem value={0}>0</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={16}>16</MenuItem>
          </Select>
          <InputLabel style={{backgroundColor: "#f5f5f5"}}>Outputs</InputLabel>
          </Box>
        <Box sx={{ my: 4 }}>
          {output.init ? (
            <Alert
              variant="outlined"
              severity={output.success ? "success" : "error"}
            >
              <Typography color="inherit" component="div">
                <b>{output.text}</b>
              </Typography>
            </Alert>
          ) : (
            <></>
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;
