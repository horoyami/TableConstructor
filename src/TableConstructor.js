import {VerBorder} from "./VerBorder";
import {HorBorder} from "./HorBorder";
import {Position} from "./PositionUtils";
import {TableGenerator} from "./TableGenerator";

export let TableConstructor = function (extra) {
    let table_editor;
    let table_editor_pos;
    let verBorder;
    let horBorder;
    let table;
    let table_generator;
    let activated_border = null;
    let isRight = null;
    let hover_block = null;
    let timer;

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

    function handleExtra() {
        if (extra === undefined)
            return;
        if (extra.width !== undefined)
            table_editor.style.width = extra.width;
        if (extra.height !== undefined)
            table_editor.style.height = extra.height;
    }

    function createTableFrame() {
        table_editor = document.createElement("div");
        table_editor.classList.add("table_editor");
        verBorder = new VerBorder(table_editor);
        horBorder = new HorBorder(table_editor);
        createTable();
        handleExtra();
    }

    function activeHorBorder(pos) {
        horBorder.activeIn(pos);
        verBorder.hide();
        activated_border = horBorder;
    }

    function activeVerBorder(pos) {
        verBorder.activeIn(pos);
        horBorder.hide();
        activated_border = verBorder;
    }

    function selectPositionForInsert(elem, isWrapper = 0) {
        table_editor_pos = Position.getPositionOfElement(table_editor);
        let paddingCorrectHigh = (isWrapper) ? ((-2) * 10 - 1) : (-10);
        let paddingCorrectLow = (isWrapper) ? (0) : (-10);

        if (elem.y - elem.top <= 10 && elem.y - elem.top >= 0) {
            activeHorBorder(elem.top - table_editor_pos.y1 + paddingCorrectLow);
            isRight = false;
        }
        else if (elem.bottom - elem.y <= 10 + isWrapper && elem.bottom - elem.y >= 0) {
            activeHorBorder(elem.bottom - table_editor_pos.y1 + paddingCorrectHigh);
            isRight = true;
        }
        else if (elem.x - elem.left <= 10 && elem.x - elem.left >= 0) {
            activeVerBorder(elem.left - table_editor_pos.x1 + paddingCorrectLow);
            isRight = false;
        }
        else if (elem.right - elem.x <= 10 + isWrapper && elem.right - elem.y >= 0) {
            activeVerBorder(elem.right - table_editor_pos.x1 + paddingCorrectHigh);
            isRight = true;
        }
        else {
            verBorder.hide();
            horBorder.hide();
            activated_border = null;
        }
    }

    function calculateBorderPosition(parent, child) {
        if (hover_block === table_editor) {
            return (isRight) ? Infinity : 0;
        }
        let pos = 0;
        while (pos < parent.children.length && parent.children[pos++] !== child) ;
        return pos + ((isRight) ? 1 : 0) - 1;
    }

    function dellayAddButton() {
        clearTimeout(timer);
        timer = setTimeout(activated_border.hide, 500);
    }

    createTableFrame();

    table.addEventListener("mouseMoveCell", (event) => {
        event.stopPropagation();
        let pos = event.detail.pos;
        selectPositionForInsert(pos);
        hover_block = event.detail.elem;
    });

    table_editor.addEventListener("mousemove", (event) => {
        event.stopPropagation();
        let pos = Position.getPositionMouseRegardingElementByEvent(event);
        selectPositionForInsert(pos, 1);
        hover_block = event.target;
    });

    table_editor.addEventListener("addButtonClick", (event) => {
        event.stopPropagation();
        table_editor_pos = Position.getPositionOfElement(table_editor);
        if (activated_border === horBorder) {
            let border_pos = calculateBorderPosition(table, hover_block.parentElement);
            table_generator.addStringTable(border_pos);
            activated_border.activeIn(event.detail.y - table_editor_pos.y1 + 10);
        } else {
            let border_pos = calculateBorderPosition(hover_block.parentElement, hover_block);
            table_generator.addColumnTable(border_pos);
            activated_border.activeIn(event.detail.x - table_editor_pos.x1 - 10);
        }
        activated_border.hideLine();
        dellayAddButton();
    });

    this.getTableDOM = function () {
        return table_editor;
    }
};