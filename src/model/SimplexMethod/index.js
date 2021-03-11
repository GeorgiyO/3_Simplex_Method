exports.SimplexMethod = class {

    #freeVarCount;
    #basisVarCount;
    #inequalities;
    #targetFoo;
    #bValues;
    #basisTargets;

    #basisI;
    #basisJ;

    #table;

    /**
     * @param {number[][]} inequalities                     -коэффециенты линейных уравнений
     * @param {number[]} inequalitiesValues                 -максимальные значения линейных уравнений / константы
     * @param {number[]} targetFoo                          -коэффециенты функции цели
     * @returns {{value: number, variables: number[]}}      -результат и коэффециенты для функции цели
     */
    solve(inequalities, inequalitiesValues, targetFoo) {
        if (inequalities[0].length !== targetFoo.length ||
            inequalities.length !== inequalitiesValues.length) throw new TypeError("variables count must be the same value");

        this.#freeVarCount = inequalities[0].length;
        this.#basisVarCount = inequalities.length;
        this.#inequalities = inequalities;
        this.#targetFoo = targetFoo;
        this.#bValues = inequalitiesValues;
        this.#basisTargets = new Array(this.#basisVarCount);
        for (let i = 0; i < this.#basisVarCount; i++) {
            this.#basisTargets[i] = i + this.#freeVarCount + 1;
        }

        this.#createTable();
        this.#solveTable();

        let variables = new Array(this.#freeVarCount).fill(0);
        for (let i = 0; i < this.#basisVarCount; i++) {
            let target = this.#basisTargets[i] - 1;
            if (target > this.#freeVarCount) continue;

            variables[target] = this.#table[i][0];
        }
        return {
            value: this.#table[this.#basisVarCount][0],
            variables
        }
    }

    #createTable() {
        this.#table = [];

        for (let i = 0; i < this.#basisVarCount; i++) {
            this.#table.push(new Array(this.#basisVarCount + this.#freeVarCount + 1));
        }

        for (let i = 0; i < this.#basisVarCount; i++) {
            this.#table[i][0] = this.#bValues[i];
        }

        for (let i = 0; i < this.#basisVarCount; i++) {
            for (let j = 0; j < this.#freeVarCount; j++) {
                this.#table[i][j + 1] = this.#inequalities[i][j];
            }
        }

        for (let i = 0; i < this.#basisVarCount; i++) {
            for (let j = 0; j < this.#basisVarCount; j++) {
                this.#table[i][j + 1 + this.#freeVarCount] = i === j ? 1 : 0;
            }
        }

        let fxRow = [];
        fxRow.push(0);
        for (let coef of this.#targetFoo) fxRow.push(-coef);
        for (let i = 0; i < this.#basisVarCount; i++) fxRow.push(0);
        this.#table.push(fxRow);
    }

    #solveTable() {
        if (this.#checkOptimality()) return;
        this.#findBasisIJ();
        this.#recalculateTable();
        this.#solveTable();
    }

    #checkOptimality() {
        for (let coef of this.#table.last()) {
            if (coef < -1e-10) return false;
        }
        return true;
    }

    #findBasisIJ() {

        // basisJ:

        this.#basisJ = 1;
        for (let i = 2; i < this.#table[0].length; i++) {
            if (this.#table.last()[i] < this.#table.last()[this.#basisJ]) this.#basisJ = i;
        }

        // basisI:

        this.#basisI = 0;
        let map = new Map();
        for (let i = 0; i < this.#basisVarCount; i++) {
            let key = this.#table[i][0] / this.#table[i][this.#basisJ];
            if (key > 0) map.set(key, i);
        }
        this.#basisI = map.get(Math.min(...map.keys()));
    }

    #recalculateTable() {
        this.#basisTargets[this.#basisI] = this.#basisJ;
        let divider = this.#table[this.#basisI][this.#basisJ];
        let multipliers = [];
        for (let i = 0; i < this.#table.length; i++) {
            multipliers.push(this.#table[i][this.#basisJ]);
        }
        for (let i = 0; i < this.#table.length; i++) {
            if (i === this.#basisI) continue;
            for (let j = 0; j < this.#table[0].length; j++) {
                this.#table[i][j] -=
                    this.#table[this.#basisI][j] *
                    multipliers[i] /
                    divider;
            }
        }
        for (let i = 0; i < this.#table[0].length; i++) {
            this.#table[this.#basisI][i] /= divider;
        }
    }
}
