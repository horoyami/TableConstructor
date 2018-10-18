import {HorBorder} from "./src/HorBorder";

let table = document.getElementsByClassName("main_wrapper")[0];
let horLine = new HorBorder(table);
horLine.activeIn(150);
