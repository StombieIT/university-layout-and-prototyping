import {createInfiniteTicker} from "@/utils/time";
import config from "@/config";

export function createUserMovementListener(speed, field, user, barrier) {
    let pressed = false;

    return function (evt) {
        if ((evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') && !pressed) {
            pressed = true;
            const userRect = user.getBoundingClientRect();
            const fieldRect = field.getBoundingClientRect();
            const barrierRect = barrier.getBoundingClientRect();
            let userPosition = userRect.left - fieldRect.left;
            const changePositionDirectionRatio = evt.key === 'ArrowLeft' ? -1 : 1;

            const ticker = createInfiniteTicker(timeSpent => {
                userPosition = Math.max(
                    0,
                    Math.min(
                        barrierRect.left - fieldRect.left - userRect.width,
                        userPosition + timeSpent * speed * changePositionDirectionRatio
                    )
                );
                console.log(Math.min(
                    barrierRect.left - fieldRect.left - userRect.width,
                    userPosition + timeSpent * speed * changePositionDirectionRatio
                ));
                user.style.transform = `translateX(${userPosition}px)`;
            });

            function onKeyUp() {
                ticker.cancel();
                pressed = false;
                window.removeEventListener('keyup', onKeyUp);
            }

            window.addEventListener('keyup', onKeyUp);
        }
    };
}

export function createUserArrowListener(state, user, arrow) {
    return function (evt) {
        const userRect = user.getBoundingClientRect();

        const userCenterCoordinate = {
            x: userRect.left + userRect.width / 2,
            y: userRect.top + userRect.height / 2
        };

        const relativeCoordinate = {
            x: evt.clientX - userCenterCoordinate.x,
            y: userCenterCoordinate.y - evt.clientY
        };

        const tan = relativeCoordinate.y / relativeCoordinate.x;

        if (relativeCoordinate.x < 0) {
            state.angle = Math.atan(tan) - Math.PI;
        } else {
            state.angle = Math.atan(tan);
        }

        arrow.style.transform = `translateX(60px) translateY(-50%) rotate(${- state.angle * 180 / Math.PI}deg)`;
    };
}

export function createForceListener(store, onForceSet, speed = config.FORCE.SPEED.SLOW) {
    let isEnterPressed = false;

    return function (evt) {
        if (evt.key === 'Enter' && !isEnterPressed) {
            isEnterPressed = true;
            store.force = config.FORCE.MIN;

            let forceChangeRatio = 1;
            const ticker = createInfiniteTicker(timeSpent => {
                const forceChange = timeSpent * forceChangeRatio * speed;
                if (store.state.force + forceChange > config.FORCE.MAX ||
                    store.state.force + forceChange < config.FORCE.MIN) {
                    forceChangeRatio = -forceChangeRatio;
                } else {
                    store.force = store.state.force + forceChange;
                }
            });

            function onKeyUp() {
                ticker.cancel();
                window.removeEventListener('keyup', onKeyUp);
                isEnterPressed = false;
            }

            ticker.promise.then(onForceSet);

            window.addEventListener('keyup', onKeyUp);
        }
    }
}
