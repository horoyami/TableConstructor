export let BorderMenu = function (table, classes) {
    let self = this;

    function _generateAddButton() {
        self._addButton = document.createElement("img");
        self._addButton.setAttribute("src", "./src/img/plus.svg");
        self._addButton.setAttribute("alt", "Add");
        self._addButton.classList.add("TCM__border-menu__add-button");
        self._addButton.addEventListener("click", (event) => {
            table.dispatchEvent(new CustomEvent("addButtonClick", {
                "detail": {
                    "x": event.pageX,
                    "y": event.pageY
                }
            }));
        });
    }

    function _generateElement() {
        self._elem = document.createElement("div");
        self._elem.classList.add(classes[0], "TCM__border-menu_hidden");
        self._elem.appendChild(self._addButton);
        self._elem.appendChild(self._border);
        self._elem.addEventListener("mousemove", (event) => {
            event.stopPropagation();
        })
    }

    function _generate1pxLine() {
        self._border = document.createElement("div");
        self._border.classList.add("TCM__border-menu", classes[1]);
    }

    _generateAddButton();
    _generate1pxLine();
    _generateElement();
    table.appendChild(this._elem);

    this.hide = function () {
        self._elem.classList.add("TCM__border-menu_hidden");
    };

    this.active = function () {
        self._elem.classList.remove("TCM__border-menu_hidden");
        self._border.classList.remove("TCM__border-menu_hidden");
    };

    this.hideLine = function () {
        self._border.classList.add("TCM__border-menu_hidden");
    };
};