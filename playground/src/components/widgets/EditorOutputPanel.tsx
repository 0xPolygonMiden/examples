import { useState } from "react";
import usePlayground from "../../hooks/usePlayground";
import Widget from "../Widget";


const EditorOutputPanel = () => {
    const { outputs } = usePlayground();
    const [ showAsJSON, setShowAsJSON ] = useState(false);

    return <>
        <Widget collapsible={true} collapsed={false}>
            <Widget.Header name="Outputs">
                <button className={`fas fa-code ${showAsJSON?'active':''}`} title="JSON" onClick={e => setShowAsJSON(!showAsJSON)} />
            </Widget.Header>
            <Widget.Body>
                {showAsJSON 
                ? <pre>{JSON.stringify(outputs,null,2)}</pre>
                :
                <table>
                    <tbody>
                    <tr>
                        <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Overflow Address</th>
                        <td style={{width: "100%"}}>{outputs.overflow_addrs}</td>
                    </tr>
                    <tr>
                        <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Trace Lenght</th>
                        <td>{outputs.trace_len}</td>
                    </tr>
                    <tr>
                        <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Proof</th>
                        <td>{outputs.proof}</td>
                    </tr>
                    <tr>
                        <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Stack Output</th>
                        <td>{outputs.stack_output}</td>
                    </tr>
                    </tbody>
                </table>
                }
            </Widget.Body>
        </Widget>
    </>
}

export default EditorOutputPanel;
