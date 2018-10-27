import {createDOMElement} from "./documentUtils";
import {ActivatingAreaAroundContainer} from "./activatingAreaAroundContainer";
import "./table.css";

const CSS = {
    inputField: "tcm-editable-table__input-field",
    cell: "tcm-editable-table__cell",
    selected: "tcm-editable-table__cell--focus",
    table: "tcm-editable-table",
    wrapper: "tcm-editable-table__wrapper"
};

/**
 * Generates and manages _table contents.
 */
export class Table {

    constructor() {
        this._numberOfColumns = 0;
        this._numberOfRows = 0;
        this._table = this._createTableWrapper();
    }

    addColumn(index = Infinity) {
        this._numberOfColumns++;
        // Add cell in each row
        for (let i = 0; i < this._table.children.length; i++) {
            const cell = this._createClearCell();
            this._addChildToElem(this._table.children[i], index, cell);
        }
    };

    addRow(pos = Infinity) {
        this._numberOfRows++;
        const row = this._createClearRow();
        this._addChildToElem(this._table, pos, row);
    };

    get htmlElement() {
        return this._table.parentElement;
    }

    _createTableWrapper() {
        let table = createDOMElement("table", [CSS.table], null, [createDOMElement("tbody")]);
        return table.firstElementChild;
    }

    _createContenteditableArea(cell) {
        const div = createDOMElement("div", [CSS.inputField], {contenteditable: "true"});
        div.addEventListener("focus", () => {
            cell.classList.add(CSS.selected);
        });
        div.addEventListener("blur", () => {
            cell.classList.remove(CSS.selected);
        });
        return div;
    }

    _createClearCell() {
        const cell = createDOMElement("td", [CSS.cell]);
        const content = this._createContenteditableArea(cell);
        const area = this._createActivatingConteiner(content);
        cell.appendChild(area);
        cell.addEventListener("click", () => {
            // Get to the edited part of the cell
            content.focus();
        });
        return cell;
    }

    _createActivatingConteiner(content) {
        const area = (new ActivatingAreaAroundContainer(content)).htmlElement;
        area.classList.add(CSS.wrapper);
        return area;
    }

    _addChildToElem(elem, index, child) {
        // if index is bigger than length of array then add in end
        const indexToInsert = (index >= elem.children.length) ? null : elem.children[index];
        elem.insertBefore(child, indexToInsert);
    }

    _createClearRow() {
        const str = createDOMElement("tr");
        for (let i = 0; i < this._numberOfColumns; i++) {
            str.appendChild(this._createClearCell());
        }
        return str;
    }
}
