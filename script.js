let table = document.getElementsByClassName("editable_table")[0].getElementsByTagName("tbody")[0];
let table_editor = document.getElementsByClassName("table_editor")[0];
let numberColumns = 0;
let numberStrings = 0;

let activated_border = null;
let hovered_border = null;
let verHover = document.getElementsByClassName("ver_hover")[0];
let horHover = document.getElementsByClassName("hor_hover")[0];


function generateClearCell() {
    let cell = document.createElement("td");
    let div = cell.appendChild(document.createElement("div"));
    cell.style.padding = "10px";
    div.setAttribute("contenteditable", "true");
    div.style.outline = "none";
    div.addEventListener("input", hideAllBorder);
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
    return {
        y: elem.getBoundingClientRect().top + pageYOffset,
        x: elem.getBoundingClientRect().left + pageXOffset
    }
}

function getPositionMouseRegardingElementByEvent(event) {
    let rect = event.currentTarget.getBoundingClientRect();
    return {
        top: rect.top + pageYOffset,
        left: rect.left + pageXOffset,
        bottom: rect.bottom + pageYOffset,
        right: rect.right + pageXOffset,
        x: event.pageX,
        y: event.pageY
    };
}

function showHoverBorder(elem, x, y) {

    elem.style.top = y + "px";
    elem.style.left = x + "px";
    elem.style.visibility = "visible";
}

function hideHoverBorder(elem) {
    elem.style.visibility = "hidden";
}

function changeHoverBorder(show, hide, x, y) {
    if (show !== hovered_border) {
        hovered_border = show;
        showHoverBorder(show, x, y);
        hideHoverBorder(hide);
    }
}

function hideAllBorder() {
    hideHoverBorder(verHover);
    hideHoverBorder(horHover);
    hovered_border = null;
}

function checkMouseIsNearBorderListener(event) {
    event.stopPropagation();
    let pos = getPositionMouseRegardingElementByEvent(event);
    let posTable = getPositionOfElement(table);
    let adding = (event.currentTarget === table_editor) ? 10 : 0;
    if (Math.abs(pos.y - pos.top) <= 10) {
        changeHoverBorder(horHover, verHover, 0, pos.top - posTable.y + adding);
    } else if (Math.abs(pos.y - pos.bottom) <= 10) {
        changeHoverBorder(horHover, verHover, 0, pos.bottom - posTable.y - adding);
    } else if (Math.abs(pos.x - pos.left) <= 10) {
        changeHoverBorder(verHover, horHover, pos.left - posTable.x + adding, 0);
    } else if (Math.abs(pos.x - pos.right) <= 10) {
        changeHoverBorder(verHover, horHover, pos.right - posTable.x - adding, 0);
    } else {
        hideHoverBorder(verHover);
        hideHoverBorder(horHover);
        hovered_border = null;
    }
}

table_editor.addEventListener("mousemove", checkMouseIsNearBorderListener);


addColumnTable();
addColumnTable();
addStringTable();
addStringTable();