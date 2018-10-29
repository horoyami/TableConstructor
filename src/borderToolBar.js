import './borderToolBar.css';
import svgPlusButton from './img/plus.svg';
import {create} from './documentUtils';

const CSS = {
  highlightingLine: 'tcm-border-menu',
  hidden: 'tcm-border-menu--hidden',
  horizontalToolBar: 'tcm-border-menu--horizontal',
  horizontalHighlightingLine: 'tcm-border-menu__highlighting-line--horizontal',
  verticalToolBar: 'tcm-border-menu--vertical',
  verticalHighlightingLine: 'tcm-border-menu__highlighting-line--vertical',
  plusButton: 'tcm-border-menu__plus-button'
};

/**
 * An item with a menu that appears when you hover over a _table border
 */
class BorderToolBar {
  /**
   * @param {object} additionalStyles - additional styles for custom items
   * @constructor
   */
  constructor(additionalStyles) {
    this._additionalStyles = additionalStyles;
    this._plusButton = this._generatePlusButton();
    this._highlightingLine = this._generateHighlightingLine();
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
   * Generates a menu button to add rows and columns.
   * @return {HTMLElement}
   */
  _generatePlusButton() {
    const button = create('div', [CSS.plusButton]);

    button.innerHTML = svgPlusButton;
    button.firstChild.addEventListener('click', (event) => {
      event.stopPropagation();
      const e = new CustomEvent('click', {'detail': {'x': event.pageX, 'y': event.pageY}, 'bubbles': true});

      button.dispatchEvent(e);
    });
    return button;
  }

  /**
   * Generates line which сover border of _table
   * @private
   */
  _generateHighlightingLine() {
    return create('div', [CSS.highlightingLine, this._additionalStyles.highlightingLine]);
  }

  /**
   * Generates the main component of the class
   * @param {Element[]} children - child elements of toolbar
   * @private
   */
  _generateToolBar(children) {
    return create('div', [this._additionalStyles.toolBar, CSS.hidden], null, children);
  }
}

/**
 * An item with a menu that appears when you hover over a _table border horizontally
 */
export class HorizontalBorderToolBar extends BorderToolBar {
  /**
   * Creates
   */
  constructor() {
    super({
      highlightingLine: CSS.horizontalHighlightingLine,
      toolBar: CSS.horizontalToolBar
    });
  }

  /**
   * Move ToolBar to y coord
   * @param {number} y - coord
   */
  showIn(y) {
    const halfHeight = Math.floor(Number.parseInt(getComputedStyle(this._toolBar).height) / 2);

    this._toolBar.style.top = (y - halfHeight) + 'px';
    this.show();
  }
}

/**
 * An item with a menu that appears when you hover over a _table border vertically
 */
export class VerticalBorderToolBar extends BorderToolBar {
  /**
   * Creates
   */
  constructor() {
    super({
      highlightingLine: CSS.verticalHighlightingLine,
      toolBar: CSS.verticalToolBar
    });
  }

  /**
   * Move ToolBar to x coord
   * @param {number} x - coord
   */
  showIn(x) {
    const halfWidth = Math.floor(Number.parseInt(getComputedStyle(this._toolBar).width) / 2);

    this._toolBar.style.left = (x - halfWidth) + 'px';
    this.show();
  }
}
