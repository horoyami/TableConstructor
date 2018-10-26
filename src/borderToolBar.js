import "./borderToolBar.css";
import svgPlusButton from "./img/plus.svg";
import {createDOMElement} from "./documentUtils";

const CSS = {
    highlightedLine: "TCM-border-menu",
    hidden: "TCM-border-menu--hidden"
};

/**
 * An item with a menu that appears when you hover over a table border
 */
export class BorderToolBar {

    /**
     * @param additionalStyles - additional styles for custom items
     * @constructor
     */
    constructor(additionalStyles) {
        this.additionalStyles = additionalStyles;
        this._plusButton = this._generatePlusButton();
        this._highlightedLine = this._generateHighlightedLineCoveringBorder();
        this._toolBar = this._generateToolBar([this._plusButton, this._highlightedLine]);
    }

    /**
     * Make the entire item invisible
     */
    hide() {
        this._toolBar.classList.add(CSS.hidden);
    }

    /**
     * Make the entire item visible
     */
    show() {
        this._toolBar.classList.remove(CSS.hidden);
        this._highlightedLine.classList.remove(CSS.hidden);
    };

    /**
     * Hide only highlightedLine
     */
    hideLine() {
        this._highlightedLine.classList.add(CSS.hidden);
    };

    /**
     * Generates a menu button to add rows and columns.
     * @private
     */
    _generatePlusButton() {
        const button = createDOMElement("div");
        button.innerHTML = svgPlusButton;
        return button;
    }

    /**
     * Generates line which сover border of table
     * @private
     */
    _generateHighlightedLineCoveringBorder(style) {
        const border = createDOMElement("div", [CSS.highlightedLine, this.additionalStyles.highlightedLine]);
        return border;
    }

    /**
     * Generates the main component of the class
     * @param {array} children - child elements of toolbar
     * @private
     */
    _generateToolBar(children) {
        const toolBar = createDOMElement("div", [this.additionalStyles.toolBar, CSS.hidden], null, children);
        return toolBar;
    }
}
