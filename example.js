import {TableConstructor} from "./src/tableConstructor";

let table = document.querySelector(".main_wrapper");
let table_editor = new TableConstructor({width: "800px"});
table.appendChild(table_editor.getTableDOM());