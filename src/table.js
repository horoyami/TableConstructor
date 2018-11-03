import {create} from './documentUtils';
import {addDetectionAreas} from './DetectionAreas';
import './table.scss';

const CSS = {
  table: 'tcm-editable-table',
  inputField: 'tcm-editable-table__input-field',
  cell: 'tcm-editable-table__cell',
  wrapper: 'tcm-editable-table__wrapper'
};

/**
 * Generates and manages _table contents.
 */
export class Table {
  /**
   * Creates
   */
  constructor() {
    this._numberOfColumns = 0;
    this._numberOfRows = 0;
    this._table = this._createTableWrapper();
  }

  /**
   * Add column in table on index place
   * @param {number} index
   */
  addColumn(index = Infinity) {
    this._numberOfColumns++;
    /** Add cell in each row */
    const rows = this._table.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
      const cell = this._createClearCell();

      this._addChildToElem(rows[i], index, cell);
    }
  };

  /**
   * Add row in table on index place
   * @param {number} index
   * @return {HTMLElement} row
   */
  addRow(index = Infinity) {
    this._numberOfRows++;
    const row = this._createClearRow();

    this._addChildToElem(this._table.querySelector('tbody'), index, row);
    return row;
  };

  /**
   * get html element of table
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._table;
  }

  /**
   * returns selected/editable cell
   * @return {HTMLElement}
   */
  get selectedCell() {
    return this._selectedCell;
  }

  /**
   * Creates table structure
   * @return {HTMLElement} tbody - where rows will be
   * @private
   */
  _createTableWrapper() {
    let table = create('div', [CSS.wrapper], null, [create('table', [CSS.table], null, [create('tbody')])]);

    return table;
  }

  /**
   * Create editable area of cell
   * @param {HTMLElement} cell - cell for which area is created
   * @return {HTMLElement} - the area
   * @private
   */
  _createContenteditableArea(cell) {
    const div = create('div', [CSS.inputField], {contenteditable: 'true'});

    div.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' && !event.shiftKey) {
        event.preventDefault();
      }
    });
    div.addEventListener('focus', () => {
      this._selectedCell = cell;
    });
    div.addEventListener('blur', () => {
      this._selectedCell = null;
    });
    return div;
  }

  /**
   * Creates clear cell
   * @return {HTMLElement} - the cell
   * @private
   */
  _createClearCell() {
    const cell = create('td', [CSS.cell]);
    const content = this._createContenteditableArea(cell);

    cell.appendChild(content);
    addDetectionAreas(cell, true);

    cell.addEventListener('click', () => {
      /** Get to the edited part of the cell */
      content.focus();
    });
    return cell;
  }

  /**
   * Add child element to elem's children on index place
   * @param {HTMLElement} elem - container for child
   * @param {number} index - place where child will be
   * @param child - element for insert
   * @private
   */
  _addChildToElem(elem, index, child) {
    /** if index is bigger than length of array then add in end */
    const indexToInsert = (index >= elem.children.length) ? null : elem.children[index];

    elem.insertBefore(child, indexToInsert);
  }

  /**
   * creates clear row
   * @return {HTMLElement} the row
   * @private
   */
  _createClearRow() {
    const str = create('tr');

    for (let i = 0; i < this._numberOfColumns; i++) {
      str.appendChild(this._createClearCell());
    }
    return str;
  }
}
