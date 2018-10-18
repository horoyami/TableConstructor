import {Border} from "./Border.js";

export let HorBorder = function (table) {
    Border.call(this, table);

    let self = this;

    function _generateElement() {
        self._elem = document.createElement("div");
        self._elem.classList.add("hb-hor_wrapper");
        self._elem.appendChild(self._addButton);
        self._elem.appendChild(self._border);
    }

    function _generate1pxLine() {
        self._border = document.createElement("div");
        self._border.classList.add("b-bor", "hb-hor");
    }

    _generate1pxLine();
    _generateElement();
    table.appendChild(this._elem);

    this.hide = function () {
        self._elem.classList.add("hb-hidden");
    };

    this.active = function () {
        self._elem.classList.remove("hb-hidden");
        self._border.classList.remove("hb-hidden");
    };

    this.hideLine = function () {
        self._border.classList.add("hb-hidden");
    };

    this.activeIn = function(y) {
        self._elem.style.top = y + "px";
        this.active();
    }
};
