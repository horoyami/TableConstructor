import {VerBorder} from "./src/VerBorder";
import {HorBorder} from "./src/HorBorder";

let table = document.getElementsByClassName("main_wrapper")[0];
let verLine = new VerBorder(table);
let horLine = new HorBorder(table);
horLine.activeIn(150);
verLine.activeIn(150);