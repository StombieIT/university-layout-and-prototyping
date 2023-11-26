import {store, StoreEvent} from '@/store';
import {ApplicationStage, CONTAINER_ID} from '@/constants';
import {convertToNode} from '@/utils/html';
import firstLevel from '@/templates/first-level.html'
import {createUserMovementListener} from "@/game/listeners";
import config from '@/config';

let field;
let user;
let barrier;

function createFirstLevel() {
    const element = convertToNode(firstLevel);

    field = element;

    user = element.querySelector('#user');
    const userImg = user.querySelector('img');

    userImg.src = 'steve.webp';
    userImg.alt = 'user';

    barrier = element.querySelector('.barrier');
    const blocks = barrier.querySelectorAll('.mine-block');

    blocks
        .forEach(block => {
            block.src = './wood.png';
            block.alt = 'wood';
        });

    const userMovementListener = createUserMovementListener(config.USER_SPEED, field, user, barrier);

    window.addEventListener('keydown', userMovementListener);

    function dispose () {
        window.removeEventListener('keydown', userMovementListener);
    }

    return {
        element,
        dispose
    };
}

let currentFirstLevel;

store.subscribe(StoreEvent.APPLICATION_STATE_CHANGE, () => {
    if (store.state.applicationStage === ApplicationStage.FIRST_LEVEL) {
        currentFirstLevel = createFirstLevel();
        document.getElementById(CONTAINER_ID)
            .appendChild(currentFirstLevel.element);
    } else if (currentFirstLevel) {
        currentFirstLevel.dispose();
        currentFirstLevel.element.remove();
        currentFirstLevel = undefined;
    }
});