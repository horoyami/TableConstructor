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

function checkMouseIsNearBorderListener(event) {
    event.stopPropagation();
    let pos = getPositionMouseRegardingElementByEvent(event);
    let posTable = getPositionOfElement(table);
    let adding = (event.currentTarget === table_editor) ? 10 : 0;

    if (Math.abs(pos.y - pos.top) <= 10) {
        changeBorder(horHover, verHover, 0, (pos.top - posTable.y1 + adding));
        isRight = false;
    } else if (Math.abs(pos.y - pos.bottom) <= 10) {
        changeBorder(horHover, verHover, 0, (pos.bottom - posTable.y1 - adding));
        isRight = true;
    } else if (Math.abs(pos.x - pos.left) <= 10) {
        changeBorder(verHover, horHover, (pos.left - posTable.x1 + adding), 0);
        isRight = false;
    } else if (Math.abs(pos.x - pos.right) <= 10) {
        changeBorder(verHover, horHover, (pos.right - posTable.x1 - adding), 0);
        isRight = true;
    } else {
        hideAllHoverBorder();
    }
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
    let verBorder;
    let horBorder;
    let table;
    let table_generator;
    let activated_border = null;
    let activated_border_pos;
    let isRight = null;
    let hovered_border = null;
    let hover_block = null;

    let addButton = document.getElementsByClassName("add_button")[0];


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

    function selectPositionForInsert(elem, conteiner, addPxels = 0) {
        console.log(elem);
        if (elem.y - elem.top <= 10 && elem.y - elem.top >= 0) {
            console.log("top");
        }
        else if (elem.bottom - elem.y <= 10 + addPxels && elem.bottom - elem.y >= 0) {
            console.log("bottom");
        }
        else if (elem.x - elem.left <= 10 && elem.x - elem.left >= 0) {
            console.log("left");
        }
        else if (elem.right - elem.x <= 10 + addPxels && elem.right - elem.y >= 0) {
            console.log("right");
        }
        else {
            console.log("none");
        }
    }

    createTableFrame();
    frame.appendChild(table_editor);

    table.addEventListener("mouseMoveCell", (event) => {
        event.stopPropagation();
        let pos = event.detail.pos;
        selectPositionForInsert(pos, posTable);
    });

    table_editor.addEventListener('mousemove', (event) => {
        event.stopPropagation();
        let pos = Position.getPositionMouseRegardingElementByEvent(event);
        selectPositionForInsert(pos, posTable, 1);
    });
};


/// TODO не готово