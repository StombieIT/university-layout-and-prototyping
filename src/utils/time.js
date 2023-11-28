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
    let cancelValue;

    const cancel = value => {
        needToCancel = true;
        cancelValue = value;
    };

    const promise = new Promise(resolve => {
        const timeGoesFrom = Date.now();

        const tick = () => {
            const now = Date.now();

            const timeSpent = now - timeGoesFrom;

            if (!needToCancel) {
                timeSpentHandler(timeSpent);
                requestAnimationFrame(tick)
            } else {
                resolve(cancelValue);
            }
        }

        requestAnimationFrame(tick);
    });

    return {
        promise,
        cancel
    };
}

export function convertToTimeLeftRepresentation(timeMillis) {
    const timeSeconds = Math.round(timeMillis / 1000);

    const secondsLeftRepresentation = (timeSeconds % 60).toString().padStart(2, '0');
    const minutesLeftRepresentation = Math.floor(timeSeconds / 60).toString().padStart(2, '0');

    return `${minutesLeftRepresentation}:${secondsLeftRepresentation}`;
}
