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
  SelectChangeEvent,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import init, { program } from "miden-wasm";

async function getExample(example: string) {
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

  const emptyOutput = {
    init: false,
    success: true,
    text: " ",
  };
  const [output, setOutput] = React.useState(emptyOutput);

  const [numOfOutputs, setNumOfOutputs] = React.useState(1);

  // this should be dyncamically read from ./examples/ - buy my TS knowledge is limited
  const examples = [
    'aliquot-sum',
    'collatz',
    'comparison',
    'conditional',
    'fibonacci',
    'game-of-life-4x4',
    'nprime',
  ];
  
 
  const [example, setExample] = React.useState<string>();
  const handleSelectChange = async (event: SelectChangeEvent) => {
    const value = event.target.value;
    // set the current example to the selected one
    setExample(value)

    // retrieve the example data and update the inputs and code
    const example_code = await getExample(value)
    setInputs(await example_code[0])
    setCode(await example_code[1])    

    // reset the output
    setOutput(emptyOutput)
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
      <Box sx={{ display: 'flex', flexDirection: 'row', mx: 'auto', my: 4}}>
          <FormControl variant="outlined" sx={{minWidth: 120}}>
              <InputLabel id="select-example">
                Example
              </InputLabel>
              <Select
                value={example}
                onChange={handleSelectChange}
                label="Example"
                labelId='select-example'
              >
                {examples.map((name) => (
                  <MenuItem value={name} key={name}>{name}</MenuItem>
                ))}
              </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{minWidth: 120, mx: 2}}>
              <InputLabel id="select-outputs">
                Outputs
              </InputLabel>
              <Select
              value={numOfOutputs}
              onChange={(e) => setNumOfOutputs(Number(e.target.value))}
              label="Outputs"
              labelId='select-outputs'
            >
              <MenuItem value={0} key={0}>0</MenuItem>
              <MenuItem value={1} key={1}>1</MenuItem>
              <MenuItem value={16} key={16}>16</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
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
          {output.init ? (
            <Alert
              variant="outlined"
              severity={output.success ? "success" : "error"}
              sx={{mx: 2}}
            >
              <Typography color="inherit" component="div">
                {output.text}
              </Typography>
            </Alert>
          ) : (
            <></>
          )}
        </Box>
        <Box sx={{ my: 4 }}>
        <Typography color="primary" variant="h6">Inputs</Typography>
          <CodeMirror
            value={inputs}
            height="100%"
            maxHeight="200px"
            theme={oneDark}
            onChange={setInputs}
          />
        </Box>
        <Box sx={{ my: 4 }}>
        <Typography color="primary" variant="h6">Miden Assembly Code</Typography>
          <CodeMirror
            value={code}
            height="100%"
            theme={oneDark}
            onChange={setCode}
            maxHeight="500px"
          />
        </Box>

      </Container>
    </>
  );
}

export default App;
