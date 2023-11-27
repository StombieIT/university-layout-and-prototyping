import './index.scss';
import {createInfiniteAbsoluteTicker, createInfiniteTicker} from "@/utils/time";
import {StoreEvent, store} from "@/store";
import './userBlockOwner';
import {BlockOwner} from "@/models";
import {ARROW_ID, USER_OWNER_ID} from "@/constants";
import {createTnt} from "@/components/tnt";

const user = document.getElementById('user');
const field = document.getElementById('field');
const barrier = document.getElementById('barrier');
const arrow = document.getElementById('arrow');

const fieldRect = field.getBoundingClientRect();
const barrierRect = barrier.getBoundingClientRect();

// ### STATE ###
let angle = 0;
let userPosition = 0;

function onMouseMove(evt) {
    const userRect = user.getBoundingClientRect();

    const centerCoor = {
        x: userRect.left + userRect.width / 2,
        y: userRect.top + userRect.height / 2
    };

    const relativeCoordinate = {
        x: evt.clientX - centerCoor.x,
        y: centerCoor.y - evt.clientY
    };

    const tan = relativeCoordinate.y / relativeCoordinate.x;

    if (relativeCoordinate.x < 0) {
        angle = Math.atan(tan) - Math.PI;
    } else {
        angle = Math.atan(tan);
    }

    const arrow = document.getElementById(ARROW_ID);

    if (arrow) {
        arrow.style.transform = `translateX(60px) translateY(-50%) rotate(${- angle * 180 / Math.PI}deg)`;
    }
}

let isEnterDown = false;

function handleEnterDown() {
    if (!isEnterDown && store.state.blockOwner === BlockOwner.USER) {
        isEnterDown = true;
        let force = 0;

        const ticker = createInfiniteTicker(timeSpent => {
            force += timeSpent;
        });

        function onKeyUp() {
            ticker.cancel();
            window.removeEventListener('keyup', onKeyUp);
            isEnterDown = false;
        }

        ticker.promise.then(() => {
            store.blockOwner = undefined;
            const userRect = user.getBoundingClientRect();
            throwTnt({x: userRect.left - fieldRect.left + userRect.width / 2, y: userRect.top - fieldRect.top + userRect.height / 2}, force, angle, [
                barrier,
                document.getElementById('bonfire')
            ]);
        });

        window.addEventListener('keyup', onKeyUp);
    }
}

function isBumpedIntoTarget(objectMetrics, targetMetrics) {
    return objectMetrics.y + objectMetrics.height > targetMetrics.y &&
        objectMetrics.x + objectMetrics.width > targetMetrics.x &&
        objectMetrics.x < targetMetrics.x + targetMetrics.width;
}

window.addEventListener('keydown', evt => {
    if (evt.key === 'Enter') {
        handleEnterDown();
    } else if (evt.key === 'ArrowLeft' || evt.key === 'ArrowRight') {
        const SPEED = 0.5;
        const changePositionBy = evt.key === 'ArrowLeft' ? -1 : 1;
        const userRect = user.getBoundingClientRect();

        const ticker = createInfiniteTicker(timeSpent => {
            userPosition = Math.max(0, Math.min(barrierRect.left - fieldRect.left - userRect.width, userPosition + timeSpent * SPEED * changePositionBy));
            user.style.transform = `translateX(${userPosition}px)`;
        });

        function onKeyUp() {
            ticker.cancel();
            window.removeEventListener('keyup', onKeyUp);
        }

        window.addEventListener('keyup', onKeyUp);
    }
});

store.subscribe(StoreEvent.BLOCK_OWNER_CHANGE, () => {
    if (store.state.blockOwner) {
        window.addEventListener('mousemove', onMouseMove);
    } else {
        window.removeEventListener('mousemove', onMouseMove);
    }
})

store.blockOwner = BlockOwner.USER;

