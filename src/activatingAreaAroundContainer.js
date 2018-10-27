import {createDOMElement} from "./documentUtils";
import "./activatingAreaAroundContainer.css";

const CSS = {
    mainContainer: "tcm-around-container",
    horizontalArea: "tcm-around-container__horizontal-area",
    verticalArea: "tcm-around-container__vertical-area",
    rowContainer: "tcm-around-container__row-container"
};

export class ActivatingAreaAroundContainer {

    constructor(content, isOutside = true) {
        this._isOutside = isOutside;
        this._content = content;
        this._container = this._createMainContainer();
    }

    get htmlElement() {
        return this._container;
    }

    _createMainContainer() {
        return createDOMElement("div", [CSS.mainContainer], null, [
            this._createActivatingArea((this._isOutside ? "top" : "bottom"), CSS.horizontalArea),
            this._createInlineAreaContent(),
            this._createActivatingArea((this._isOutside ? "bottom" : "top"), CSS.horizontalArea)
        ]);
    }

    _createActivatingArea(side, style) {
        const area = createDOMElement("div", [style]);
        area.addEventListener("mouseenter", () => {
            area.dispatchEvent(new CustomEvent("mouseInActivatingArea", {
                "detail": {
                    "side": side
                },
                "bubbles": true
            }));
        });
        return area;
    }

    _createInlineAreaContent() {
        return createDOMElement("div", [CSS.rowContainer], null, [
            this._createActivatingArea((this._isOutside ? "left" : "right"), CSS.verticalArea),
            this._content,
            this._createActivatingArea((this._isOutside ? "right" : "left"), CSS.verticalArea)
        ]);
    }
}