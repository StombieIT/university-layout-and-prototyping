import "./index.scss";

const ID_CONTAINER = "container";
const ID_PETROL_INPUT = "petrol-input";
const ID_CAR_BUTTON = "car-button";
const ID_MOTO_BUTTON = "moto-button";
const ID_SMILE_OUTPUT_IM = "smile-output-im";

const CAR_TRANSPORT = "car";
const MOTO_TRANSPORT = "moto";

window.addEventListener("load", () => {
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

    const container = document.getElementById(ID_CONTAINER);
    const petrolInput = document.getElementById(ID_PETROL_INPUT);
    const carButton = document.getElementById(ID_CAR_BUTTON);
    const motoButton = document.getElementById(ID_MOTO_BUTTON);

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

            const smileSrc = isEnough ? "./sm_1.png" : "./sm_2.png";

            let smileOutputIm = document.getElementById(ID_SMILE_OUTPUT_IM);
            if (smileOutputIm) {
                smileOutputIm.src = smileSrc;
            } else {
                smileOutputIm = document.createElement("img");
                smileOutputIm.id = ID_SMILE_OUTPUT_IM;
                smileOutputIm.src = smileSrc;
                container.appendChild(smileOutputIm);
            }
        }
    });
});

