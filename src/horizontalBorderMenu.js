import {BorderMenu} from "./borderMenu.js";

/**
 * An item with a menu that appears when you hover over a table border horizontally
 * @param table - Container where table is
 * @constructor
 */
export const HorizontalBorderMenu = function (table) {
    BorderMenu.call(this, table, {
        borderMenu: "TCM-border-menu--horizontal",
        line1px: "TCM-border-menu__1pxline--horizontal"
    });

    const self = this;

    /**
     * Make the entire element visible in the y coordinate in the vertical
     * @param y - coordinate
     */
    this.activeIn = function (y) {
        let halfHeight = Math.floor(Number.parseInt(getComputedStyle(self._elem).height) / 2);
        self._elem.style.top = (y - halfHeight) + "px";
        this.active();
    }
};