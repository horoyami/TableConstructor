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
        self._addButton = document.createElement("img");
        self._addButton.setAttribute("src", "./src/img/plus.svg");
        self._addButton.setAttribute("alt", "Add");
        self._addButton.classList.add("TCM-border-menu__add-button");
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
        self._elem = document.createElement("div");
        self._elem.classList.add(classes[0], "TCM-border-menu--hidden");
        self._elem.appendChild(self._addButton);
        self._elem.appendChild(self._border);
        self._elem.addEventListener("mousemove", (event) => {
            event.stopPropagation();
        })
    }

    /**
     * Generates line which сover border of table
     * @private
     */
    function _generate1pxLine() {
        self._border = document.createElement("div");
        self._border.classList.add("TCM-border-menu", classes[1]);
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