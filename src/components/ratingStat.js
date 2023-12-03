import ratingStatTemplate from "@/templates/rating-stat.html";
import {convertToNode} from "@/utils/html";

export const createRatingStat = ({login, points}) => {
    const ratingStat = convertToNode(ratingStatTemplate);

    ratingStat.querySelector(".login").innerText = login;
    ratingStat.querySelector(".points").innerText = points;

    return ratingStat;
}