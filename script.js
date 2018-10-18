let table = document.getElementsByClassName("editable_table")[0].getElementsByTagName("tbody")[0];
let table_editor = document.getElementsByClassName("table_editor")[0];
let numberColumns = 0;
let numberStrings = 0;

let activated_border = null;
let activated_border_pos;
let isRight = null;
let hovered_border = null;
let hover_block = null;
let verHover = document.getElementsByClassName("ver_hover")[0];
let horHover = document.getElementsByClassName("hor_hover")[0];
let verActive = document.getElementsByClassName("ver_active")[0];
let horActive = document.getElementsByClassName("hor_active")[0];
let addButton = document.getElementsByClassName("add_button")[0];

function generateClearCell() {
    let cell = document.createElement("td");
    let div = cell.appendChild(document.createElement("div"));
    div.setAttribute("contenteditable", "true");
    div.classList.add("inputField");
    div.addEventListener("input", hideAllHoverBorder);
    div.addEventListener("focus", hideAllBorder);
    div.addEventListener("focus", () => {
        cell.style.background = "cornsilk";
    });
    div.addEventListener("blur", () => {
        cell.style.background = "white";
    });
    cell.classList.add("cell");
    cell.addEventListener("mousemove", checkMouseIsNearBorderListener);
    return cell;
}

function generateClearString() {
    let str = document.createElement("tr");
    for (let i = 0; i < numberColumns; i++) {
        str.appendChild(generateClearCell());
    }
    return str;
}

function addChildToElem(elem, pos, generator) {
    let str = generator();
    elem.insertBefore(str, (pos >= elem.children.length) ? null : elem.children[pos]);
}

function addStringTable(pos = Infinity) {
    numberStrings++;
    addChildToElem(table, pos, generateClearString);
}

function addColumnTable(pos = Infinity) {
    numberColumns++;
    for (let i = 0; i < table.children.length; i++) {
        addChildToElem(table.children[i], pos, generateClearCell);
    }
}

function getPositionOfElement(elem) {
    let rect = elem.getBoundingClientRect();
    return {
        y1: rect.top + pageYOffset,
        x1: rect.left + pageXOffset,
        x2: rect.right + pageXOffset,
        y2: rect.bottom + pageYOffset
    }
}

function getPositionMouseRegardingElementByEvent(event) {
    let rect = getPositionOfElement(event.currentTarget);
    return {
        top: rect.y1,
        left: rect.x1,
        bottom: rect.y2,
        right: rect.x2,
        x: event.pageX,
        y: event.pageY
    };
}

function showBorder(elem, x, y) {
    elem.style.top = y + "px";
    elem.style.left = x + "px";
    elem.style.visibility = "visible";
}

function hideBorder(elem) {
    elem.style.visibility = "hidden";
}

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

addColumnTable();
addColumnTable();
addStringTable();
addStringTable();

table_editor.addEventListener("mousemove", checkMouseIsNearBorderListener);
table_editor.addEventListener("click", borderClickListener);
addButton.addEventListener("click", addButtonClick);
document.addEventListener("keydown", globalPressKeyListener);