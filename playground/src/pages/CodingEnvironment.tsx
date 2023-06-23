import { useContext, useState } from "react";
import Nav from "../components/Nav";
import Widget from "../components/Widget";
import WidgetPile from "../components/WidgetPile";
import { ConfigContext } from "../contexts/ConfigProvider";
import InstructionTable from "./InstructionTable";
import MidenEditor from "../components/CodingEnvironment/MidenCode";
import { exampleCode } from "../utils/constants";


const CodingEnvironment = () => {
    const [code, setCode] = useState(exampleCode);

    const { widgets, darkmode } = useContext(ConfigContext);
    return <>
        <div id="coding-environment">
            <Nav />
            <div className="container">
                <div className="widget-pile-container">
                    <WidgetPile>
                        {widgets.editor.visible &&
                            <Widget name="editor" collapsible={true} collapsed={false} >
                                <Widget.Header name="Editor">
                                    <button id="runbtn">Run <i className="fas fa-caret-right"></i></button>
                                    <button id="debugbtn">Debug</button>
                                    <button className="active">Prove</button>
                                </Widget.Header>
                                <Widget.Body>
                                    <MidenEditor value={code} onChange={setCode} theme={darkmode ? 'dark' : 'light'} />
                                </Widget.Body>
                            </Widget>
                        }
                    </WidgetPile>
                    <div className="input-output">
                        <div className="input">
                            Input
                        </div>
                        <div className="output">
                            Output
                        </div>
                    </div>
                </div>
                <div className="widget-pile-container">
                    <WidgetPile>
                        {widgets.instructions.visible &&
                            <Widget name="instructions" collapsible={true} collapsed={false}>
                                <Widget.Header name="Instructions" />
                                <Widget.Body>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Instruction</th>
                                                <th>Opcode</th>
                                                <th>Arguments</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>ADD</td>
                                                <td>0x01</td>
                                                <td>None</td>
                                            </tr>
                                            <tr>
                                                <td>SUB</td>
                                                <td>0x02</td>
                                                <td>None</td>
                                            </tr>
                                            <tr>
                                                <td>MUL</td>
                                                <td>0x03</td>
                                                <td>None</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Widget.Body>
                            </Widget>
                        }
                        <Widget name="Something" collapsible={true} collapsed={true}>
                            <Widget.Header name="Something" />
                            <Widget.Body>
                                <p>Something</p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, ipsum! Cum libero, voluptates, maiores explicabo obcaecati, quod minus molestias fuga repellat laudantium aperiam. Inventore porro nemo repudiandae error, doloribus architecto!
                            </Widget.Body>
                        </Widget>
                    </WidgetPile>
                </div>
            </div>
        </div>
    </>;
};

export default CodingEnvironment;
