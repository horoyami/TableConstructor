export let Border = function (table) {

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

    _generateAddButton();
};