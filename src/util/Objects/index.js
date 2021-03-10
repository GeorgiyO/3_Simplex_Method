function createNextIntGenerator () {
    let i = 0;
    return function() {
        return i++;
    };
}

let nextInt = createNextIntGenerator();

export class DynamicProperty {

    #value;
    #onChange = new Map();

    /**
     * @param {any} defaultValue=undefined
     */
    constructor(defaultValue = undefined) {
        if (defaultValue) this.#value = defaultValue;
    }

    /**
     * @param {function({any} newValue, {any} oldValue?)} foo
     * @return id for removeHandler(id)
     */
    addListener(foo) {
        let id = nextInt();
        this.#onChange.set(id, foo);
        return id;
    }

    /**
     * delete function from onChangeHandlers
     * @param id
     */
    removeListener(id) {
        this.#onChange.delete(id);
    }

    set(newValue) {
        let oldValue = this.#value;
        this.#value = newValue;
        for (let foo of this.#onChange.values()) foo(newValue, oldValue);
    }

    get() {
        return this.#value;
    }
}
