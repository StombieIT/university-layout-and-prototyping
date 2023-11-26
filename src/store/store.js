import { Observer} from "./observer";

export const BLOCK_OWNER_CHANGE = 'BLOCK_OWNER_CHANGE';

export class Store extends Observer {
    // or computer
    state = {};

    set blockOwner(value) {
        this.state.blockOwner = value;
        this.notify(BLOCK_OWNER_CHANGE);
    }
}

export const store = new Store();