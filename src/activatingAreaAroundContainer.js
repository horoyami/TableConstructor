import {createDOMElement} from './documentUtils';
import './activatingAreaAroundContainer.css';

const CSS = {
  mainContainer: 'tcm-around-container',
  horizontalArea: 'tcm-around-container__horizontal-area',
  verticalArea: 'tcm-around-container__vertical-area',
  rowContainer: 'tcm-around-container__row-container'
};

/**
 * Container with area around, where mouse detected
 */
export class ActivatingAreaAroundContainer {
  /**
   * Create the container
   * @param {HTMLElement} content - container contents
   * @param {boolean} isOutside - If true, then check the output from the container
   * @constructor
   */
  constructor(content, isOutside = true) {
    this._isOutside = isOutside;
    this._content = content;
    this._container = this._createMainContainer();
  }

  /**
   * Returns html element of main container
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._container;
  }

  /**
   * Creates html element of container
   * @return {HTMLElement} - the container
   * @private
   */
  _createMainContainer() {
    return createDOMElement('div', [ CSS.mainContainer ], null, [
      this._createActivatingArea((this._isOutside ? 'top' : 'bottom'), CSS.horizontalArea),
      this._createInlineAreaContent(),
      this._createActivatingArea((this._isOutside ? 'bottom' : 'top'), CSS.horizontalArea)
    ]);
  }

  /**
   * Creates area that detects mouse enter
   * @param side - where area is
   * @param style - additional styles
   * @return {HTMLElement} - the area html element
   * @private
   */
  _createActivatingArea(side, style) {
    const area = createDOMElement('div', [ style ]);

    area.addEventListener('mouseenter', () => {
      area.dispatchEvent(new CustomEvent('mouseInActivatingArea', {
        'detail': {
          'side': side
        },
        'bubbles': true
      }));
    });
    return area;
  }

  /**
   * Create vertical container with activating area in start and in end
   * @return {HTMLElement} - the container
   * @private
   */
  _createInlineAreaContent() {
    return createDOMElement('div', [ CSS.rowContainer ], null, [
      this._createActivatingArea((this._isOutside ? 'left' : 'right'), CSS.verticalArea),
      this._content,
      this._createActivatingArea((this._isOutside ? 'right' : 'left'), CSS.verticalArea)
    ]);
  }
}
