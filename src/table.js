import {createDOMElement} from "./documentUtils";
import "./table.css";

const CSS = {
    input_field: "tcm-editable-table__input-field",
    cell: "tcm-editable-table__cell",
    selected: "tcm-editable-table__cell--focus"
};

/**
 * Generates and manages _table contents.
 */
export class Table {

    constructor() {
        this._numberOfColumns = 0;
        this._numberOfRows = 0;
        this._table = createDOMElement("tbody");
    }

    /**
     * Generates and add column in _table at the specified location
     * @param {number} index - the number where add column
     */
    addColumn(index = Infinity) {
        this._numberOfColumns++;
        // Add cell in each row
        for (let i = 0; i < this._table.children.length; i++) {
            const cell = this._generateClearCell();
            this._addChildToElem(this._table.children[i], index, cell);
        }
    };

    /**
     * Adds row in _table at the specified location
     * @param {number} pos - the number where add row
     * @returns {HTMLElement} node of a new row
     */
    addRow(pos = Infinity) {
        this._numberOfRows++;
        const row = this._generateClearRow();
        this._addChildToElem(this._table, pos, row);
        return row;
    };

    /**
     * returns HTMLElement for insert in DOM
     * @returns {HTMLElement}
     */
    get htmlElement() {
        return this._table;
    }

    /**
     * Generates an editable area within a _table cell
     * @param {HTMLElement} cell - the cell
     * @returns {HTMLElement} the editable area
     * @private
     */
    _generateContenteditablePartOfCell(cell) {
        const div = createDOMElement("div", [CSS.input_field], {contenteditable: "true"});
        div.addEventListener("focus", () => {
            cell.classList.add(CSS.selected);
        });
        div.addEventListener("blur", () => {
            cell.classList.remove(CSS.selected);
        });
        return div;
    }

    /**
     * Generates a clean _table cell
     * @returns {HTMLElement} The cell
     * @private
     */
    _generateClearCell() {
        const cell = createDOMElement("td", [CSS.cell]);
        const div = this._generateContenteditablePartOfCell(cell);
        cell.appendChild(div);
        cell.addEventListener("click", () => {
            div.focus();
        });
        return cell;
    }

    /**
     * Inserts сhild into the child elements of an element in place of the index
     * @param {HTMLElement} elem - the element
     * @param {number} index - the specified location
     * @param {HTMLElement} child - the child
     * @private
     */
    _addChildToElem(elem, index, child) {
        // if index is bigger than length of array then add in end
        let indexToInsert = (index >= elem.children.length) ? null : elem.children[index];
        elem.insertBefore(child, indexToInsert);
    }

    /**
     * Generates a _table row
     * @returns {HTMLElement} the row
     * @private
     */
    _generateClearRow() {
        const str = createDOMElement("tr");
        for (let i = 0; i < this._numberOfColumns; i++) {
            str.appendChild(this._generateClearCell());
        }
        return str;
    }
}
