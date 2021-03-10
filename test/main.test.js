require("neko-utils").addAllExtraFunctions();
const {assert, assertEquals, TestHandler} = require("neko-tests");
const {SimplexMethod} = require("./../src/model/SimplexMethod");

let inequalities = [
    [4, 2, 5],
    [2, 8, 4],
    [2, 4, 2]
];
let inequalitiesValues = [
    250,
    160,
    440
]
let targetFoo = [7, 6, 8];

TestHandler.fromObject({
    tests: [
        createTableTest = () => {
            let actual = new SimplexMethod().solve(inequalities, inequalitiesValues, targetFoo);
            assertEquals(450, actual.result);
        },
    ]
}).run();