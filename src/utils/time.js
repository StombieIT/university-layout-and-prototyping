export function createDurationTicker(duration, ratioHandler) {
    let needToCancel = false;

    const cancel = () => needToCancel = true;

    const promise = new Promise(resolve => {
        const ticksStartFrom = Date.now();

        const tick = () => {
            const now = Date.now();

            const spentTime = now - ticksStartFrom;

            if (spentTime < duration && !needToCancel) {
                ratioHandler(spentTime / duration);
                requestAnimationFrame(tick)
            } else {
                resolve();
            }
        }

        requestAnimationFrame(tick);
    });

    return {
        promise,
        cancel
    };
}

export function createInfiniteTicker(timeSpentHandler) {
    let needToCancel = false;

    const cancel = () => needToCancel = true;

    const promise = new Promise(resolve => {
        let lastTickTime = Date.now();

        const tick = () => {
            const now = Date.now();

            const timeSpent = now - lastTickTime;
            lastTickTime = now;

            if (!needToCancel) {
                timeSpentHandler(timeSpent);
                requestAnimationFrame(tick)
            } else {
                resolve();
            }
        }

        requestAnimationFrame(tick);
    });

    return {
        promise,
        cancel
    };
}

export function createInfiniteAbsoluteTicker(timeSpentHandler) {
    let needToCancel = false;

    const cancel = () => needToCancel = true;

    const promise = new Promise(resolve => {
        const timeGoesFrom = Date.now();

        const tick = () => {
            const now = Date.now();

            const timeSpent = now - timeGoesFrom;

            if (!needToCancel) {
                timeSpentHandler(timeSpent);
                requestAnimationFrame(tick)
            } else {
                resolve();
            }
        }

        requestAnimationFrame(tick);
    });

    return {
        promise,
        cancel
    };
}