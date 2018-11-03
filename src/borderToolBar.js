import './borderToolBar.scss';
import svgPlusButton from './img/plus.svg';
import {create} from './documentUtils';

const CSS = {
  highlightingLine: 'tcm-border-menu',
  hidden: 'tcm-border-menu--hidden',
  horizontalToolBar: 'tcm-border-menu--horizontal',
  horizontalHighlightingLine: 'tcm-border-menu__highlighting-line--horizontal',
  verticalToolBar: 'tcm-border-menu--vertical',
  verticalHighlightingLine: 'tcm-border-menu__highlighting-line--vertical',
  plusButton: 'tcm-border-menu__plus-button',
  horizontalPlusButton: 'tcm-border-menu__plus-button--horizontal',
  verticalPlusButton: 'tcm-border-menu__plus-button--vertical'
};

/**
 * An item with a menu that appears when you hover over a _table border
 */
class BorderToolBar {
  /**
   * @constructor
   */
  constructor() {
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
    button.querySelector('svg').addEventListener('click', (event) => {
      event.stopPropagation();
      const e = new CustomEvent('click', {'detail': {'x': event.pageX, 'y': event.pageY}, 'bubbles': true});

      this._toolBar.dispatchEvent(e);
    });
    return button;
  }

  /**
   * Generates line which сover border of _table
   * @private
   */
  _generateHighlightingLine() {
    const line = create('div', [CSS.highlightingLine]);

    line.addEventListener('click', (event) => {
      event.stopPropagation();
      const e = new CustomEvent('click', {'bubbles': true});

      this._toolBar.dispatchEvent(e);
    });
    return line;
  }

  /**
   * Generates the main component of the class
   * @param {Element[]} children - child elements of toolbar
   * @private
   */
  _generateToolBar(children) {
    return create('div', [CSS.hidden], null, children);
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
    super();

    this._toolBar.classList.add(CSS.horizontalToolBar);
    this._plusButton.classList.add(CSS.horizontalPlusButton);
    this._highlightingLine.classList.add(CSS.horizontalHighlightingLine);
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
    super();

    this._toolBar.classList.add(CSS.verticalToolBar);
    this._plusButton.classList.add(CSS.verticalPlusButton);
    this._highlightingLine.classList.add(CSS.verticalHighlightingLine);
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
