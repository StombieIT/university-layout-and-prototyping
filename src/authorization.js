import './authorization.scss';
import {store, StoreEvent} from '@/store';
import {ApplicationStage, CONTAINER_ID} from './constants';
import authorizationPopup from './templates/authorization-popup.html'
import {convertToNode} from "@/utils/html";
import {controller} from "@/store/controller";

let login;

function onLoginFieldInput(evt) {
    login = evt.target.value;
}

function onLoginSubmitClick(evt) {
    controller.login = login;
    store.applicationStage = ApplicationStage.MENU;
}

function createAuthorizationPopup() {
    const element = convertToNode(authorizationPopup);

    const loginField = element.querySelector('#login-field');
    const loginSubmit = element.querySelector('#login-submit');

    login = loginField.value;

    loginField.addEventListener('input', onLoginFieldInput);
    loginSubmit.addEventListener('click', onLoginSubmitClick);

    function dispose () {
        loginSubmit.removeEventListener('click', onLoginSubmitClick);
        loginField.removeEventListener('input', onLoginFieldInput);
    }

    return {
        element,
        dispose
    };
}

let currentAuthorizationPopup;

store.subscribe(StoreEvent.APPLICATION_STATE_CHANGE, () => {
    if (store.state.applicationStage === ApplicationStage.AUTHORIZATION) {
        currentAuthorizationPopup = createAuthorizationPopup();
        document.getElementById(CONTAINER_ID)
            .appendChild(currentAuthorizationPopup.element);
   } else if (currentAuthorizationPopup) {
        currentAuthorizationPopup.dispose();
        currentAuthorizationPopup.element.remove();
        currentAuthorizationPopup = undefined;
   }
});