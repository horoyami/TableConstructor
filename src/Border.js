export let Border = function (table, classes) {
    let self = this;

    function _generateAddButton() {
        self._addButton = document.createElement("img");
        self._addButton.setAttribute("src", "./src/img/plus.svg");
        self._addButton.setAttribute("alt", "Add");
        self._addButton.classList.add("b-add_button");
        self._addButton.addEventListener("click", () => {
            table.dispatchEvent(new CustomEvent("addButtonClick"));
        });
    }

    function _generateElement() {
        self._elem = document.createElement("div");
        self._elem.classList.add(classes[0]/*, "b-hidden"*/);
        self._elem.appendChild(self._addButton);
        self._elem.appendChild(self._border);
    }

    function _generate1pxLine() {
        self._border = document.createElement("div");
        self._border.classList.add("b-bor", classes[1]);
    }

    _generateAddButton();
    _generate1pxLine();
    _generateElement();
    table.appendChild(this._elem);

    this.hide = function () {
        self._elem.classList.add("b-hidden");
    };

    this.active = function () {
        self._elem.classList.remove("b-hidden");
        self._border.classList.remove("b-hidden");
    };

    this.hideLine = function () {
        self._border.classList.add("b-hidden");
    };
};