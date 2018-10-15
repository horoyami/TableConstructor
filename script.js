/*let td = document.getElementById("test");

let y = td.getBoundingClientRect().top + pageYOffset;
let x = td.getBoundingClientRect().left + pageXOffset;

console.log(x + " " + y);

td.addEventListener("mousemove", (event) => {
    let x = event.pageX;
    let y = event.pageY;
    console.log(x + " " + y);
});*/

let table = document.getElementsByClassName("editable_table")[0].getElementsByTagName("tbody")[0];
let numberСolumns = 0;
let numberStrings = 0;

function checkMouseIsNearBorderListener(event) {

}

function generateClearCell() {
    let cell = document.createElement("td");
    cell.setAttribute("contenteditable", "true");
    cell.addEventListener("mousemove", checkMouseIsNearBorderListener);
    return cell;
}

function generateClearString() {
    let str = document.createElement("tr");
    for (let i = 0; i < numberСolumns; i++) {
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
    numberСolumns++;
    for (let i = 0; i < table.children.length; i++) {
        addChildToElem(table.children[i], pos, generateClearCell);
    }
}

addColumnTable();
addColumnTable();
addStringTable();
addStringTable();