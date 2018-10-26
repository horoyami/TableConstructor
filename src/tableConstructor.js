import {DOM} from "./documentUtils";
import {TableGenerator} from "./tableGenerator";
import {Position} from "./positionUtils";
import {HorizontalBorderMenu} from "./horizontalBorderMenu";
import {VerticalBorder} from "./verticalBorder";
import "./tableConstructor.css"

/**
 * Chief constructor. Creates a TableConstructor
 * @param {object} extra - supported settings
 * @constructor
 */
export const TableConstructor = function (extra) {
    let tableEditor;
    let tableEditorPos;
    let verticalBorder;
    let horizontalBorder;
    let table;
    let tableGenerator;
    let activatedBorder = null;
    let isEnd = null;
    let hoverBlock = null;
    let timer;

    /**
     * Generates a table
     * @private
     */
    function _createTable() {
        table = DOM.createDOMElement("table", ["TCM-editable-table"], null, [DOM.createDOMElement("tbody")]);
        tableEditor.appendChild(table);
        table = table.firstElementChild;
        tableGenerator = new TableGenerator(table);
        tableGenerator.addRow();
        tableGenerator.addColumn();
        tableGenerator.addRow();
        tableGenerator.addColumn();
    }

    /**
     * Considers the settings object and applies them
     * @private
     */
    function _handleExtra() {
        if (extra === undefined)
            return;
        if (extra.width !== undefined)
            tableEditor.style.width = extra.width;
        if (extra.height !== undefined)
            tableEditor.style.height = extra.height;
    }

    /**
     * Creates a container where TableConstructor will be located
     * @private
     */
    function _createTableFrame() {
        tableEditor = DOM.createDOMElement("div", ["TCM-table-editor"]);
        verticalBorder = new VerticalBorder(tableEditor);
        horizontalBorder = new HorizontalBorderMenu(tableEditor);
        _createTable();
        _handleExtra();
    }

    /**
     * Makes the horizontal menu visible above a certain border
     * @param {number} pos - position
     * @private
     */
    function _activateHorBorder(pos) {
        horizontalBorder.activateIn(pos);
        verticalBorder.hide();
        activatedBorder = horizontalBorder;
    }

    /**
     * Makes the vertical menu visible above a certain border.
     * @param {number} pos - position
     * @private
     */
    function _activateVerBorder(pos) {
        verticalBorder.activateIn(pos);
        horizontalBorder.hide();
        activatedBorder = verticalBorder;
    }

    /**
     * Hide all menus
     * @private
     */
    function _hideBorders() {
        verticalBorder.hide();
        horizontalBorder.hide();
        activatedBorder = null;
    }

    const PADDING_OF_TOP_CONTAINER = 10;
    const ACTIVATION_AREA = 10;

    /**
     * Detects whether the mouse is suitable for the border and activates the action.
     * @param {HTMLElement} elem - Coordinates of the checked element
     * @param {boolean} isWrapper - 1 if the mouse go outside and 0 else
     * @private
     */
    function _selectPositionForInsert(elem, isWrapper = false) {
        tableEditorPos = Position.getPositionOfElement(tableEditor);
        const errorOfPaddingWhenPositioning = (isWrapper) ? PADDING_OF_TOP_CONTAINER : 0;

        const mouseInTopArea = (elem.y - elem.top <= ACTIVATION_AREA && elem.y - elem.top >= 0);
        const mouseInBottomArea = (elem.bottom - elem.y <= ACTIVATION_AREA + isWrapper && elem.bottom - elem.y >= 0);
        const mouseInLeftArea = (elem.x - elem.left <= ACTIVATION_AREA && elem.x - elem.left >= 0);
        const mouseInRightArea = (elem.right - elem.x <= ACTIVATION_AREA + isWrapper && elem.right - elem.y >= 0);

        if (mouseInTopArea) {
            _activateHorBorder(elem.top - tableEditorPos.y1 + errorOfPaddingWhenPositioning);
            isEnd = false;
        }
        else if (mouseInBottomArea) {
            _activateHorBorder(elem.bottom - tableEditorPos.y1 - errorOfPaddingWhenPositioning - 1);
            isEnd = true;
        }
        else if (mouseInLeftArea) {
            _activateVerBorder(elem.left - tableEditorPos.x1 + errorOfPaddingWhenPositioning);
            isEnd = false;
        }
        else if (mouseInRightArea) {
            _activateVerBorder(elem.right - tableEditorPos.x1 - errorOfPaddingWhenPositioning - 1);
            isEnd = true;
        }
        else {
            _hideBorders();
        }
    }

    /**
     * Finds the position at which the new element can be inserted so that it is immediately after the child
     * @param {HTMLElement} parent - The search happens among the children of this element
     * @param {HTMLElement} child - Looking for a place after this item
     * @returns {number} position - position where new item can be inserted
     * @private
     */
    function _calculateBorderPosition(parent, child) {
        if (hoverBlock === tableEditor) {
            return (isEnd) ? Infinity : 0;
        }
        let pos = 0;
        while (pos < parent.children.length && parent.children[pos++] !== child) ;
        return pos + ((isEnd) ? 1 : 0) - 1;
    }

    /**
     * Causes the add button to linger for 500 milliseconds under the mouse after click
     * @param {function} pos - function which returns mouse position
     * @private
     */
    function _delayAddButtonForMultiClickingNearMouse(pos) {
        tableEditorPos = Position.getPositionOfElement(tableEditor);
        activatedBorder.activateIn(pos());
        activatedBorder.hideLine();
        clearTimeout(timer);
        timer = setTimeout(activatedBorder.hide, 500);
    }

    /**
     * Fixes which of the table cells is currently active
     * @param {HTMLElement} content - cell
     * @private
     */
    function _setHoverBlock(content) {
        hoverBlock = content;
        while (!(hoverBlock === null || hoverBlock.tagName === "TD" || hoverBlock === tableEditor))
            hoverBlock = hoverBlock.parentElement;
    }

    /**
     * Clicking on the backspace deletes the empty string.
     * @param {object} event - object of event
     * @private
     */
    function _backSpacePressed(event) {
        // If the table cell is being edited, do not delete
        if (event.target.classList.contains("TCM-editable-table__input-field"))
            return;
        // If there is only one line, do not delete
        if (table.children.length === 1)
            return;
        for (let i = 0; i < table.children.length; i++) {
            let ok = true;
            const row = table.children[i];

            for (let j = 0; j < row.children.length; j++) {
                const div = row.children[j].firstElementChild;
                if (div.innerText.trim() !== "")
                    ok = false;
            }

            if (ok) {
                table.removeChild(row);
                _hideBorders();
                return;
            }
        }
    }

    /**
     * When you press Enter or Cntrl + Enter, an empty line is added.
     * Moreover, if a certain cell is selected, then a string is created under it.
     * @param {object} event - object of event
     * @private
     */
    function _enterPressed(event) {
        // If the cell is being edited, insert a new row only if the control is pressed
        if (event.target.classList.contains("TCM-editable-table__input-field") && !event.ctrlKey) {
            return;
        }
        if (hoverBlock !== null) {
            isEnd = true;
            const borderPos = _calculateBorderPosition(table, hoverBlock.parentElement);
            const newstr = tableGenerator.addRow(borderPos);
            if (event.ctrlKey) newstr.firstElementChild.firstElementChild.focus();
        } else {
            tableGenerator.addRow();
        }
    }

    _createTableFrame();

    /**
     * When moving the mouse in the cell, it should be selected and checked for proximity to the borders.
     */
    table.addEventListener("mouseMoveCell", (event) => {
        event.stopPropagation();
        const pos = event.detail.pos;
        _selectPositionForInsert(pos);
        _setHoverBlock(event.detail.elem);
    });

    /**
     * When the mouse moves behind the table, the proximity to the border should be checked.
     */
    tableEditor.addEventListener("mousemove", (event) => {
        event.stopPropagation();
        const pos = Position.getPositionMouseRegardingElementByEvent(event);
        _selectPositionForInsert(pos, true);
        _setHoverBlock(event.target);
    });

    /**
     * When you click the add button, a row or column must be added.
     */
    tableEditor.addEventListener("clickAddButton", (event) => {
        event.stopPropagation();
        if (activatedBorder === horizontalBorder) {
            const borderPos = _calculateBorderPosition(table, hoverBlock.parentElement);
            tableGenerator.addRow(borderPos);
            _delayAddButtonForMultiClickingNearMouse(() => {
                return event.detail.y - tableEditorPos.y1
            });
        } else {
            const borderPos = _calculateBorderPosition(hoverBlock.parentElement, hoverBlock);
            tableGenerator.addColumn(borderPos);
            _delayAddButtonForMultiClickingNearMouse(() => {
                return event.detail.x - tableEditorPos.x1;
            });
        }
    });

    /**
     * Data entry in cells hides all menus
     */
    table.addEventListener("inputInputField", _hideBorders);

    /**
     * When mouse is out table hides all menus
     */
    tableEditor.addEventListener("mouseleave", _hideBorders);

    /**
     * Focus on the cell select it
     */
    table.addEventListener("focusInputField", (event) => {
        hoverBlock = event.detail.elem;
    });

    /**
     * Blur on the cell remove selection it
     */
    table.addEventListener("blurInputField", () => {
        if (activatedBorder === null)
            hoverBlock = null;
    });

    /**
     * Hotkey handler
     */
    tableEditor.addEventListener("keydown", (event) => {
        if (event.code === "Enter") {
            _enterPressed(event);
        }
        if (event.code === "Backspace") {
            _backSpacePressed(event);
        }
    });

    /**
     * Returns a fully generated TableConstructor in the DOM.
     * @returns {HTMLElement}
     */
    this.getTableDOM = function () {
        return tableEditor;
    }
};
