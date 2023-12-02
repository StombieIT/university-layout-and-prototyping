import {Observer} from "@/store/observer";

export const GameStoreEvent = {
    TNT_OWNER_CHANGE: 'TNT_OWNER_CHANGE',
    FORCE_CHANGE: 'FORCE_CHANGE',
    ATTEMPTS_LEFT_CHANGE: 'ATTEMPTS_LEFT_CHANGE',
    HITS_LEFT_CHANGE: 'HITS_LEFT_CHANGE',
    TIME_LEFT_CHANGE: 'TIME_LEFT_CHANGE',
    POINTS_CHANGE: 'POINTS_CHANGE'
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

    set points(value) {
        this.state.points = value;
        this.notify(GameStoreEvent.POINTS_CHANGE);
    }

    set attemptsLeft(value) {
        this.state.attemptsLeft = value;
        this.notify(GameStoreEvent.ATTEMPTS_LEFT_CHANGE);
    }

    set hitsLeft(value) {
        this.state.hitsLeft = value;
        this.notify(GameStoreEvent.HITS_LEFT_CHANGE);
    }

    set timeLeft(value) {
        this.state.timeLeft = value;
        this.notify(GameStoreEvent.TIME_LEFT_CHANGE);
    }
}
