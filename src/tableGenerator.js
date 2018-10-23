import {Position} from "./positionUtils";

/**
 * Generates and manages table contents.
 * @param table - tbody element of table to be generated
 * @constructor
 */
export const TableGenerator = function (table = null) {
    if (table === null)
        return null;

    let numberColumns = 0;
    let numberStrings = 0;

    /**
     * Generates an editable area within a table cell
     * @param cell - the cell
     * @returns the editable area
     * @private
     */
    function _generateContenteditablePartOfCell(cell) {
        const div = document.createElement("div");
        div.classList.add("TCM-editable-table__input-field");
        div.setAttribute("contenteditable", "true");
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
     * @returns The cell
     * @private
     */
    function _generateClearCell() {
        const cell = document.createElement("td");
        cell.appendChild(_generateContenteditablePartOfCell(cell));
        cell.classList.add("TCM-editable-table__cell");
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
     * @param elem - the element
     * @param pos - the specified location
     * @param generator - generator
     * @returns a new node generated by the generator
     * @private
     */
    function _addChildToElem(elem, pos, generator) {
        const str = generator();
        elem.insertBefore(str, (pos >= elem.children.length) ? null : elem.children[pos]);
        return str;
    }

    /**
     * Generates a table row
     * @returns the row
     * @private
     */
    function _generateClearString() {
        const str = document.createElement("tr");
        for (let i = 0; i < numberColumns; i++) {
            str.appendChild(_generateClearCell());
        }
        return str;
    }

    /**
     * Generates and add table column in table at the specified location
     * @param pos - the number where add column
     */
    this.addColumnTable = function (pos = Infinity) {
        numberColumns++;
        for (let i = 0; i < table.children.length; i++) {
            _addChildToElem(table.children[i], pos, _generateClearCell);
        }
    };

    /**
     * Adds row in table at the specified location
     * @param pos - the number where add row
     * @returns node of a new row
     */
    this.addStringTable = function (pos = Infinity) {
        numberStrings++;
        return _addChildToElem(table, pos, _generateClearString);
    };
};

