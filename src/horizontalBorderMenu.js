import {BorderMenu} from "./borderMenu.js";

export let HorizontalBorderMenu = function (table) {
    BorderMenu.call(this, table, ["TCM__border-menu_horizontal", "TCM__border-menu__1pxline_horizontal"]);

    let self = this;

    this.activeIn = function (y) {
        self._elem.style.top = y + "px";
        this.active();
    }
};
