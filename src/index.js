import "./index.scss";
import "./image.scss";

import notificationsIcon from "@assets/notifications.svg";
import starIcon from "@assets/star.svg";
import playIcon from "@assets/play.svg";
import arrowLeftIcon from "@assets/arrow_left.svg";
import arrowRightIcon from "@assets/arrow_right.svg";
import moreIcon from "@assets/more.svg";
import addIcon from "@assets/add.svg";
import sendIcon from "@assets/send.svg";
import instagramIcon from "@assets/instagram.svg";
import facebookIcon from "@assets/facebook.svg";
import vkIcon from "@assets/vk.svg";
import menuIcon from "@assets/menu.svg";

import { insertAllByClass } from "@utils/html";

insertAllByClass("js-notifications", notificationsIcon);
insertAllByClass("js-star", starIcon);
insertAllByClass("js-play", playIcon);
insertAllByClass("js-arrow-left", arrowLeftIcon);
insertAllByClass("js-arrow-right", arrowRightIcon);
insertAllByClass("js-more", moreIcon);
insertAllByClass("js-add", addIcon);
insertAllByClass("js-send", sendIcon);
insertAllByClass("js-instagram", instagramIcon);
insertAllByClass("js-facebook", facebookIcon);
insertAllByClass("js-vk", vkIcon);
insertAllByClass("js-menu", menuIcon);