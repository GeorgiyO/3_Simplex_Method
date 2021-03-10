const React = require("react");

export class ResultPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: props.globalState.result.get()
        }
        props.globalState.result.addListener((result) => {
            this.setState({result});
        })
    }

    render() {
        let variables = this.state.result.variables.map((v, i) =>
            <div key={`resPanVar${i}`} className={"Variables"}>
                X<sub>{i + 1}</sub> = {v.toFixed(2)}
            </div>
        );
        return (
            <div className={"ResultPanel"}>
                <div>
                    Максимально допустимый доход: {this.state.result.value.toFixed(2)}
                </div>
                <div>
                    Значения переменных: {variables}
                </div>
            </div>
        );
    }

}