import {BorderMenu} from "./borderMenu.js";

export const VerticalBorder = function (table) {
    BorderMenu.call(this, table, ["TCM__border-menu_vertical", "TCM__border-menu__1pxline_vertical"]);

    const self = this;

    this.activeIn = function (x) {
        self._elem.style.left = x + "px";
        this.active();
    }
};
