import {Border} from "./Border.js";

export let VerBorder = function (table) {
    Border.call(this, table, ["vb-ver_wrapper", "vb-ver"]);

    let self = this;

    this.activeIn = function (x) {
        self._elem.style.left = x + "px";
        this.active();
    }
};
