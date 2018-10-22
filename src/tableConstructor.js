import {VerticalBorder} from "./verticalBorder";
import {HorizontalBorderMenu} from "./horizontalBorderMenu";
import {Position} from "./positionUtils";
import {TableGenerator} from "./tableGenerator";

export let TableConstructor = function (extra) {
    let tableEditor;
    let tableEditorPos;
    let verticalBorder;
    let horizontalBorder;
    let table;
    let tableGenerator;
    let activatedBorder = null;
    let isRight = null;
    let hoverBlock = null;
    let timer;

    function createTable() {
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

    function handleExtra() {
        if (extra === undefined)
            return;
        if (extra.width !== undefined)
            tableEditor.style.width = extra.width;
        if (extra.height !== undefined)
            tableEditor.style.height = extra.height;
    }

    function createTableFrame() {
        tableEditor = document.createElement("div");
        tableEditor.classList.add("TCM__table-editor");
        verticalBorder = new VerticalBorder(tableEditor);
        horizontalBorder = new HorizontalBorderMenu(tableEditor);
        createTable();
        handleExtra();
    }

    function activeHorBorder(pos) {
        horizontalBorder.activeIn(pos);
        verticalBorder.hide();
        activatedBorder = horizontalBorder;
    }

    function activeVerBorder(pos) {
        verticalBorder.activeIn(pos);
        horizontalBorder.hide();
        activatedBorder = verticalBorder;
    }

    function hideBorders() {
        verticalBorder.hide();
        horizontalBorder.hide();
        activatedBorder = null;
    }

    function selectPositionForInsert(elem, isWrapper = 0) {
        tableEditorPos = Position.getPositionOfElement(tableEditor);
        const paddingCorrectHigh = (isWrapper) ? ((-2) * 10 - 1) : (-10);
        const paddingCorrectLow = (isWrapper) ? (0) : (-10);

        if (elem.y - elem.top <= 10 && elem.y - elem.top >= 0) {
            activeHorBorder(elem.top - tableEditorPos.y1 + paddingCorrectLow);
            isRight = false;
        }
        else if (elem.bottom - elem.y <= 10 + isWrapper && elem.bottom - elem.y >= 0) {
            activeHorBorder(elem.bottom - tableEditorPos.y1 + paddingCorrectHigh);
            isRight = true;
        }
        else if (elem.x - elem.left <= 10 && elem.x - elem.left >= 0) {
            activeVerBorder(elem.left - tableEditorPos.x1 + paddingCorrectLow);
            isRight = false;
        }
        else if (elem.right - elem.x <= 10 + isWrapper && elem.right - elem.y >= 0) {
            activeVerBorder(elem.right - tableEditorPos.x1 + paddingCorrectHigh);
            isRight = true;
        }
        else {
            hideBorders();
        }
    }

    function calculateBorderPosition(parent, child) {
        if (hoverBlock === tableEditor) {
            return (isRight) ? Infinity : 0;
        }
        let pos = 0;
        while (pos < parent.children.length && parent.children[pos++] !== child) ;
        return pos + ((isRight) ? 1 : 0) - 1;
    }

    function dellayAddButton(pos) {
        tableEditorPos = Position.getPositionOfElement(tableEditor);
        activatedBorder.activeIn(pos() - 10);
        activatedBorder.hideLine();
        clearTimeout(timer);
        timer = setTimeout(activatedBorder.hide, 500);
    }

    function setHoverBlock(content) {
        hoverBlock = content;
        while(!(hoverBlock === null || hoverBlock.tagName === "TD" || hoverBlock === tableEditor))
            hoverBlock = hoverBlock.parentElement;
    }

    createTableFrame();

    table.addEventListener("mouseMoveCell", (event) => {
        event.stopPropagation();
        const pos = event.detail.pos;
        selectPositionForInsert(pos);
        setHoverBlock(event.detail.elem);
    });

    tableEditor.addEventListener("mousemove", (event) => {
        event.stopPropagation();
        const pos = Position.getPositionMouseRegardingElementByEvent(event);
        selectPositionForInsert(pos, 1);
        setHoverBlock(event.target);
    });

    tableEditor.addEventListener("addButtonClick", (event) => {
        event.stopPropagation();
        if (activatedBorder === horizontalBorder) {
            const borderPos = calculateBorderPosition(table, hoverBlock.parentElement);
            tableGenerator.addStringTable(borderPos);
            dellayAddButton(() => {
                return event.detail.y - tableEditorPos.y1
            });
        } else {
            const borderPos = calculateBorderPosition(hoverBlock.parentElement, hoverBlock);
            tableGenerator.addColumnTable(borderPos);
            dellayAddButton(() => {
                return event.detail.x - tableEditorPos.x1;
            });
        }
    });

    table.addEventListener("inputInputField", () => {
        hideBorders();
    });

    table.addEventListener("focusInputField", (event) => {
        hoverBlock = event.detail.elem;
    });

    let IsCntrlPassed = false;

    document.addEventListener("keydown", (event) => {
        if (event.code === "Enter") {
            if (event.target.className === "tg-inputField" && !IsCntrlPassed) {
                return;
            }
            if (hoverBlock !== null) {
                isRight = true;
                const borderPos = calculateBorderPosition(table, hoverBlock.parentElement);
                const newstr = tableGenerator.addStringTable(borderPos);
                newstr.firstElementChild.firstElementChild.focus();
            } else {
                tableGenerator.addStringTable();
            }
        }
        if (event.code === "Backspace") {
            if (event.target.className === "tg-inputField")
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
                    hideBorders();
                    return;
                }
            }
        }
        if (event.code === "ControlLeft") {
            IsCntrlPassed = true;
        }
    });

    document.addEventListener("keyup", () => {
        if (event.code === "ControlLeft") {
            IsCntrlPassed = false;
        }
    });

    this.getTableDOM = function () {
        return tableEditor;
    }
};
