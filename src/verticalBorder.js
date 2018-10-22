import {BorderMenu} from "./borderMenu.js";

export let VerticalBorder = function (table) {
    BorderMenu.call(this, table, ["TCM__border-menu_vertical", "TCM__border-menu__1pxline_vertical"]);

    let self = this;

    this.activeIn = function (x) {
        self._elem.style.left = x + "px";
        this.active();
    }
};
