import {Position} from "./PositionUtils";

export let TableGenerator = function (table = null) {
    if (table === null)
        return null;

    let numberColumns = 0;
    let numberStrings = 0;
    let i = 0;

    function generateContenteditablePartOfCell(cell) {
        let div = document.createElement("div");
        div.classList.add("tg-inputField");
        div.setAttribute("contenteditable", "true");
        div.addEventListener("input", () => {
            table.dispatchEvent(new CustomEvent("inputInputField"));
        });
        div.addEventListener("focus", () => {
            table.dispatchEvent(new CustomEvent("focusInputField"));
        });
        div.addEventListener("focus", () => {
            cell.style.background = "cornsilk";
        });
        div.addEventListener("blur", () => {
            cell.style.background = "white";
        });

        div.innerText = "" + (i++);

        return div;
    }

    function generateClearCell() {
        let cell = document.createElement("td");
        cell.appendChild(generateContenteditablePartOfCell(cell));
        cell.classList.add("tg-cell");
        cell.addEventListener("mousemove", (event) => {
            event.stopPropagation();
            let pos = Position.getPositionMouseRegardingElementByEvent(event);
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
        let str = generator();
        elem.insertBefore(str, (pos >= elem.children.length) ? null : elem.children[pos]);
    }

    function addStringTable(pos = Infinity) {
        numberStrings++;
        addChildToElem(table, pos, generateClearString);
    }

    function generateClearString() {
        let str = document.createElement("tr");
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
        addChildToElem(table, pos, generateClearString);
    };
};

