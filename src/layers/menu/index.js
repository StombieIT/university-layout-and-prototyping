import './menu.scss';
import {store, StoreEvent} from '@/store';
import {ApplicationStage, CONTAINER_ID} from '@/constants';
import {convertToNode} from "@/utils/html";
import menu from "@/templates/menu.html";

function onMenuClick(evt) {
    if (evt.target.classList.contains('level')) {
        const levelNum = Number(evt.target.dataset.levelNum);

        if (levelNum <= store.state.userStats.stats.currentLevel) {
            switch (levelNum) {
                case 0:
                    store.applicationStage = ApplicationStage.FIRST_LEVEL;
                    break;
                case 1:
                    store.applicationStage = ApplicationStage.SECOND_LEVEL;
                    break;
                case 2:
                    store.applicationStage = ApplicationStage.THIRD_LEVEL;
                    break;
            }
        }
    }
}

function createMenu() {
    const element = convertToNode(menu);

    const levels = element.querySelectorAll('.level');

    Array.from(levels).forEach(level => {
        const levelNum = Number(level.dataset.levelNum);

        if (levelNum > store.state.userStats.stats.currentLevel) {
            level.classList.add('__inactive');
        }
    })

    element.addEventListener('click', onMenuClick);

    function dispose () {
        element.removeEventListener('click', onMenuClick);
    }

    return {
        element,
        dispose
    };
}

let currentMenu;

store.subscribe(StoreEvent.APPLICATION_STATE_CHANGE, () => {
    if (store.state.applicationStage === ApplicationStage.MENU) {
        currentMenu = createMenu();
        document.getElementById(CONTAINER_ID)
            .appendChild(currentMenu.element);
    } else if (currentMenu) {
        currentMenu.dispose();
        currentMenu.element.remove();
        currentMenu = undefined;
    }
});