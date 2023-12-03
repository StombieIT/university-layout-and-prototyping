import './menu.scss';
import {store, StoreEvent} from '@/store';
import {ApplicationStage, CONTAINER_ID} from '@/constants';
import {convertToNode} from "@/utils/html";
import ratingTemplate from "@/templates/rating.html";
import menu from "@/templates/menu.html";
import {getWholeStats} from "@/utils/storage";
import config from "@/config";
import {createRatingStat} from "@/components/ratingStat";

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
    });

    const rating = convertToNode(ratingTemplate);
    Object.entries(getWholeStats())
        .sort(([, stats1], [, stats2]) => stats2.points - stats1.points)
        .slice(config)
        .forEach(([login, {points}]) => rating.appendChild(createRatingStat({login, points})));

    element.appendChild(rating);

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