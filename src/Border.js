let Border = function (table) {

    this._addButton;

    function _generateAddButton() {
        this._addButton = document.createElement("img");
        this._addButton.setAttribute("src", "./img/plus.svg");
        this._addButton.setAttribute("alt", "Add");
        this._addButton.classList.add("b-add_button");
        this._addButton.addEventListener("click", () => {
            table.dispatchEvent(new CustomEvent("addButtonClick"));
        });
    }

    _generateAddButton();
};