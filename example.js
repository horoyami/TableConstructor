import {TableConstructor} from "./src/TableConstructor";

let table = document.getElementsByClassName("main_wrapper")[0];
let table_editor = new TableConstructor({width: "800px"});
table.appendChild(table_editor.getTableDOM());