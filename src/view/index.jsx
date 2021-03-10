require('./style.scss');

export {createRoot, draw}

const React = require("react");
const ReactDom = require("react-dom");

const {InputPanel} = require("./InputPanel");
const {ResultPanel} = require("./ResultPanel");

class Root extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let _ = this.props.globalState;
        return (
            <div className={"Root"}>
                <InputPanel globalState={_}/>
                <ResultPanel globalState={_}/>
            </div>
        );
    }
}

let root;

function createRoot(globalState) {
    root = (
        <Root globalState={globalState}/>
    )
}

function draw() {
    ReactDom.render(
        root,
        document.getElementById("root")
    );
}