/*
function changeBorder(show, hide, x, y) {
    if (show !== hovered_border) {
        hovered_border = show;
        showBorder(show, x, y);
        hideBorder(hide);
    }
}

function hideAllHoverBorder() {
    hideBorder(verHover);
    hideBorder(horHover);
    hovered_border = null;
}

function hideAllBorder() {
    hideAllHoverBorder();
    hideBorder(verActive);
    hideBorder(horActive);
    activated_border = null;
    hideAddButton();
}

function changeHoverToActive(active, hover) {
    active.style.top = hover.style.top;
    active.style.left = hover.style.left;
    active.style.visibility = "visible";
    activated_border = active;
    hideBorder(hover);
    showAddButton(Number.parseInt(hover.style.left), Number.parseInt(hover.style.top));
}

function borderClickListener(event) {
    hover_block = event.target;
    if (hovered_border !== null) {
        if (activated_border !== null) {
            hideBorder(activated_border);
            hideAddButton();
        }
        if (hovered_border === horHover) {
            changeHoverToActive(horActive, horHover);
            calculateBorderPosition(table, hover_block.parentElement);
        }
        else {
            changeHoverToActive(verActive, verHover);
            calculateBorderPosition(hover_block.parentElement, hover_block);
        }
    } else if (hover_block.tagName === "TD") {
        hover_block.firstElementChild.focus();
    }
}

function showAddButton(x, y) {
    let style = getComputedStyle(addButton);
    addButton.style.top = (y - Number.parseInt(style.height) / 2) + "px";
    addButton.style.left = (x - Number.parseInt(style.width) / 2 + 1) + "px";
    addButton.style.visibility = "visible";
}

function hideAddButton() {
    addButton.style.visibility = "hidden";
}

function calculateBorderPosition(parent, child) {
    if (hover_block === table_editor) {
        activated_border_pos = (isRight) ? Infinity : 0;
        return;
    }
    let pos = 0;
    while (pos < parent.children.length && parent.children[pos++] !== child) ;
    activated_border_pos = pos + ((isRight) ? 1 : 0) - 1;
}

function addButtonClick(event) {
    event.stopPropagation();
    if (activated_border === horActive) {
        addStringTable(activated_border_pos);
    } else {
        addColumnTable(activated_border_pos);
    }
    hideAllBorder();
}

function globalPressKeyListener(event) {
    if (event.code === "Enter") {
        if (event.target.className === "inputField")
            return;
        addStringTable();
    }
    if (event.code === "Backspace") {
        if (table.children.length === 1)
            return;
        for (let i = 0; i < table.children.length; i++) {
            let ok = true;
            let row = table.children[i];

            for (let j = 0; j < row.children.length; j++) {
                let div = row.children[j].firstElementChild;
                if (div.innerText !== "")
                    ok = false;
            }

            if (ok) {
                table.removeChild(row);
                return;
            }
        }
    }
}


table_editor.addEventListener("mousemove", checkMouseIsNearBorderListener);
table_editor.addEventListener("click", borderClickListener);
addButton.addEventListener("click", addButtonClick);
document.addEventListener("keydown", globalPressKeyListener);*/

import {VerBorder} from "./VerBorder";
import {HorBorder} from "./HorBorder";
import {Position} from "./PositionUtils";
import {TableGenerator} from "./TableGenerator";


export let TableConstructor = function (frame) {
    let table_editor;
    let table_editor_pos;
    let verBorder;
    let horBorder;
    let table;
    let table_generator;
    let activated_border = null;
    let activated_border_pos;
    let isRight = null;
    let hovered_border = null;
    let hover_block = null;

    function createTable() {
        table = document.createElement("table");
        table.classList.add("editable_table");
        table.appendChild(document.createElement("tbody"));
        table_editor.appendChild(table);
        table = table.firstElementChild;
        table_generator = new TableGenerator(table);
        table_generator.addStringTable();
        table_generator.addColumnTable();
        table_generator.addStringTable();
        table_generator.addColumnTable();
    }

    function createTableFrame() {
        table_editor = document.createElement("div");
        table_editor.classList.add("table_editor");
        verBorder = new VerBorder(table_editor);
        horBorder = new HorBorder(table_editor);
        createTable();
    }

    function activeHorBorder(pos) {
        horBorder.activeIn(pos);
        verBorder.hide();
    }

    function activeVerBorder(pos) {
        verBorder.activeIn(pos);
        horBorder.hide();
    }

    function selectPositionForInsert(elem, isWrapper = 0) {
        table_editor_pos = Position.getPositionOfElement(table_editor);
        let paddingCorrectHigh = (isWrapper) ? ((-2) * 10 - 1) : (-10);
        let paddingCorrectLow = (isWrapper) ? (0) : (-10);

        if (elem.y - elem.top <= 10 && elem.y - elem.top >= 0) {
            activeHorBorder(elem.top - table_editor_pos.y1 + paddingCorrectLow);
        }
        else if (elem.bottom - elem.y <= 10 + isWrapper && elem.bottom - elem.y >= 0) {
            activeHorBorder(elem.bottom - table_editor_pos.y1 + paddingCorrectHigh);
        }
        else if (elem.x - elem.left <= 10 && elem.x - elem.left >= 0) {
            activeVerBorder(elem.left - table_editor_pos.x1 + paddingCorrectLow);
        }
        else if (elem.right - elem.x <= 10 + isWrapper && elem.right - elem.y >= 0) {
            activeVerBorder(elem.right - table_editor_pos.x1 + paddingCorrectHigh);
        }
        else {
            verBorder.hide();
            horBorder.hide();
        }
    }

    createTableFrame();
    frame.appendChild(table_editor);

    table.addEventListener("mouseMoveCell", (event) => {
        event.stopPropagation();
        let pos = event.detail.pos;
        selectPositionForInsert(pos);
    });

    table_editor.addEventListener('mousemove', (event) => {
        event.stopPropagation();
        let pos = Position.getPositionMouseRegardingElementByEvent(event);
        selectPositionForInsert(pos, 1);
    });
};


/// TODO не готово