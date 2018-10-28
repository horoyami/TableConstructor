import "./tableConstructor.css"
import {createDOMElement, getCoords} from "./documentUtils";
import {ActivatingAreaAroundContainer} from "./activatingAreaAroundContainer";
import {HorizontalBorderToolBar, VerticalBorderToolBar} from "./borderToolBar";
import {Table} from "./table";

const CSS = {
    editor: "tcm-table-editor",
    plusButton: "tcm-border-menu__add-button"
};

export class TableConstructor {

    constructor() {
        this._table = this._createBlankTable();
        this._container = new ActivatingAreaAroundContainer(this._table.htmlElement, false);
        this._container.htmlElement.classList.add(CSS.editor);
        this._verticalToolBar = new VerticalBorderToolBar();
        this._horizontalToolBar = new HorizontalBorderToolBar();
        this._container.htmlElement.appendChild(this._verticalToolBar.htmlElement);
        this._container.htmlElement.appendChild(this._horizontalToolBar.htmlElement);
        this._coveredBlock = null;
        this._activatedToolBar = null;
        this._hangEvents();
    }

    get htmlElement() {
        return this._container.htmlElement;
    }

    _createBlankTable() {
        const table = new Table();
        table.addColumn();
        table.addColumn();
        table.addRow();
        table.addRow();
        return table;
    }

    _setHoverBlock(content) {
        this._coveredBlock = content;
        while (!(this._coveredBlock === null || this._coveredBlock.tagName === "TD" || this._coveredBlock === this._container.htmlElement))
            this._coveredBlock = this._coveredBlock.parentElement;
    }

    _showToolBar(toolBar, coord) {
        if (this._activatedToolBar !== null)
            this._activatedToolBar.hide();
        this._activatedToolBar = toolBar;
        toolBar.showIn(coord);
    }

    _hangEvents() {
        this._container.htmlElement.addEventListener("mouseInActivatingArea", (event) => {
            this._side = event.detail.side;
            const areaCoords = getCoords(event.target);
            const containerCoords = getCoords(this._container.htmlElement);
            this._setHoverBlock(event.target);

            if (this._side === "top") {
                this._showToolBar(this._horizontalToolBar, areaCoords.y1 - containerCoords.y1);
            }
            if (this._side === "bottom") {
                this._showToolBar(this._horizontalToolBar, areaCoords.y2 - containerCoords.y1);
            }
            if (this._side === "left") {
                this._showToolBar(this._verticalToolBar, areaCoords.x1 - containerCoords.x1 - 1);
            }
            if (this._side === "right") {
                this._showToolBar(this._verticalToolBar, areaCoords.x2 - containerCoords.x1);
            }
        });

        this._container.htmlElement.addEventListener("click", (event) => {
            if (event.target.classList.contains(CSS.plusButton)) {
                if (this._activatedToolBar === this._horizontalToolBar) {
                    this._addRow();
                    const containerCoords = getCoords(this._container.htmlElement);
                    this._delayAddButtonForMultiClickingNearMouse(event.detail.y - containerCoords.y1);
                } else {
                    this._addColumn();
                    const containerCoords = getCoords(this._container.htmlElement);
                    this._delayAddButtonForMultiClickingNearMouse(event.detail.x - containerCoords.x1);
                }
            }
        });

        this._container.htmlElement.addEventListener("keydown", (event) => {
            if (event.code === "Enter") {
                this._enterPressed(event);
            }
        });
    }

    _delayAddButtonForMultiClickingNearMouse(coord) {
        this._showToolBar(this._activatedToolBar, coord);
        this._activatedToolBar.hideLine();
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this._activatedToolBar.hide();
        }, 500);
    }

    _calculateToolBarPosition(parent, child, withAnError = true) {
        if (this._coveredBlock === this._container.htmlElement) {
            return (this._side === "top" || this._side === "left") ? Infinity : 0;
        }
        let index = 0;
        // Runs through the array in search of an element
        while (index < parent.children.length && parent.children[index] !== child)
            index++;
        if (withAnError == true && (this._side === "bottom" || this._side == "right")) {
            index++;
        }
        return index;
    }

    get _tbody() {
        return this._table.htmlElement.firstChild;
    }

    _addRow() {
        const index = this._calculateToolBarPosition(this._tbody, this._coveredBlock.parentElement);
        this._table.addRow(index);
    }

    _addColumn() {
        const index = this._calculateToolBarPosition(this._coveredBlock.parentElement, this._coveredBlock);
        this._table.addColumn(index);
    }

    _enterPressed(event) {
        if (this._table.selectedSell !== null && event.ctrlKey) {
            const index = this._calculateToolBarPosition(this._tbody, this._table.selectedSell.parentElement, false);
            const newstr = this._table.addRow(index + 1);
            newstr.firstElementChild.click();
        }
    }

}
