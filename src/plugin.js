const  TableConstructor = require("./tableConstructor").TableConstructor;
const  svgIcon = require("./img/plus.svg").toString();

/**
 *  Tool for table's creating
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
   *
   * @param {{data: TableData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - CodeX Editor API
   */
  constructor({data, config, api}) {
    this.api = api;

    this._element = new TableConstructor(data);
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
    const table = this._element.tbody;
    const data = [];
    const height = table.children.length;
    let width;

    for (let i = 0; i < height; i++) {
      const row = table.children[i];
      data.push([]);
      width = row.children.length;
      for (let j = 0; j < width; j++) {
        const cell = row.children[j];
        data[i].push(cell.firstChild.innerHTML);
      }
    }

    return {
      columns: width,
      rows: height,
      table: data
    };
  }

}

module.exports = Table;
