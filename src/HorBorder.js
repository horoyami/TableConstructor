import {Border} from "./Border.js";

export let HorBorder = function (table) {
    Border.call(this, table);

    let elem = document.createElement("div");
    console.log(elem);
    elem.classList.add("hb-bor", "hb-hor");
};

/// TODO не готово