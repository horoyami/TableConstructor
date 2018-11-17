import './borderToolBar.pcss';
import svgPlusButton from './img/plus.svg';
import {create} from './documentUtils';

const CSS = {
  highlightingLine: 'tc-toolbar',
  hidden: 'tc-toolbar--hidden',
  horizontalToolBar: 'tc-toolbar--hor',
  horizontalHighlightingLine: 'tc-toolbar__shine-line--hor',
  verticalToolBar: 'tc-toolbar--ver',
  verticalHighlightingLine: 'tc-toolbar__shine-line--ver',
  plusButton: 'tc-toolbar__plus',
  horizontalPlusButton: 'tc-toolbar__plus--hor',
  verticalPlusButton: 'tc-toolbar__plus--ver'
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
    this._toolbar = this._generateToolBar([this._plusButton, this._highlightingLine]);
  }

  /**
   * Make the entire item invisible
   */
  hide() {
    this._toolbar.classList.add(CSS.hidden);
  }

  /**
   * Make the entire item visible
   */
  show() {
    this._toolbar.classList.remove(CSS.hidden);
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
    return this._toolbar;
  }

  /**
   * Generates a menu button to add rows and columns.
   * @return {HTMLElement}
   */
  _generatePlusButton() {
    const button = create('div', [ CSS.plusButton ]);

    button.innerHTML = svgPlusButton;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const e = new CustomEvent('click', {'detail': {'x': event.pageX, 'y': event.pageY}, 'bubbles': true});

      this._toolbar.dispatchEvent(e);
    });
    return button;
  }

  /**
   * Generates line which сover border of _table
   * @private
   */
  _generateHighlightingLine() {
    const line = create('div', [ CSS.highlightingLine ]);

    line.addEventListener('click', (event) => {
      event.stopPropagation();
      const e = new CustomEvent('click', {'bubbles': true});

      this._toolbar.dispatchEvent(e);
    });
    return line;
  }

  /**
   * Generates the main component of the class
   * @param {Element[]} children - child elements of toolbar
   * @private
   */
  _generateToolBar(children) {
    return create('div', [ CSS.hidden ], null, children);
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

    this._toolbar.classList.add(CSS.horizontalToolBar);
    this._plusButton.classList.add(CSS.horizontalPlusButton);
    this._highlightingLine.classList.add(CSS.horizontalHighlightingLine);
  }

  /**
   * Move ToolBar to y coord
   * @param {number} y - coord
   */
  showIn(y) {
    const halfHeight = Math.floor(Number.parseInt(getComputedStyle(this._toolbar).height) / 2);

    this._toolbar.style.top = (y - halfHeight) + 'px';
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

    this._toolbar.classList.add(CSS.verticalToolBar);
    this._plusButton.classList.add(CSS.verticalPlusButton);
    this._highlightingLine.classList.add(CSS.verticalHighlightingLine);
  }

  /**
   * Move ToolBar to x coord
   * @param {number} x - coord
   */
  showIn(x) {
    const halfWidth = Math.floor(Number.parseInt(getComputedStyle(this._toolbar).width) / 2);

    this._toolbar.style.left = (x - halfWidth) + 'px';
    this.show();
  }
}
