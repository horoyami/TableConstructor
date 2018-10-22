import {BorderMenu} from "./borderMenu.js";

/**
 * An item with a menu that appears when you hover over a table border vertically
 * @param table - Container where table is
 * @constructor
 */
export const VerticalBorder = function (table) {
    BorderMenu.call(this, table, ["TCM__border-menu_vertical", "TCM__border-menu__1pxline_vertical"]);

    const self = this;

    /**
     * Make the entire element visible in the x coordinate in the horizontal
     * @param x - coordinate
     */
    this.activeIn = function (x) {
        self._elem.style.left = x + "px";
        this.active();
    }
};
