import {store, StoreEvent} from '@/store';
import {ApplicationStage, CONTAINER_ID} from '@/constants';
import {calculateTntFallPosition, convertToNode, moveToPosition, throwTnt} from '@/utils/html';
import thirdLevel from '@/templates/third-level.html';
import messageTemplate from '@/templates/message.html';
import {createForceListener, createUserArrowListener, createUserMovementListener} from "@/game/listeners";
import config from '@/config';
import {GameStore, GameStoreEvent, TntOwner} from "@/store/game-store";
import {createTnt} from "@/components/tnt";
import {createArrow} from "@/components/arrow";
import forceBarTemplate from "@/templates/force-bar.html";
import {convertToTimeLeftRepresentation, createInfiniteTicker} from "@/utils/time";
import {controller} from "@/store/controller";
import {randomInt} from "@/utils/random";

let field;
let fieldRect;
let user;
let barrier;
let barrierRect;
let computer;
let tnt;
let arrow;
let rightPanel;
let timeLeft;
let attemptsLeft;
let hitsLeft;
let points;

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

function onQuit() {
    endGameWithMessage('Игра окончена!');
}

function reset() {
    gameStore.timeLeft = config.TIME_LEFT.A_LOT;
    gameStore.hitsLeft = config.HITS.A_LOT;
    gameStore.attemptsLeft = config.HITS.A_LOT;
    gameStore.points = 0;
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

    if (gameStore.state.attemptsLeft === 0) {
        endGameWithMessage('Уровень не пройден!');
    } else {
        gameStore.tntOwner = TntOwner.USER;
    }
}

function onHitsLeftChange() {
    hitsLeft.innerText = gameStore.state.hitsLeft;

    const pointsToAdd = Math.round(config.POINTS_RATIO.A_LOT * (gameStore.state.attemptsLeft + 1) * gameStore.state.timeLeft / 1000);
    if (!gameStore.state.points) {
        gameStore.points = pointsToAdd;
    } else {
        gameStore.points = gameStore.state.points + pointsToAdd;
    }

    if (gameStore.state.hitsLeft === 0) {
        // controller.addPoints(gameStore.state.points);
        endGameWithMessage('Уровень пройден!');
    } else {
        gameStore.tntOwner = TntOwner.USER;
    }
}

function onPointsChange() {
    points.innerText = gameStore.state.points ?? '';
}

let computerTnt;

function onBlockOwnerChangeToComputer() {
    if (gameStore.state.tntOwner === TntOwner.COMPUTER) {
        computerTnt = createTnt({});
        field.appendChild(computerTnt);

        const computerRect = computer.getBoundingClientRect();
        const computerTntRect = computerTnt.getBoundingClientRect();
        const computerTntInitialPosition = {
            x: computerRect.left - fieldRect.left + computerRect.width / 2 - computerTntRect.width / 2,
            y: computerRect.top - fieldRect.top + computerRect.height / 2 - computerTntRect.height / 2
        };

        const params = [field, computerTnt,
            computerTntInitialPosition, 5 * (config.FORCE.MIN + config.FORCE.MAX) / 6, randomInt(Math.PI / 2, 3 * Math.PI / 4), [
                user,
                barrier
            ]];

        throwTnt(...params).promise.then(target => {
            if (target === user) {
                gameStore.tntOwner = TntOwner.USER;
            } else {
                gameStore.hitsLeft = gameStore.state.hitsLeft - 1;
            }
            // gameStore.tntOwner = TntOwner.USER;
        });
    } else {
        if (computerTnt) {
            computerTnt.remove();
            computerTnt = undefined;
        }
    }
}

let userArrowListener;
let userForceListener;

