const TableConstructor = require('./tableConstructor').TableConstructor;
const svgIcon = require('./img/plus.svg').toString();

const CSS = {
  input: 'tcm-editable-table__input-field'
};

/**
 *  Tool for table's creating
 *  @typedef {Object} TableData - object with two-dimensional array which contains table content
 */
class Table {
  /**
   * Should this tools be displayed at the Editor's Toolbox
   * @returns {boolean}
   * @public
   */
  static get displayInToolbox() {
    return true;
  }

  /**
   * Allow to press Enter inside the CodeTool textarea
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  static get toolboxIcon() {
    return svgIcon;
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   * @param {TableData} data — previously saved data
   * @param {object} config - user config for Tool
   * @param {object} api - CodeX Editor API
   */
  constructor({data, config, api}) {
    this.api = api;

    this._element = new TableConstructor(data, config);
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    return this._element.htmlElement;
  }

  /**
   * Extract Tool's data from the view
   * @returns {TableData} - saved data
   * @public
   */
  save(toolsContent) {
    const table = toolsContent.querySelector('tbody');
    const data = [];
    const rows = table.querySelectorAll('tr');
    const height = rows.length;

    for (let i = 0; i < height; i++) {
      const row = rows[i];
      const tmp = [];
      const cols = row.querySelectorAll('td');
      const width = cols.length;

      for (let j = 0; j < width; j++) {
        const cell = cols[j];

        tmp.push(cell.querySelector('.' + CSS.input).innerHTML);
      }
      data.push(tmp);
    }

    return {
      content: data
    };
  }
}

module.exports = Table;
