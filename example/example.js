import {TableConstructor} from "../tableConstructor";

let table = document.querySelector(".main_wrapper");
let table_editor = new TableConstructor();
table_editor.style.width = "800px";
table.appendChild(table_editor.getTableDOM());