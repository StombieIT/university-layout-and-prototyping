import {store, StoreEvent} from '@/store';
import {ApplicationStage, CONTAINER_ID} from '@/constants';
import {convertToNode, throwTnt} from '@/utils/html';
import firstLevel from '@/templates/first-level.html'
import {createForceListener, createUserArrowListener, createUserMovementListener} from "@/game/listeners";
import config from '@/config';
import {randomInt} from "@/utils/random";
import {GameStore, GameStoreEvent, TntOwner} from "@/store/game-store";
import {createTnt} from "@/components/tnt";
import {createArrow} from "@/components/arrow";
import forceBarTemplate from "@/templates/force-bar.html";

let field;
let fieldRect;
let user;
let barrier;
let barrierRect;
let bonfire;
let tnt;
let arrow;

const gameStore = new GameStore({
    angle: 0
});

let forceBar;
let progress;

function onForceChange() {
    if (gameStore.state.force) {
        if (!forceBar) {
            forceBar = convertToNode(forceBarTemplate);
            progress = forceBar.querySelector('.progress');
            field.appendChild(forceBar);
        }
        const forceProgress = (gameStore.state.force - config.FORCE.MIN) * 100 / (config.FORCE.MAX - config.FORCE.MIN);
        console.log(forceProgress);
        progress.style.transform = `translateX(${forceProgress - 100}%)`;
    } else {
        forceBar.remove();
        forceBar = undefined;
        progress = undefined;
    }
}


let userArrowListener;
let userForceListener;

function onBlockOwnerChange() {
    if (gameStore.state.tntOwner === TntOwner.USER) {
        tnt = createTnt({isActive: true});
        arrow = createArrow();
        user.appendChild(tnt);
        user.appendChild(arrow);
        userArrowListener = createUserArrowListener(gameStore.state, user, arrow);
        userForceListener = createForceListener(gameStore, () => {
            gameStore.tntOwner = undefined;
            const userRect = user.getBoundingClientRect();
            tnt = createTnt({});
            field.appendChild(tnt);
            const tntRect = tnt.getBoundingClientRect();
            tnt.style.left = userRect.left - fieldRect.left + userRect.width / 2 - tntRect.width / 2;
            tnt.style.top = userRect.top - fieldRect.top + userRect.height / 2 - tntRect.height / 2;
            console.log(tnt.getBoundingClientRect().left - fieldRect.left);
            // TODO: обработать закрытие
            // throwTnt(field, tnt, gameStore.state.force, gameStore.state.angle, [barrier, bonfire]);
        });
        window.addEventListener('mousemove', userArrowListener);
        window.addEventListener('keydown', userForceListener);
    } else {
        window.removeEventListener('keydown', userForceListener);
        window.removeEventListener('mousemove', userArrowListener);
        userForceListener = undefined;
        userArrowListener = undefined;
        tnt.remove();
        arrow.remove();
        tnt = undefined;
        arrow = undefined;
    }
}

function createFirstLevel() {
    const element = convertToNode(firstLevel);

    field = element;

    user = element.querySelector('#user');
    const userImg = user.querySelector('img');

    userImg.src = 'steve.webp';
    userImg.alt = 'user';

    barrier = element.querySelector('.barrier');
    const blocks = barrier.querySelectorAll('.mine-block');

    bonfire = element.querySelector('#bonfire');
    bonfire.src = './bonfire.webp';
    bonfire.alt = 'bonfire';

    blocks
        .forEach(block => {
            block.src = './wood.png';
            block.alt = 'wood';
        });

    const userMovementListener = createUserMovementListener(config.USER_SPEED, field, user, barrier);

    gameStore.subscribe(GameStoreEvent.TNT_OWNER_CHANGE, onBlockOwnerChange);
    gameStore.subscribe(GameStoreEvent.FORCE_CHANGE, onForceChange);
    window.addEventListener('keydown', userMovementListener);
    gameStore.tntOwner = TntOwner.USER;

    function dispose () {
        window.removeEventListener('mousemove', userArrowListener);
        window.removeEventListener('keydown', userMovementListener);
        gameStore.tntOwner = undefined;
        gameStore.unsubscribe(GameStoreEvent.TNT_OWNER_CHANGE, onBlockOwnerChange);
        gameStore.unsubscribe(GameStoreEvent.FORCE_CHANGE, onForceChange);
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

        fieldRect = field.getBoundingClientRect();
        barrierRect = barrier.getBoundingClientRect();

        const bonfirePosition = randomInt(
            barrierRect.left + barrierRect.width,
            fieldRect.width - bonfire.getBoundingClientRect().width
        );

        bonfire.style.left = `${bonfirePosition}px`;
    } else if (currentFirstLevel) {
        currentFirstLevel.dispose();
        currentFirstLevel.element.remove();
        currentFirstLevel = undefined;
    }
});