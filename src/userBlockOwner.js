import {StoreEvent, store} from "@/store";
import {BlockOwner} from "@/models";
import {createTnt} from "@/components/tnt";
import {USER_OWNER_ID} from "@/constants";
import {createArrow} from "@/components/arrow";

let tnt;
let arrow;

store.subscribe(StoreEvent.BLOCK_OWNER_CHANGE, () => {
    if (store.state.blockOwner === BlockOwner.USER) {
        const userOwner = document.getElementById(USER_OWNER_ID);
        if (userOwner) {
            tnt = createTnt({ isActive: true });
            arrow = createArrow();
            userOwner.append(
                tnt,
                arrow
            );
        }
    } else {
        tnt.remove();
        tnt = undefined;
        arrow.remove();
        arrow = undefined;
    }
});