export class Observer {
    observers = {};

    constructor(state = {}) {
        this.state = state;
    }

    subscribe(event, observer) {
        if (this.observers[event]) {
            this.observers[event].push(observer);
        } else {
            this.observers[event] = [observer];
        }
    }

    unsubscribe(event, observer) {
        if (this.observers[event]) {
            this.observers[event] = this.observers[event].filter(obs => obs !== observer);
        }
    }

    notify(event) {
        if (this.observers[event]) {
            this.observers[event].forEach(observer => observer());
        }
    }
}