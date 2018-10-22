import {VerticalBorder} from "./verticalBorder";
import {HorizontalBorderMenu} from "./horizontalBorderMenu";
import {Position} from "./positionUtils";
import {TableGenerator} from "./tableGenerator";

/**
 * Chief constructor. Creates a TableConstructor
 * @param extra - supported settings
 * @constructor
 */
export let TableConstructor = function (extra) {
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
        table = document.createElement("table");
        table.classList.add("TCM__editable-table");
        table.appendChild(document.createElement("tbody"));
        tableEditor.appendChild(table);
        table = table.firstElementChild;
        tableGenerator = new TableGenerator(table);
        tableGenerator.addStringTable();
        tableGenerator.addColumnTable();
        tableGenerator.addStringTable();
        tableGenerator.addColumnTable();
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
        tableEditor = document.createElement("div");
        tableEditor.classList.add("TCM__table-editor");
        verticalBorder = new VerticalBorder(tableEditor);
        horizontalBorder = new HorizontalBorderMenu(tableEditor);
        _createTable();
        _handleExtra();
    }

    /**
     * Makes the horizontal menu visible above a certain border
     * @param pos - position
     * @private
     */
    function _activeHorBorder(pos) {
        horizontalBorder.activeIn(pos);
        verticalBorder.hide();
        activatedBorder = horizontalBorder;
    }

    /**
     * Makes the vertical menu visible above a certain border.
     * @param pos - position
     * @private
     */
    function _activeVerBorder(pos) {
        verticalBorder.activeIn(pos);
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

    const PADDING_CORRECT_END_FROM_WRAPPER = ((-2) * 10 - 1);
    const PADDING_CORRECT_FROM_TABLE_CELL = (-10);
    const PADDING_CORRECT_START_FROM_WRAPPER = 0;
    const PADDING = 10;

    /**
     * Detects whether the mouse is suitable for the border and activates the action.
     * @param elem - Coordinates of the checked element
     * @param isWrapper - 1 if the mouse go outside and 0 else
     * @private
     */
    function _selectPositionForInsert(elem, isWrapper = 0) {
        tableEditorPos = Position.getPositionOfElement(tableEditor);
        const paddingCorrectEnd = (isWrapper) ? PADDING_CORRECT_END_FROM_WRAPPER : PADDING_CORRECT_FROM_TABLE_CELL;
        const paddingCorrectStart = (isWrapper) ? PADDING_CORRECT_START_FROM_WRAPPER : PADDING_CORRECT_FROM_TABLE_CELL;

        if (elem.y - elem.top <= PADDING && elem.y - elem.top >= 0) {
            _activeHorBorder(elem.top - tableEditorPos.y1 + paddingCorrectStart);
            isEnd = false;
        }
        else if (elem.bottom - elem.y <= PADDING + isWrapper && elem.bottom - elem.y >= 0) {
            _activeHorBorder(elem.bottom - tableEditorPos.y1 + paddingCorrectEnd);
            isEnd = true;
        }
        else if (elem.x - elem.left <= PADDING && elem.x - elem.left >= 0) {
            _activeVerBorder(elem.left - tableEditorPos.x1 + paddingCorrectStart);
            isEnd = false;
        }
        else if (elem.right - elem.x <= PADDING + isWrapper && elem.right - elem.y >= 0) {
            _activeVerBorder(elem.right - tableEditorPos.x1 + paddingCorrectEnd);
            isEnd = true;
        }
        else {
            _hideBorders();
        }
    }

    /**
     * Finds the position at which the new element can be inserted so that it is immediately after the child
     * @param parent - The search happens among the children of this element
     * @param child - Looking for a place after this item
     * @returns position - position where new item can be inserted
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
     * @param pos - mouse position
     * @private
     */
    function _dellayAddButton(pos) {
        tableEditorPos = Position.getPositionOfElement(tableEditor);
        activatedBorder.activeIn(pos() - 10);
        activatedBorder.hideLine();
        clearTimeout(timer);
        timer = setTimeout(activatedBorder.hide, 500);
    }

    /**
     * Fixes which of the table cells is currently active
     * @param content - cell
     * @private
     */
    function _setHoverBlock(content) {
        hoverBlock = content;
        while (!(hoverBlock === null || hoverBlock.tagName === "TD" || hoverBlock === tableEditor))
            hoverBlock = hoverBlock.parentElement;
    }

    /**
     * Clicking on the backspace deletes the empty string.
     * @param event - object of event
     * @private
     */
    function _pressedBackSpace(event) {
        if (event.target.classList.contains("TCM__editable-table__input-field"))
            return;
        if (table.children.length === 1)
            return;
        for (let i = 0; i < table.children.length; i++) {
            let ok = true;
            const row = table.children[i];

            for (let j = 0; j < row.children.length; j++) {
                const div = row.children[j].firstElementChild;
                if (div.innerText !== "")
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
     * @param event - object of event
     * @private
     */
    function _pressedEnter(event) {
        if (event.target.classList.contains("TCM__editable-table__input-field") && !IsCntrlPassed) {
            return;
        }
        console.log(hoverBlock);
        if (hoverBlock !== null) {
            isEnd = true;
            const borderPos = _calculateBorderPosition(table, hoverBlock.parentElement);
            const newstr = tableGenerator.addStringTable(borderPos);
            if (IsCntrlPassed) newstr.firstElementChild.firstElementChild.focus();
        } else {
            tableGenerator.addStringTable();
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
        _selectPositionForInsert(pos, 1);
        _setHoverBlock(event.target);
    });

    /**
     * When you click the add button, a row or column must be added.
     */
    tableEditor.addEventListener("addButtonClick", (event) => {
        event.stopPropagation();
        if (activatedBorder === horizontalBorder) {
            const borderPos = _calculateBorderPosition(table, hoverBlock.parentElement);
            tableGenerator.addStringTable(borderPos);
            _dellayAddButton(() => {
                return event.detail.y - tableEditorPos.y1
            });
        } else {
            const borderPos = _calculateBorderPosition(hoverBlock.parentElement, hoverBlock);
            tableGenerator.addColumnTable(borderPos);
            _dellayAddButton(() => {
                return event.detail.x - tableEditorPos.x1;
            });
        }
    });

    /**
     * Data entry in cells hides all menus
     */
    table.addEventListener("inputInputField", () => {
        _hideBorders();
    });

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
        hoverBlock = null;
    });

    let IsCntrlPassed = false;

    /**
     * Hotkey handler
     */
    document.addEventListener("keydown", (event) => {
        if (event.code === "Enter") {
            _pressedEnter(event);
        }
        if (event.code === "Backspace") {
            _pressedBackSpace(event);
        }
        if (event.code === "ControlLeft") {
            IsCntrlPassed = true;
        }
    });

    /**
     * Clamp check Cntrl
     */
    document.addEventListener("keyup", () => {
        if (event.code === "ControlLeft") {
            IsCntrlPassed = false;
        }
    });

    /**
     * Returns a fully generated TableConstructor in the DOM.
     * @returns {*}
     */
    this.getTableDOM = function () {
        return tableEditor;
    }
};
