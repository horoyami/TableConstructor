import './tableConstructor.css';
import {getCoords} from './documentUtils';
import {ContainerWithDetectionAreas} from './containerWithDetectionAreas';
import {HorizontalBorderToolBar, VerticalBorderToolBar} from './borderToolBar';
import {Table} from './table';

const CSS = {
  editor: 'tcm-table-editor',
  plusButton: 'tcm-border-menu__plus-button'
};

/**
 * Entry point. Controls table and give API to user
 */
export class TableConstructor {
  /**
   * Creates
   */
  constructor() {
    this._table = this._createBlankTable();
    this._container = new ContainerWithDetectionAreas(this._table.htmlElement, false);
    this._container.htmlElement.classList.add(CSS.editor);
    this._verticalToolBar = new VerticalBorderToolBar();
    this._horizontalToolBar = new HorizontalBorderToolBar();
    this._container.htmlElement.appendChild(this._verticalToolBar.htmlElement);
    this._container.htmlElement.appendChild(this._horizontalToolBar.htmlElement);
    this._coveredBlock = null;
    this._activatedToolBar = null;
    this._hangEvents();
  }

  /**
   * returns html element of TableConstructor;
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._container.htmlElement;
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
   * @param content - the element
   * @private
   */
  _setHoverBlock(content) {
    this._coveredBlock = content;
    while (!(this._coveredBlock === null || this._coveredBlock.tagName === 'TD' || this._coveredBlock === this._container.htmlElement)) {
      this._coveredBlock = this._coveredBlock.parentElement;
    }
  }

  /**
   * Show ToolBar
   * @param {BorderToolBar} toolBar - which toolbar to show
   * @param coord - where show
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
    this._container.htmlElement.addEventListener('mouseInActivatingArea', (event) => {
      this._side = event.detail.side;
      const areaCoords = getCoords(event.target);
      const containerCoords = getCoords(this._container.htmlElement);
      this._setHoverBlock(event.target);

      if (this._side === 'top') {
        this._showToolBar(this._horizontalToolBar, areaCoords.y1 - containerCoords.y1);
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
    });

    this._container.htmlElement.addEventListener('click', (event) => {
      if (event.target.classList.contains(CSS.plusButton)) {
        if (this._activatedToolBar === this._horizontalToolBar) {
          this._addRow();
          const containerCoords = getCoords(this._container.htmlElement);
          this._delayAddButtonForMultiClickingNearMouse(event.detail.y - containerCoords.y1);
        } else {
          this._addColumn();
          const containerCoords = getCoords(this._container.htmlElement);
          this._delayAddButtonForMultiClickingNearMouse(event.detail.x - containerCoords.x1);
        }
      }
    });

    this._container.htmlElement.addEventListener('input', () => {
      this._hideToolBar();
    });

    this._container.htmlElement.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        this._enterPressed(event);
      }
    });
  }

  /**
   * Leaves the PlusButton active under mouse for 500 milicconds so that you can poke a few more times.
   * @param coord - coords of mouse
   * @private
   */
  _delayAddButtonForMultiClickingNearMouse(coord) {
    this._showToolBar(this._activatedToolBar, coord);
    this._activatedToolBar.hideLine();
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
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
    if (this._coveredBlock === this._container.htmlElement) {
      return (this._side === 'top' || this._side === 'left') ? Infinity : 0;
    }
    let index = 0;
    // Runs through the array in search of an element
    while (index < parent.children.length && parent.children[index] !== child) {
      index++;
    }
    // If the node must be placed after the element
    if (withAnError == true && (this._side === 'bottom' || this._side == 'right')) {
      index++;
    }
    return index;
  }

  /**
   * returns tbody element of table
   * @return {HTMLElement}
   * @private
   */
  get _tbody() {
    return this._table.htmlElement.firstChild;
  }

  /**
   * Adds row in table
   * @private
   */
  _addRow() {
    const index = this._calculateToolBarPosition(this._tbody, this._coveredBlock.parentElement);
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
   * @param event
   * @private
   */
  _enterPressed(event) {
    if (this._table.selectedSell !== null && event.ctrlKey) {
      const index = this._calculateToolBarPosition(this._tbody, this._table.selectedSell.parentElement, false);
      const newstr = this._table.addRow(index + 1);
      newstr.firstElementChild.click();
    }
  }
}
