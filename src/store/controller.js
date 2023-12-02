import {store} from "./";
import {getOrCreateStats} from "@/utils/storage";

export class Controller {
    constructor(store) {
        this.store = store;
    }

    set login(value) {
        this.store.userStats = {
            login: value,
            stats: getOrCreateStats(value)
        };
    }

    set currentLevel(value) {
        this.store.userStats = {
            ...this.store.state.userStats,
            stats: {
                ...this.store.state.userStats.stats,
                currentLevel: value
            }
        };
    }

    addPoints(pointsToAdd) {
        this.store.userStats = {
            ...this.store.state.userStats,
            stats: {
                ...this.store.state.userStats.stats,
                points: this.store.state.userStats.stats.points + pointsToAdd
            }
        };
    }
}

export const controller = new Controller(store);
