import "./verticalBorder.css"
import {BorderMenu} from "./borderMenu";

/**
 * An item with a menu that appears when you hover over a table border vertically
 * @param {HTMLElement} table - Container where table is
 * @constructor
 */
export const VerticalBorder = function (table) {
    BorderMenu.call(this, table, {
        borderMenu: "TCM-border-menu--vertical",
        line1px: "TCM-border-menu__1pxline--vertical"
    });

    const self = this;

    /**
     * Make the entire element visible in the x coordinate in the horizontal
     * @param {number} x - coordinate
     */
    this.activateIn = function (x) {
        let halfWidth = Math.floor(Number.parseInt(getComputedStyle(self._elem).width) / 2);
        self._elem.style.left = (x - halfWidth) + "px";
        this.active();
    }
};

