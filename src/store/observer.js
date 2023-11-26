export class Observer {
    observers = {};

    subscribe(event, observer) {
        if (this.observers[event]) {
            this.observers[event].push(observer);
        } else {
            this.observers[event] = [observer];
        }
    }



    notify(event) {
        if (this.observers[event]) {
            this.observers[event].forEach(observer => observer());
        }
    }
}