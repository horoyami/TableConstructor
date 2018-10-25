require("./tableGenerator.css");
const Position = require("./positionUtils");
const DOM = require("./documentUtils");

/**
 * Generates and manages table contents.
 * @param {HTMLElement} table - tbody element of table to be generated
 * @constructor
 */
const TableGenerator = function (table = null) {
    if (table === null)
        return null;

    let numberOfColumns = 0;
    let numberOfRows = 0;

    /**
     * Generates an editable area within a table cell
     * @param {HTMLElement} cell - the cell
     * @returns {HTMLElement} the editable area
     * @private
     */
    function _generateContenteditablePartOfCell(cell) {
        const div = DOM.createDOMElement("div", ["TCM-editable-table__input-field"], {contenteditable: "true"});
        div.addEventListener("input", () => {
            table.dispatchEvent(new CustomEvent("inputInputField"));
        });
        div.addEventListener("focus", () => {
            table.dispatchEvent(new CustomEvent("focusInputField", {
                "detail": {
                    "elem": cell
                }
            }));
        });
        div.addEventListener("blur", () => {
            table.dispatchEvent(new CustomEvent("blurInputField"));
        });
        div.addEventListener("focus", () => {
            cell.style.background = "cornsilk";
        });
        div.addEventListener("blur", () => {
            cell.style.background = "white";
        });
        return div;
    }

    /**
     * Generates a clean table cell
     * @returns {HTMLElement} The cell
     * @private
     */
    function _generateClearCell() {
        const cell = DOM.createDOMElement("td", ["TCM-editable-table__cell"]);
        cell.appendChild(_generateContenteditablePartOfCell(cell));
        cell.addEventListener("mousemove", (event) => {
            event.stopPropagation();
            const pos = Position.getPositionMouseRegardingElementByEvent(event);
            table.dispatchEvent(new CustomEvent("mouseMoveCell", {
                "detail": {
                    "pos": pos,
                    "elem": event.target
                }
            }));
        });
        return cell;
    }

    /**
     * Adds a node generated by the generator to the element at the specified location
     * @param {HTMLElement}elem - the element
     * @param {number} pos - the specified location
     * @param {function} generator - generator
     * @returns {HTMLElement} a new node generated by the generator
     * @private
     */
    function _addChildToElem(elem, pos, generator) {
        const str = generator();
        elem.insertBefore(str, (pos >= elem.children.length) ? null : elem.children[pos]);
        return str;
    }

    /**
     * Generates a table row
     * @returns {HTMLElement} the row
     * @private
     */
    function _generateClearRow() {
        const str = DOM.createDOMElement("tr");
        for (let i = 0; i < numberOfColumns; i++) {
            str.appendChild(_generateClearCell());
        }
        return str;
    }

    /**
     * Generates and add table column in table at the specified location
     * @param {number} pos - the number where add column
     */
    this.addColumn = function (pos = Infinity) {
        numberOfColumns++;
        for (let i = 0; i < table.children.length; i++) {
            _addChildToElem(table.children[i], pos, _generateClearCell);
        }
    };

    /**
     * Adds row in table at the specified location
     * @param {number} pos - the number where add row
     * @returns {HTMLElement} node of a new row
     */
    this.addRow = function (pos = Infinity) {
        numberOfRows++;
        return _addChildToElem(table, pos, _generateClearRow);
    };
};

module.exports = TableGenerator;
