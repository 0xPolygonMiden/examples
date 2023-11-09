import { useState, Fragment, useEffect } from "react";
import Widget from "../Widget"
import useDebugger, {DebugCommand} from "../../hooks/useDebugger";

const DebuggerPanel = () => {
    const [running, setRunning] = useState(false);
    const { execute, free, outputs } = useDebugger();
    const [ showAsJSON, setShowAsJSON ] = useState(false);


    return <>
    <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "stretch",
        height: "100%",
        minWidth: "50%"
    }}>
        <Widget.Header name="Debugger" >
            <div className="panel" style={{position:'relative'}}>

                <button type="button" className="fas fa-backward-fast" title="Start" onClick={() => {
                    execute(DebugCommand.RewindAll);
                }} />
                <button type="button" className="fas fa-backward-step" title="PPrevious" onClick={() => {
                    execute(DebugCommand.Rewind, BigInt(100));
                }} />
                <button type="button" className="fas fa-caret-left" title="Previous" onClick={() => {
                    execute(DebugCommand.Rewind, BigInt(1));
                }} />
                <button type="button" className="fas fa-print" title="Stack" onClick={() => {
                    execute(DebugCommand.PrintState);
                }} />
                <button type="button" className="fas fa-caret-right" title="Forward" onClick={() => {
                    execute(DebugCommand.Play, BigInt(1));
                }} />
                <button type="button" className="fas fa-forward-step" title="FForward" onClick={() => {
                    execute(DebugCommand.Play, BigInt(100));
                }} />
                <button type="button" className="fas fa-forward-fast" title="End" onClick={() => {
                    execute(DebugCommand.PlayAll);
                }} />

                <div style={{width:'3ch'}}></div>
                <button className={`fas fa-code ${showAsJSON?'active':''}`} title="JSON" onClick={e => setShowAsJSON(!showAsJSON)} />

            </div>
        </Widget.Header>
        <Widget.Body>
            {showAsJSON 
            ? <pre>{JSON.stringify(outputs,null,2)}</pre>
            :
            <table>
                <tbody>
                <tr>
                    <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Clock</th>
                    <td style={{width: "100%"}}>{outputs.clock}</td>
                </tr>
                <tr>
                    <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Instruction</th>
                    <td>{outputs.instruction}</td>
                </tr>
                <tr>
                    <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Memory</th>
                    <td>{outputs.memory}</td>
                </tr>
                <tr>
                    <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>N<sup>er</sup> of operations</th>
                    <td>{outputs.num_of_operations}</td>
                </tr>
                <tr>
                    <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Option</th>
                    <td>{outputs.op}</td>
                </tr>
                <tr>
                    <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Operation Index</th>
                    <td>{outputs.operation_index}</td>
                </tr>
                <tr>
                    <th style={{minWidth: "25ch", paddingLeft: "5ch" }}>Stack</th>
                    <td>{outputs.stack}</td>
                </tr>
                </tbody>
            </table>
            }
        </Widget.Body>
        </div>
    </>
}

export default DebuggerPanel
