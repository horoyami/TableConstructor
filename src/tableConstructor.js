import './tableConstructor.scss';
import {getCoords, create} from './documentUtils';
import {addDetectionAreas} from './DetectionAreas';
import {HorizontalBorderToolBar, VerticalBorderToolBar} from './borderToolBar';
import {Table} from './table';

const CSS = {
  editor: 'tcm-table-editor',
  toolBarHor: 'tcm-border-menu--horizontal',
  toolBarVer: 'tcm-border-menu--vertical'
};

/**
 * Entry point. Controls table and give API to user
 */
export class TableConstructor {
  /**
   * Creates
   */
  constructor() {
    /** creating table */
    this._table = this._createBlankTable();

    /** creating container around table */
    this._container = create('div', [CSS.editor], null, [this._table.htmlElement]);
    addDetectionAreas(this._container, false);

    /** creating ToolBars */
    this._verticalToolBar = new VerticalBorderToolBar();
    this._horizontalToolBar = new HorizontalBorderToolBar();
    this._table.htmlElement.appendChild(this._horizontalToolBar.htmlElement);
    this._table.htmlElement.appendChild(this._verticalToolBar.htmlElement);

    /** Activated elements */
    this._coveredBlock = null;
    this._activatedToolBar = null;
    this._side = null;

    /** Timer for delay plus button */
    this._plusButDelay = null;

    this._hangEvents();
  }

  /**
   * returns html element of TableConstructor;
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._container;
  }

  /**
   * Creates clear table
   * @return {Table}
   * @private
   */
  _createBlankTable() {
    const table = new Table();
    table.addColumn();
    table.addColumn();
    table.addRow();
    table.addRow();
    return table;
  }

  /**
   * Remembers after which element to insert a row or column.
   * @param {HTMLElement} content - the element
   * @private
   */
  _setHoverBlock(content) {
    this._coveredBlock = content;
    while (!(this._coveredBlock === null || this._coveredBlock.tagName === 'TD' || this._coveredBlock === this._container)) {
      this._coveredBlock = this._coveredBlock.parentElement;
    }
  }

  /**
   * Show ToolBar
   * @param {BorderToolBar} toolBar - which toolbar to show
   * @param {numver} coord - where show. x or y depending on the grade of the toolbar
   * @private
   */
  _showToolBar(toolBar, coord) {
    this._hideToolBar();
    this._activatedToolBar = toolBar;
    toolBar.showIn(coord);
  }

  /**
   * Hide all of toolbars
   * @private
   */
  _hideToolBar() {
    if (this._activatedToolBar !== null) {
      this._activatedToolBar.hide();
    }
  }

  /**
   * hang necessary events
   * @private
   */
  _hangEvents() {
    this._container.addEventListener('mouseInActivatingArea', (event) => {
      this._mouseInActivatingAreaListener(event);
    });

    this._container.addEventListener('click', (event) => {
      this._clickListener(event);
    });

    this._container.addEventListener('input', () => {
      this._hideToolBar();
    });

    this._container.addEventListener('keydown', (event) => {
      this._keyDownListener(event);
    });
  }

  /**
   * detects a mouseenter on a special area
   * @param event
   * @private
   */
  _mouseInActivatingAreaListener(event) {
    this._side = event.detail.side;
    const areaCoords = getCoords(event.target);
    const containerCoords = getCoords(this._table.htmlElement);
    this._setHoverBlock(event.target);

    //console.log(event.target.parentElement);

    if (this._side === 'top') {
      this._showToolBar(this._horizontalToolBar, areaCoords.y1 - containerCoords.y1 - 1);
    }
    if (this._side === 'bottom') {
      this._showToolBar(this._horizontalToolBar, areaCoords.y2 - containerCoords.y1);
    }
    if (this._side === 'left') {
      this._showToolBar(this._verticalToolBar, areaCoords.x1 - containerCoords.x1 - 1);
    }
    if (this._side === 'right') {
      this._showToolBar(this._verticalToolBar, areaCoords.x2 - containerCoords.x1);
    }
  }

