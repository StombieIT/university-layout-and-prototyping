import {createInfiniteAbsoluteTicker, createInfiniteTicker} from "@/utils/time";
import config from "@/config";

const DOM_PARSER_INSTANCE = new DOMParser();

export function insertAll(selector, innerHtml) {
    Array.from(document.querySelectorAll(selector))
        .forEach(element => element.innerHTML = innerHtml);
}

export function insertAllByClass(className, innerHtml) {
    insertAll(`.${className}`, innerHtml);
}

export function convertToNode(str) {
    const doc = DOM_PARSER_INSTANCE.parseFromString(str, 'text/html');
    return doc.body.firstChild;
}

function isBumpedIntoTarget(objectMetrics, targetMetrics) {
    return objectMetrics.y + objectMetrics.height > targetMetrics.y &&
        objectMetrics.x + objectMetrics.width > targetMetrics.x &&
        objectMetrics.x < targetMetrics.x + targetMetrics.width;
}

export function throwTnt(field, tnt, tntInitialPosition, force, angle = Math.PI / 2, targets = []) {
    let needToStop = false;

    const stop = () => needToStop = true;

    tnt.style.left = tntInitialPosition.x;
    tnt.style.top = tntInitialPosition.y;

    const fieldRect = field.getBoundingClientRect();
    const tntRect = tnt.getBoundingClientRect();

    const tntSize = {
        width: tntRect.width,
        height: tntRect.height
    };

    const ticker = createInfiniteAbsoluteTicker(timeSpent => {
        if (needToStop) {
            ticker.cancel();
        }

        const timeSpentSeconds = timeSpent / 1000;

        const newCoordinate = {
            x: timeSpentSeconds * force * Math.cos(angle),
            y: - timeSpentSeconds * Math.sin(angle) * force + timeSpentSeconds * timeSpentSeconds * config.GRAVITY_ACCELERATION
        };

        const newRelativeToFieldMetrics = {
            ...tntSize,
            x: tntInitialPosition.x + newCoordinate.x,
            y: tntInitialPosition.y + newCoordinate.y
        };

        if (newRelativeToFieldMetrics.x < 0 || newRelativeToFieldMetrics.x > fieldRect.width - tntSize.width ||
            newRelativeToFieldMetrics.y < 0 || newRelativeToFieldMetrics.y > fieldRect.height - tntSize.height) {
            ticker.cancel();
        }

        for (const target of targets) {
            const targetRect = target.getBoundingClientRect();

            const targetMetrics = {
                x: targetRect.left - fieldRect.left,
                y: targetRect.top - fieldRect.top,
                width: targetRect.width,
                height: targetRect.height
            };

            if (isBumpedIntoTarget(newRelativeToFieldMetrics, targetMetrics)) {
                ticker.cancel(target);
            }
        }

        tnt.style.transform = `translate(${newCoordinate.x}px, ${newCoordinate.y}px)`;
    });

    return {
        stop,
        promise: ticker.promise
    };
}

export function moveToPosition(target, initialPosition, position, speed = config.COMPUTER_SPEED) {
    const delta = position - initialPosition;
    const deltaRatio = delta / Math.abs(delta);
    let currentPosition = initialPosition;

    const ticker = createInfiniteTicker(timeSpent => {
        if (Math.abs(currentPosition - position) < config.MOVEMENT_ERROR) {
            ticker.cancel();
            return;
        }
        currentPosition += timeSpent * deltaRatio * speed;
        target.style.left = currentPosition;
    });

    return ticker;
}

export function calculateTntFallPosition(tntInitialPosition, tntHeight, fieldHeight, force, angle) {
    return tntInitialPosition.x + (force * Math.sin(angle) + Math.sqrt((force * Math.sin(angle)) ** 2 - 4 * (tntInitialPosition.y - fieldHeight + tntHeight) * config.GRAVITY_ACCELERATION)) * force * Math.cos(angle) / (2 * config.GRAVITY_ACCELERATION);
}
