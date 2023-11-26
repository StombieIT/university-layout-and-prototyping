import {createEmptyStats} from "@/utils/stats";

const STATS_KEY = 'stats';

export function getOrCreateStats(login) {
    const stringifiedStats = localStorage.getItem(STATS_KEY);

    let stats;
    if (!stringifiedStats) {
        stats = {};
    } else {
        stats = JSON.parse(stringifiedStats);
    }

    if (stats[login]) {
        return stats[login];
    }

    stats[login] = createEmptyStats();

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));

    return stats[login];
}

export function replaceStats(stats) {
}
