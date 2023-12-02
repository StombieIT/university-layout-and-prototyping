import {store, StoreEvent} from '@/store';
import {ApplicationStage, CONTAINER_ID} from '@/constants';
import {convertToNode, throwTnt} from '@/utils/html';
import firstLevel from '@/templates/first-level.html'
import messageTemplate from '@/templates/message.html';
import {createForceListener, createUserArrowListener, createUserMovementListener} from "@/game/listeners";
import config from '@/config';
import {randomInt} from "@/utils/random";
import {GameStore, GameStoreEvent, TntOwner} from "@/store/game-store";
import {createTnt} from "@/components/tnt";
import {createArrow} from "@/components/arrow";
import forceBarTemplate from "@/templates/force-bar.html";
import {convertToTimeLeftRepresentation, createInfiniteTicker} from "@/utils/time";

let field;
let fieldRect;
let user;
let barrier;
let barrierRect;
let bonfire;
let tnt;
let arrow;
let rightPanel;
let timeLeft;
let attemptsLeft;
let hitsLeft;

const gameStore = new GameStore({
    angle: 0
});

let message;
let endGameScheduler;

function endGameWithMessage(messageText) {
    gameStore.tntOwner = undefined;
    if (!message) {
        message = convertToNode(messageTemplate);
        rightPanel.appendChild(message);
    }

    message.innerText = messageText;

    if (!endGameScheduler) {
        clearTimeout(endGameScheduler);
    }

    endGameScheduler = setTimeout(
        () => {
            message = undefined;
            store.applicationStage = ApplicationStage.MENU;
        },
        config.END_GAME_DELAY
    );
}

function moveBonfireToRandomPosition() {
    const bonfirePosition = randomInt(
        barrierRect.left + barrierRect.width,
        fieldRect.width - bonfire.getBoundingClientRect().width
    );

    bonfire.style.left = `${bonfirePosition}px`;
}

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

function onTimeLeftChange() {
    timeLeft.innerText = convertToTimeLeftRepresentation(gameStore.state.timeLeft);

    if (gameStore.state.timeLeft === 0) {
        endGameWithMessage('Время вышло!');
    }
}

function onAttemptsLeftChange() {
    attemptsLeft.innerText = gameStore.state.attemptsLeft;

    if (gameStore.state.attemptsLeft >= gameStore.state.hitsLeft) {
        gameStore.tntOwner = TntOwner.USER;
    } else {
        endGameWithMessage('Попытки закончились!');
    }
}

function onHitsLeftChange() {
    hitsLeft.innerText = gameStore.state.hitsLeft;

    if (gameStore.state.hitsLeft === 0) {
        endGameWithMessage('Уровень пройден!');
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
            const tntInitialPosition = {
                x: userRect.left - fieldRect.left + userRect.width / 2 - tntRect.width / 2,
                y: userRect.top - fieldRect.top + userRect.height / 2 - tntRect.height / 2
            };
            // TODO: обработать закрытие
            throwTnt(field, tnt, tntInitialPosition, gameStore.state.force, gameStore.state.angle, [barrier, bonfire])
                .promise
                .then(target => {
                    tnt.remove();
                    tnt = undefined;
                    if (target === bonfire) {
                        gameStore.hitsLeft = gameStore.state.hitsLeft - 1;
                    }
                    gameStore.attemptsLeft = gameStore.state.attemptsLeft - 1;
                });
            gameStore.force = undefined;
        });
        window.addEventListener('mousemove', userArrowListener);
        window.addEventListener('keydown', userForceListener);
    } else {
        window.removeEventListener('keydown', userForceListener);
        window.removeEventListener('mousemove', userArrowListener);
        userForceListener = undefined;
        userArrowListener = undefined;
        if (tnt) {
            tnt.remove();
            tnt = undefined;
        }
        if (arrow) {
            arrow.remove();
            arrow = undefined;
        }
    }
}

function createFirstLevel() {
    const element = convertToNode(firstLevel);

    field = element.querySelector('#field');

    user = element.querySelector('#user');
    const userImg = user.querySelector('img');


    rightPanel = element.querySelector('#right-panel');
    timeLeft = element.querySelector('#time-left');
    attemptsLeft = element.querySelector('#attempts-left');
    hitsLeft = element.querySelector('#hits-left');

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
    gameStore.subscribe(GameStoreEvent.TIME_LEFT_CHANGE, onTimeLeftChange);
    gameStore.subscribe(GameStoreEvent.HITS_LEFT_CHANGE, onHitsLeftChange);
    gameStore.subscribe(GameStoreEvent.ATTEMPTS_LEFT_CHANGE, onAttemptsLeftChange);
    window.addEventListener('keydown', userMovementListener);
    gameStore.timeLeft = config.TIME_LEFT.A_LOT;
    gameStore.hitsLeft = config.HITS.A_LOT;
    gameStore.attemptsLeft = config.ATTEMPTS.A_LOT;

    const timeTicker = createInfiniteTicker(timeSpent => {
        gameStore.timeLeft = Math.max(0, gameStore.state.timeLeft - timeSpent);
        if (gameStore.state.timeLeft === 0) {
            timeTicker.cancel();
        }
    });

    function dispose () {
        window.removeEventListener('mousemove', userArrowListener);
        window.removeEventListener('keydown', userMovementListener);
        // if (gameStore.state.tntOwner) {
        //     gameStore.tntOwner = undefined;
        // }
        timeTicker.cancel();
        gameStore.unsubscribe(GameStoreEvent.TIME_LEFT_CHANGE, onTimeLeftChange);
        gameStore.unsubscribe(GameStoreEvent.ATTEMPTS_LEFT_CHANGE, onAttemptsLeftChange);
        gameStore.unsubscribe(GameStoreEvent.HITS_LEFT_CHANGE, onHitsLeftChange);
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

        moveBonfireToRandomPosition();
    } else if (currentFirstLevel) {
        currentFirstLevel.dispose();
        currentFirstLevel.element.remove();
        currentFirstLevel = undefined;
    }
});