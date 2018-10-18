import {Border} from "./Border.js";

export let HorBorder = function (table) {
    Border.call(this, table, ["hb-hor_wrapper", "hb-hor"]);

    let self = this;

    this.activeIn = function (y) {
        self._elem.style.top = y + "px";
        this.active();
    }
};
