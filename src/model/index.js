export {globalState}

const SimplexMethod = new (require("./SimplexMethod").SimplexMethod);
const {DynamicProperty} = require("./../util/Objects");

let globalState = {
    parameters: new DynamicProperty({
        inequalities: [
            [4, 2, 5],
            [2, 8, 4],
            [2, 4, 2]
        ],
        inequalitiesValues: [
            250,
            160,
            440
        ],
        targetFoo: [
            13, 17, 24
        ]
    }),
    result: new DynamicProperty({
        value: 0,
        variables: []
    })
}

globalState.parameters.addListener(updateResult);
updateResult();

function updateResult() {
    globalState.result.set(SimplexMethod.solve(
        globalState.parameters.get().inequalities,
        globalState.parameters.get().inequalitiesValues,
        globalState.parameters.get().targetFoo
    ));
}
