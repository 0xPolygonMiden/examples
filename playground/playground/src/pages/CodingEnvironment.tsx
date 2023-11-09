import { useContext, useState } from "react";
import { ConfigContext } from "../contexts/ConfigProvider";
import { exampleCode } from "../utils/constants";
import Nav from "../components/Nav";
import Widget from "../components/Widget";
import WidgetPile from "../components/WidgetPile";
import Editor from "../components/widgets/Editor";
import MidenInputs from "../components/widgets/MidenInputs";


const CodingEnvironment = () => {

    const { widgets, darkmode } = useContext(ConfigContext);
    return <>
        <div id="coding-environment">
            <Nav />
            <div className="container">
                {widgets.editor.visible && <>

                    <div className="widget-pile-container">
                        <WidgetPile>
                            <Editor
                                height="100%"
                                theme={darkmode ? 'dark' : 'light'}
                            />
                            <MidenInputs theme={darkmode ? 'dark' : 'light'} />
                            <Widget collapsible={false}>
                                <Widget.Header name="Output"></Widget.Header>
                            </Widget>
                        </WidgetPile>
                    </div>
                </>}
                {widgets.instructions.visible && <>
                    <div className="widget-pile-container">
                        <WidgetPile>
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
                            <Widget name="Something" collapsible={true} collapsed={true}>
                                <Widget.Header name="Something" />
                                <Widget.Body>
                                    <p>Something</p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, ipsum! Cum libero, voluptates, maiores explicabo obcaecati, quod minus molestias fuga repellat laudantium aperiam. Inventore porro nemo repudiandae error, doloribus architecto!
                                </Widget.Body>
                            </Widget>
                        </WidgetPile>
                    </div>
                </>}
            </div>
        </div>
    </>;
};

export default CodingEnvironment;
