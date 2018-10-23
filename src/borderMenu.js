import {DOM} from "./documentUtils";

/**
 * An item with a menu that appears when you hover over a table border
 * @param table - Container where table is
 * @param classes - Css classes for the element and 1pxline inside
 * @constructor
 */
export const BorderMenu = function (table, classes) {
    const self = this;

    /**
     * Generates a menu button to add rows and columns.
     * @private
     */
    function _generateAddButton() {
        self._addButton = DOM.createDOMElement("img", ["TCM-border-menu__add-button"], {
            src: "./src/img/plus.svg",
            alt: "Add"
        });
        self._addButton.addEventListener("click", (event) => {
            table.dispatchEvent(new CustomEvent("addButtonClick", {
                "detail": {
                    "x": event.pageX,
                    "y": event.pageY
                }
            }));
        });
    }

    /**
     * Generates the main component of the class
     * @private
     */
    function _generateBorderMenu() {
        self._elem = DOM.createDOMElement("div", [classes.borderMenu, "TCM-border-menu--hidden"], null, [self._addButton, self._border]);
        self._elem.addEventListener("mousemove", (event) => {
            event.stopPropagation();
        })
    }

    /**
     * Generates line which сover border of table
     * @private
     */
    function _generate1pxLine() {
        self._border = DOM.createDOMElement("div", ["TCM-border-menu", classes.line1px]);
    }

    /**
     * Runs all generators and initializes the class
     * @private
     */
    function _init() {
        _generateAddButton();
        _generate1pxLine();
        _generateBorderMenu();
        table.appendChild(self._elem);
    }

    _init();

    /**
     * Make the entire item invisible
     */
    this.hide = function () {
        self._elem.classList.add("TCM-border-menu--hidden");
    };

    /**
     * Make the entire item visible
     */
    this.active = function () {
        self._elem.classList.remove("TCM-border-menu--hidden");
        self._border.classList.remove("TCM-border-menu--hidden");
    };

    /**
     * Hide only 1
     */
    this.hideLine = function () {
        self._border.classList.add("TCM-border-menu--hidden");
    };
};