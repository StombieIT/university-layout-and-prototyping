class Observer {
    constructor(state) {
        this.state = createSetters(state);
    }

    createSetters(inp) {
        if (typeof inp === 'object') {
            const obj = {...inp};

            for (const property in obj) {
                if (typeof obj[property] === 'object') {
                    // createSetters(obj);
                    obj[property] = new Proxy(obj[property], {
                        set(target, prop, value) {
                            target[prop] = createSetters(value);
                            this.notify();
                        }
                    });
                }
            }

            return obj;
        }

        return inp;
    }

    notify() {
        console.log('changed');
    }
}