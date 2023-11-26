import { Observer} from "./observer";

export const StoreEvent = {
    BLOCK_OWNER_CHANGE: 'BLOCK_OWNER_CHANGE',
    APPLICATION_STATE_CHANGE: 'APPLICATION_STATE_CHANGE',
    USER_STATS_CHANGE: 'USER_STATS_CHANGE'
}

export class Store extends Observer {
    // or computer
    state = {};

    set blockOwner(value) {
        this.state.blockOwner = value;
        this.notify(StoreEvent.BLOCK_OWNER_CHANGE);
    }

    set applicationStage(value) {
        this.state.applicationStage = value;
        this.notify(StoreEvent.APPLICATION_STATE_CHANGE);
    }

    set userStats(value) {
        this.state.userStats = value;
        this.notify(StoreEvent.USER_STATS_CHANGE);
    }
}

export const store = new Store();