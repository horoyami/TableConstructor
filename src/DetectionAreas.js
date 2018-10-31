import {create} from './documentUtils';
import './DetectionAreas.scss';

const CSS = {
  mainContainer: 'tcm-around-container',
  horizontalArea: 'tcm-around-container__horizontal-area',
  verticalArea: 'tcm-around-container__vertical-area',
  rowContainer: 'tcm-around-container__row-container',
  top: 'tcm-around-container__horizontal-area--top',
  bottom: 'tcm-around-container__horizontal-area--bottom',
  left: 'tcm-around-container__vertical-area--left',
  right: 'tcm-around-container__vertical-area--right',
};

/**
 * Adds areas near borders of element, which throw event with kind of border when mouse is near the border
 * @param {HTMLElement} elem - the element
 * @param {boolean} isOutside - Determines which side of border to use, internal to the element or external
 */
export function addDetectionAreas(elem, isOutside) {
  addArea(elem, (isOutside ? 'top' : 'bottom'), [CSS.horizontalArea, CSS.top]);
  addArea(elem, (isOutside ? 'left' : 'right'), [CSS.verticalArea, CSS.left]);
  addArea(elem, (isOutside ? 'right' : 'left'), [CSS.verticalArea, CSS.right]);
  addArea(elem, (isOutside ? 'bottom' : 'top'), [CSS.horizontalArea, CSS.bottom]);
}

/**
 * Helper function for creating one zone
 * @param {HTMLElement} elem - the element
 * @param {string} side - hind of border (left, top, bottom, right)
 * @param {string[]} styles - additional styles
 */
function addArea(elem, side, styles) {
  const area = createArea(side, styles);
  elem.appendChild(area);
}

/**
 * Creates area that detects mouse enter
 * @param {string} side - where area is (top, bottom, left, right)
 * @param {string[]} style - additional styles
 * @return {HTMLElement} - the area html element
 * @private
 */
function createArea(side, style) {
  const area = create('div', style);

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
