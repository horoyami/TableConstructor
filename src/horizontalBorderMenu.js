import {BorderMenu} from "./borderMenu.js";

export const HorizontalBorderMenu = function (table) {
    BorderMenu.call(this, table, ["TCM__border-menu_horizontal", "TCM__border-menu__1pxline_horizontal"]);

    const self = this;

    this.activeIn = function (y) {
        self._elem.style.top = y + "px";
        this.active();
    }
};
