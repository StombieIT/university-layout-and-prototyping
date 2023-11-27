import {Observer} from "@/store/observer";

export const GameStoreEvent = {
    TNT_OWNER_CHANGE: 'TNT_OWNER_CHANGE',
    FORCE_CHANGE: 'FORCE_CHANGE'
};

export const TntOwner = {
    USER: 'USER'
};

export class GameStore extends Observer {
    set tntOwner(value) {
        this.state.tntOwner = value;
        this.notify(GameStoreEvent.TNT_OWNER_CHANGE);
    }

    set force(value) {
        this.state.force = value;
        this.notify(GameStoreEvent.FORCE_CHANGE);
    }
}
