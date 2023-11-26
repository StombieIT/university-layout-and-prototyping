import {createInfiniteTicker} from "@/utils/time";

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
