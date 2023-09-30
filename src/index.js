import "./index.scss";
import "./image.scss";

import notificationsIcon from "@assets/notifications.svg";
import starIcon from "@assets/star.svg";
import playIcon from "@assets/play.svg";
import arrowLeftIcon from "@assets/arrow_left.svg";
import arrowRightIcon from "@assets/arrow_right.svg";

import { insertAllByClass } from "@utils/html";

insertAllByClass("js-notifications", notificationsIcon);
insertAllByClass("js-star", starIcon);
insertAllByClass("js-play", playIcon);
insertAllByClass("js-arrow-left", arrowLeftIcon);
insertAllByClass("js-arrow-right", arrowRightIcon);