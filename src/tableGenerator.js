import {Position} from "./positionUtils";

export const TableGenerator = function (table = null) {
    if (table === null)
        return null;

    let numberColumns = 0;
    let numberStrings = 0;

    function generateContenteditablePartOfCell(cell) {
        const div = document.createElement("div");
        div.classList.add("TCM__editable-table__input-field");
        div.setAttribute("contenteditable", "true");
        div.addEventListener("input", () => {
            table.dispatchEvent(new CustomEvent("inputInputField"));
        });
        div.addEventListener("focus", () => {
            table.dispatchEvent(new CustomEvent("focusInputField", {
                "detail": {
                    "elem": cell
                }
            }));
        });
        div.addEventListener("focus", () => {
            cell.style.background = "cornsilk";
        });
        div.addEventListener("blur", () => {
            cell.style.background = "white";
        });
        return div;
    }

    function generateClearCell() {
        const cell = document.createElement("td");
        cell.appendChild(generateContenteditablePartOfCell(cell));
        cell.classList.add("TCM__editable-table__cell");
        cell.addEventListener("mousemove", (event) => {
            event.stopPropagation();
            const pos = Position.getPositionMouseRegardingElementByEvent(event);
            table.dispatchEvent(new CustomEvent("mouseMoveCell", {
                "detail": {
                    "pos": pos,
                    "elem": event.target
                }
            }));
        });
        return cell;
    }

    function addChildToElem(elem, pos, generator) {
        const str = generator();
        elem.insertBefore(str, (pos >= elem.children.length) ? null : elem.children[pos]);
        return str;
    }

    function generateClearString() {
        const str = document.createElement("tr");
        for (let i = 0; i < numberColumns; i++) {
            str.appendChild(generateClearCell());
        }
        return str;
    }

    this.addColumnTable = function (pos = Infinity) {
        numberColumns++;
        for (let i = 0; i < table.children.length; i++) {
            addChildToElem(table.children[i], pos, generateClearCell);
        }
    };

    this.addStringTable = function (pos = Infinity) {
        numberStrings++;
        return addChildToElem(table, pos, generateClearString);
    };
};

