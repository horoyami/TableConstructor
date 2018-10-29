import {create} from './documentUtils';
import {ContainerWithDetectionAreas} from './containerWithDetectionAreas';
import './table.scss';

const CSS = {
  table: 'tcm-editable-table',
  inputField: 'tcm-editable-table__input-field',
  cell: 'tcm-editable-table__cell',
  selected: 'tcm-editable-table__cell--focus',
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
    // Add cell in each row
    for (let i = 0; i < this._table.children.length; i++) {
      const cell = this._createClearCell();
      this._addChildToElem(this._table.children[i], index, cell);
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
    this._addChildToElem(this._table, index, row);
    return row;
  };

  /**
   * get html element of table
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._table.parentElement;
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
    let table = create('table', [CSS.table], null, [create('tbody')]);
    return table.firstElementChild;
  }

  /**
   * Create editable area of cell
   * @param {HTMLElement} cell - cell for which area is created
   * @return {HTMLElement} - the area
   * @private
   */
  _createContenteditableArea(cell) {
    const div = create('div', [CSS.inputField], {contenteditable: 'true'});
    div.addEventListener('focus', () => {
      cell.classList.add(CSS.selected);
      this._selectedCell = cell;
    });
    div.addEventListener('blur', () => {
      cell.classList.remove(CSS.selected);
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
    const area = this._createActivatingConteiner(content);

    cell.appendChild(area);
    cell.addEventListener('click', () => {
      // Get to the edited part of the cell
      content.focus();
    });
    return cell;
  }

  /**
   * Create container int cell, where mouse will be detected
   * @param {HTMLElement} content - the container content
   * @return {HTMLElement} - the container
   * @private
   */
  _createActivatingConteiner(content) {
    const area = (new ContainerWithDetectionAreas(content)).htmlElement;
    area.classList.add(CSS.wrapper);
    return area;
  }

  /**
   * Add child element to elem's children on index place
   * @param {HTMLElement} elem - container for child
   * @param {number} index - place where child will be
   * @param child - element for insert
   * @private
   */
  _addChildToElem(elem, index, child) {
    // if index is bigger than length of array then add in end
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
