import {TableConstructor} from "../tableConstructor";

let table = document.querySelector(".main_wrapper");
let table_editor = new TableConstructor({
  height: 3,
  width: 3,
  table: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
});
table_editor.htmlElement.style.width = "800px";
table.appendChild(table_editor.htmlElement);