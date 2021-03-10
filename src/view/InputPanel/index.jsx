const React = require("react");

export class InputPanel extends React.Component {

    inequalities;
    inequalitiesValues;
    targetFoo;

    constructor(props) {
        super(props);
        this.state = props.globalState.parameters.get();
        props.globalState.parameters.addListener((value) => {
            this.setState({...value});
        });
        this.parameters = props.globalState.parameters;
    }

    addRow() {
        let obj = this.parameters.get();
        obj.inequalities.push(new Array(obj.inequalities[0].length).fill(0));
        obj.inequalitiesValues.push(0);
        this.parameters.set(obj);
    }

    removeRow() {
        let obj = this.parameters.get();
        if (obj.inequalities.length === 1) return;
        obj.inequalities.pop();
        obj.inequalitiesValues.pop();
        this.parameters.set(obj);
    }

    addColumn() {
        let obj = this.parameters.get();
        for (let row of obj.inequalities) row.push(0);
        obj.targetFoo.push(0);
        this.parameters.set(obj);
    }

    removeColumn() {
        let obj = this.parameters.get();
        if (obj.inequalities[0].length === 1) return;
        for (let row of obj.inequalities) row.pop();
        obj.targetFoo.pop();
        this.parameters.set(obj);
    }

    onCellChange(value, i, j) {
        let obj = this.parameters.get();
        obj.inequalities[i][j] = value;
        this.parameters.set(obj);
    }

    onInequalitiesValuesChange(value, i) {
        let obj = this.parameters.get();
        obj.inequalitiesValues[i] = value;
        this.parameters.set(obj);
    }

    onTargetFooChange(value, i) {
        let obj = this.parameters.get();
        obj.targetFoo[i] = value;
        this.parameters.set(obj);
    }

    render() {
        let buttons = [
            ["добавить строку", this.addRow],
            ["убрать строку", this.removeRow],
            ["добавить столбец", this.addColumn],
            ["убрать столбец", this.removeColumn]
        ].map(([name, foo]) =>
            <button key={"button" + this.constructor.name + foo.name}
                    onClick={foo.bind(this)}>
                {name}
            </button>
        );

        let inequalitiesInputs = [];
        for (let i = 0; i < this.state.inequalities.length; i++) {
            let row = [];
            for (let j = 0; j < this.state.inequalities[0].length; j++) {
                let cell = this.state.inequalities[i][j];
                row.push(
                    <input  key={"inpPanCell" + i + "-" + j}
                            type={"number"}
                            value={cell}
                            onChange={(e) => {
                                this.onCellChange(e.target.value, i, j);
                            }}
                    />
                )
            }
            inequalitiesInputs.push(row);
        }
        for (let i = 0; i < this.state.inequalitiesValues.length; i++) {
            let cell = this.state.inequalitiesValues[i];
            inequalitiesInputs[i].push(
                <input  key={"inpPanCell" + i + "-" + this.state.inequalities.length}
                        type={"number"}
                        value={cell}
                        onChange={(e) => {
                            this.onInequalitiesValuesChange(e.target.value, i);
                        }}
                />
            )
        }

        inequalitiesInputs = inequalitiesInputs.map((row, i) =>
            <div key={"ineqInpRow" + i} className={"Row"}>{row}</div>
        )

        let targetFooInputs = this.state.targetFoo.map((value, i) =>
            <input  key={"inpPanTarFoo" + i}
                    type={"number"}
                    value={value}
                    onChange={(e) => {
                        this.onTargetFooChange(e.target.value, i);
                    }}
            />
        );

        let inequalitiesHint = [];
        let targetFooHint = [];
        for (let i = 1; i <= this.state.inequalities[0].length; i++) {
            let hint = <div key={"ineqHint" + i}>X<sub>{i}</sub></div>
            inequalitiesHint.push(hint);
            targetFooHint.push(hint);
        }
        inequalitiesHint.push(<div key={"ineqHintB"}>B</div>);

        return (
            <div className={"InputPanel"}>
                {buttons}
                <p>Таблица значений:</p>
                <div className={"Hint"}>{inequalitiesHint}</div>
                <div className={"InequalitiesInputs"}>
                    {inequalitiesInputs}
                </div>
                <p>Целевая функция</p>
                <div className={"Hint"}>{targetFooHint}</div>
                <div className={"TargetFooInputs"}>
                    {targetFooInputs}
                </div>
            </div>
        );
    }
}
