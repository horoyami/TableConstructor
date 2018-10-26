import "./borderToolBar.css";
import svgPlusButton from "./img/plus.svg";
import {createDOMElement} from "./documentUtils";

const CSS = {
    highlightingLine: "tcm-border-menu",
    hidden: "tcm-border-menu--hidden",
    horizontalToolBar: "tcm-border-menu--horizontal",
    horizontalHighlightingLine: "tcm-border-menu__1pxline--horizontal",
    verticalToolBar: "tcm-border-menu--vertical",
    verticalHighlightingLine: "tcm-border-menu__1pxline--vertical",
    plusButton: "tcm-border-menu__add-button"
};

/**
 * An item with a menu that appears when you hover over a _table border
 */
export class BorderToolBar {

    /**
     * Generate Horizontal ToolBat
     * @returns {BorderToolBar}
     */
    static createHorizontalToolBar() {
        return new BorderToolBar({
            highlightingLine: CSS.horizontalHighlightingLine,
            toolBar: CSS.horizontalToolBar
        });
    }

    /**
     * Generate Vertical ToolBat
     * @returns {BorderToolBar}
     */
    static createVerticalToolBar() {
        return new BorderToolBar({
            highlightingLine: CSS.verticalHighlightingLine,
            toolBar: CSS.verticalToolBar
        });
    }

    /**
     * Generates a menu button to add rows and columns.
     * @return {HTMLElement}
     */
    static generatePlusButton() {
        const button = createDOMElement("div");
        button.innerHTML = svgPlusButton;
        button.classList.add(CSS.plusButton);
        return button;
    }

    /**
     * @param additionalStyles - additional styles for custom items
     * @constructor
     */
    constructor(additionalStyles) {
        this.additionalStyles = additionalStyles;
        this._plusButton = BorderToolBar.generatePlusButton();
        this._highlightingLine = this._generateHighlightingLineCoveringBorder();
        this._toolBar = this._generateToolBar([this._plusButton, this._highlightingLine]);
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
        this._highlightingLine.classList.remove(CSS.hidden);
    };

    /**
     * Hide only highlightingLine
     */
    hideLine() {
        this._highlightingLine.classList.add(CSS.hidden);
    };

    /**
     * returns HTMLElement for insert in DOM
     * @returns {HTMLElement}
     */
    get htmlElement() {
        return this._toolBar;
    }

    /**
     * Generates line which сover border of _table
     * @private
     */
    _generateHighlightingLineCoveringBorder(style) {
        const border = createDOMElement("div", [CSS.highlightingLine, this.additionalStyles.highlightingLine]);
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