function onBlockOwnerChangeToUser() {
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
            throwTnt(field, tnt, tntInitialPosition, gameStore.state.force, gameStore.state.angle, [
                barrier,
                computer
            ])
                .promise
                .then(target => {
                    tnt.remove();
                    tnt = undefined;
                    if (target === computer) {
                        gameStore.tntOwner = TntOwner.COMPUTER;
                    } else {
                        gameStore.attemptsLeft = gameStore.state.attemptsLeft - 1;
                    }
                    // if (target === computer) {
                    //     gameStore.tntOwner = TntOwner.COMPUTER;
                    // } else {
                    //     gameStore.tntOwner = TntOwner.USER;
                    // }
                    // tnt.remove();
                    // tnt = undefined;
                    // gameStore.attemptsLeft = gameStore.state.attemptsLeft - 1;
                    // if (target === computer) {
                    //     gameStore.hitsLeft = gameStore.state.hitsLeft - 1;
                    // }
                });

            const tntFallPosition = calculateTntFallPosition(
                tntInitialPosition,
                tntRect.height, fieldRect.height,
                gameStore.state.force, gameStore.state.angle
            );

            const computerRect = computer.getBoundingClientRect();
            const computerInitialPosition = computerRect.left - fieldRect.left;

            const computerPosition = Math.max(
                barrierRect.left + barrierRect.width,
                Math.min(
                    tntFallPosition,
                    fieldRect.width - computerRect.width
                )
            );

            moveToPosition(computer, computerInitialPosition, computerPosition);

            gameStore.force = undefined;
        });
        window.addEventListener('mousemove', userArrowListener);
        window.addEventListener('keydown', userForceListener);
    } else {
        if (userForceListener) {
            window.removeEventListener('keydown', userForceListener);
            userForceListener = undefined;
        }
        if (userArrowListener) {
            window.removeEventListener('mousemove', userArrowListener);
            userArrowListener = undefined;
        }
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

function createThirdLevel() {
    const element = convertToNode(thirdLevel);

    const steveImgs = element.querySelectorAll('img.steve');

    Array.from(steveImgs).forEach(steve => {
        console.log('steves', steve)
        steve.src = 'steve.webp';
        steve.alt = 'steve';
    });

    field = element.querySelector('#field');

    user = element.querySelector('#user');

    computer = element.querySelector('#computer');

    rightPanel = element.querySelector('#right-panel');
    timeLeft = element.querySelector('#time-left');
    attemptsLeft = element.querySelector('#attempts-left');
    hitsLeft = element.querySelector('#hits-left');
    points = element.querySelector('#points');
    barrier = element.querySelector('.barrier');

    const blocks = barrier.querySelectorAll('.mine-block');

    Array.from(blocks)
        .forEach(block => {
            block.src = './wood.png';
            block.alt = 'wood';
        });

    const userMovementListener = createUserMovementListener(config.USER_SPEED, field, user, barrier);

    gameStore.subscribe(GameStoreEvent.TNT_OWNER_CHANGE, onBlockOwnerChangeToUser);
    gameStore.subscribe(GameStoreEvent.TNT_OWNER_CHANGE, onBlockOwnerChangeToComputer);
    gameStore.subscribe(GameStoreEvent.FORCE_CHANGE, onForceChange);
    gameStore.subscribe(GameStoreEvent.TIME_LEFT_CHANGE, onTimeLeftChange);
    gameStore.subscribe(GameStoreEvent.ATTEMPTS_LEFT_CHANGE, onAttemptsLeftChange);
    gameStore.subscribe(GameStoreEvent.HITS_LEFT_CHANGE, onHitsLeftChange);
    gameStore.subscribe(GameStoreEvent.POINTS_CHANGE, onPointsChange);
    window.addEventListener('keydown', userMovementListener);
    reset();

    const timeTicker = createInfiniteTicker(timeSpent => {
        gameStore.timeLeft = Math.max(0, gameStore.state.timeLeft - timeSpent);
        if (gameStore.state.timeLeft === 0) {
            timeTicker.cancel();
        }
    });

    function dispose () {
        timeTicker.cancel();
        window.removeEventListener('keydown', userMovementListener);
        gameStore.unsubscribe(GameStoreEvent.POINTS_CHANGE, onPointsChange);
        gameStore.unsubscribe(GameStoreEvent.TIME_LEFT_CHANGE, onTimeLeftChange);
        gameStore.unsubscribe(GameStoreEvent.ATTEMPTS_LEFT_CHANGE, onAttemptsLeftChange);
        gameStore.unsubscribe(GameStoreEvent.HITS_LEFT_CHANGE, onHitsLeftChange);
        gameStore.unsubscribe(GameStoreEvent.TNT_OWNER_CHANGE, onBlockOwnerChangeToComputer);
        gameStore.unsubscribe(GameStoreEvent.TNT_OWNER_CHANGE, onBlockOwnerChangeToUser);
        gameStore.unsubscribe(GameStoreEvent.FORCE_CHANGE, onForceChange);
    }

    return {
        element,
        dispose
    };
}

let currentThirdLevel;

store.subscribe(StoreEvent.APPLICATION_STATE_CHANGE, () => {
    if (store.state.applicationStage === ApplicationStage.THIRD_LEVEL) {
        currentThirdLevel = createThirdLevel();
        document.getElementById(CONTAINER_ID)
            .appendChild(currentThirdLevel.element);

        fieldRect = field.getBoundingClientRect();
        barrierRect = barrier.getBoundingClientRect();
        computer.style.left = randomInt(
            barrierRect.left + barrierRect.width,
                fieldRect.width - computer.getBoundingClientRect().width
        );
    } else if (currentThirdLevel) {
        currentThirdLevel.dispose();
        currentThirdLevel.element.remove();
        currentThirdLevel = undefined;
    }
});