  /**
   * handling clicks on items
   * @param {object} event
   * @private
   */
  _clickListener(event) {
    if (event.target.classList.contains(CSS.toolBarHor) || event.target.classList.contains(CSS.toolBarVer)) {
      if (this._activatedToolBar === this._horizontalToolBar) {
        this._addRow();
        this._handleDetail(event, 'y');
      } else {
        this._addColumn();
        this._handleDetail(event, 'x');
      }
    }
  }

  /**
   * Processes additional information transmitted with the event and applies the necessary actions
   * @param {object} event
   * @param {string} typeCoord - type of coord 'x' ot 'y'
   * @private
   */
  _handleDetail(event, typeCoord) {
    if ((typeof event.detail) !== "number" && event.detail !== null) {
      const containerCoords = getCoords(this.tbody);
      let coord;
      if (typeCoord === 'x') {
        coord = event.detail.x - containerCoords.x1;
      } else {
        coord = event.detail.y - containerCoords.y1;
      }
      this._delayAddButtonForMultiClickingNearMouse(coord);
    } else {
      this._hideToolBar();
    }
  }

  /**
   * detects button presses
   * @param {object} event
   * @private
   */
  _keyDownListener(event) {
    if (event.code === 'Enter') {
      this._enterPressed(event);
    }
  }

  /**
   * Leaves the PlusButton active under mouse
   * The timer gives time to press the button again, before it disappears.
   * While the button is being pressed, the timer will be reset
   * @param {number} coord - coords of mouse. x or y depending on the grade of the toolbar
   * @private
   */
  _delayAddButtonForMultiClickingNearMouse(coord) {
    this._showToolBar(this._activatedToolBar, coord);
    this._activatedToolBar.hideLine();
    clearTimeout(this._plusButDelay);
    this._plusButDelay = setTimeout(() => {
      this._hideToolBar();
    }, 500);
  }

  /**
   * Calculates the place where you can insert a new row or column so that it is immediately after the child element.
   * @param {HTMLElement} parent - where to insert
   * @param {HTMLELement} child - insert immediately after that
   * @param {boolean} withAnError - Whether to consider border type
   * @return {number} - index, where insert
   * @private
   */
  _calculateToolBarPosition(parent, child, withAnError = true) {
    if (this._coveredBlock === this._container) {
      return (this._side === 'top' || this._side === 'left') ? Infinity : 0;
    }
    let index = 0;
    /** Runs through the array in search of an element */
    for (index; index < parent.children.length; index++) {
      if (parent.children[index] === child) {
        break;
      }
    }
    /** If the node must be placed after the element */
    if (withAnError == true && (this._side === 'bottom' || this._side == 'right')) {
      index++;
    }
    return index;
  }

  /**
   * returns tbody element of table
   * @return {HTMLElement}
   */
  get tbody() {
    return this._table.htmlElement.firstChild;
  }

  /**
   * Adds row in table
   * @private
   */
  _addRow() {
    const index = this._calculateToolBarPosition(this.tbody, this._coveredBlock.parentElement);
    this._table.addRow(index);
  }

  /**
   * Adds column in table
   * @private
   */
  _addColumn() {
    const index = this._calculateToolBarPosition(this._coveredBlock.parentElement, this._coveredBlock);
    this._table.addColumn(index);
  }

  /**
   * if "cntrl + Eneter" is pressed then create new line under current and focus it
   * @param {object} event
   * @private
   */
  _enterPressed(event) {
    if (this._table.selectedCell !== null && event.ctrlKey) {
      const index = this._calculateToolBarPosition(this.tbody, this._table.selectedCell.parentElement, false);
      const newstr = this._table.addRow(index + 1);
      newstr.firstElementChild.click();
    }
  }
}
