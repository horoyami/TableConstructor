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

export function addDetectionAreas(elem, isOutside) {
  const topArea = createActivatingArea((this._isOutside ? 'top' : 'bottom'), [CSS.horizontalArea, CSS.top]);
  const leftArea = createActivatingArea((this._isOutside ? 'left' : 'right'), [CSS.verticalArea, CSS.left]);
  const rightArea = createActivatingArea((this._isOutside ? 'right' : 'left'), [CSS.verticalArea, CSS.right]);
  const bottomArea = createActivatingArea((this._isOutside ? 'bottom' : 'top'), [CSS.horizontalArea, CSS.bottom]);
  elem.appendChild(topArea);
  elem.appendChild(leftArea);
  elem.appendChild(rightArea);
  elem.appendChild(bottomArea);
}

/**
 * Creates area that detects mouse enter
 * @param {string} side - where area is (top, bottom, left, right)
 * @param {string[]} style - additional styles
 * @return {HTMLElement} - the area html element
 * @private
 */
function createActivatingArea(side, style) {
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

