import {store} from "./";
import {getOrCreateStats} from "@/utils/storage";

export class Controller {
    constructor(store) {
        this.store = store;
    }

    set login(value) {
        this.store.userStats = {
            login: value,
            ...getOrCreateStats(value)
        };
    }
}

export const controller = new Controller(store);
