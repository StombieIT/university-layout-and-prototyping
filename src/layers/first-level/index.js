import './menu.scss';
import {store, StoreEvent} from '@/store';
import {ApplicationStage, CONTAINER_ID} from '@/constants';
import {convertToNode} from "@/utils/html";
import menu from "@/templates/menu.html";

function createMenu() {
    const element = convertToNode(menu);

    function dispose () {
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
    } else {
        if (currentMenu) {
            currentMenu.dispose();
            currentMenu.element.remove();
            currentMenu = undefined;
        }
    }
});