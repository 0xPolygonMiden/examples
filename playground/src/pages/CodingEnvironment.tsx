import Nav from "../components/Nav";
import Widget from "../components/Widget";
import WidgetPile from "../components/WidgetPile";

const CodingEnvironment = () => {
    return <>
        <div id="coding-environment">
            <Nav />
            <div className="container">
                <div className="widget-pile-container">
                    <WidgetPile>
                        <Widget name="Test Widget" collapsed={false}>
                            <Widget.Header>
                                <button>Run <i className="fas fa-caret-right"></i></button>
                                <button>Debug</button>
                                <button className="active">Prove</button>
                            </Widget.Header>
                            <Widget.Body>
                                <div  style={{minHeight: "400px"}}>
                                <p>Test</p>
                                <p>Test</p>
                                </div>
                            </Widget.Body>
                        </Widget>
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
                        <Widget name="Test Widget">
                            <Widget.Body>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                            </Widget.Body>
                        </Widget>
                        <Widget name="Test Widget">
                            <Widget.Body>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                            </Widget.Body>
                            <Widget.Footer>
                                <div>input</div>
                                <div>output</div>
                            </Widget.Footer>
                        </Widget>
                        <Widget name="Test Widget">
                            <Widget.Body>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                            </Widget.Body>
                        </Widget>
                        <Widget name="Test Widget">
                            <Widget.Body>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                                <p>Test</p>
                            </Widget.Body>
                        </Widget>
                    </WidgetPile>
                </div>
            </div>
        </div>
    </>;
};

export default CodingEnvironment;
