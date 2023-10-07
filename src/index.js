import "./index.scss";

const CAR_TRANSPORT = "car";
const MOTO_TRANSPORT = "moto";

const isStarted = confirm("Приступаем?");

alert(isStarted ? "Жизнь продолжается, и мы должны двигаться дальше" : "Даже камень движется дальше");

const pathLength = Number(prompt("Введите длину пути"));

class Store {
    constructor({petrol}) {
        this.observers = [];
        this._petrol = petrol;
    }

    set transport(value) {
        this._transport = value;
        this.notify();
    }

    set petrol(value) {
        this._petrol = value;
        this.notify();
    }

    get state() {
        return {
            petrol: this._petrol,
            transport: this._transport
        };
    }

    subscribe = (observer) => {
        this.observers.push(observer);
        observer(this.state);
    }

    notify = () => {
        this.observers.forEach(observer => observer(this.state));
    }
}


const petrolInput = document.getElementById("petrol-input");
const carButton = document.getElementById("car-button");
const motoButton = document.getElementById("moto-button");
const smileOutput = document.getElementById("smile-output");

const store = new Store({
    petrol: Number(petrolInput.value)
});

petrolInput.addEventListener("input", evt => {
    store.petrol = Number(evt.target.value);
});

carButton.addEventListener("click", evt => {
   store.transport = CAR_TRANSPORT;
});

motoButton.addEventListener("click", evt => {
    store.transport = MOTO_TRANSPORT;
})

store.subscribe(({petrol, transport}) => {
    if (transport) {
        const consumption = transport === CAR_TRANSPORT ? 10 : 5;

        const isEnough = petrol >= consumption * pathLength / 100;
        console.log({
            petrol,
            required: consumption * pathLength / 100,
            isEnough
        });
        smileOutput.innerText = isEnough ? ":)" : ":(";
    }
});
