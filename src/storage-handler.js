import {store, StoreEvent} from "@/store";
import {replaceStats} from "@/utils/storage";

store.subscribe(StoreEvent.USER_STATS_CHANGE, () =>
    replaceStats(store.state.userStats.login, store.state.userStats.stats)
);