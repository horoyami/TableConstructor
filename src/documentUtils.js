/**
 * Checks unless the item is missing
 * @param {object|array} elem - elememt
 * @returns {boolean} true if element contains something
 * @private
 */
function _checkIsNotMissing(elem) {
    return (!(elem === undefined || elem === null));
}

/**
 * Create DOM element with set parameters
 * @param {string} tagName - Html tag of the element to be created
 * @param {array} cssClasses - Css classes that must be applied to an element
 * @param {object} attrs - Attributes that must be applied to the element
 * @param {array} children - child elements of creating element
 * @returns {HTMLElement} the new element
 */
export function createDOMElement(tagName, cssClasses = null, attrs = null, children = null) {
    const elem = document.createElement(tagName);
    if (_checkIsNotMissing(cssClasses)) {
        for (let i = 0; i < cssClasses.length; i++) {
            if (_checkIsNotMissing(cssClasses[i]))
                elem.classList.add(cssClasses[i]);
        }
    }
    if (_checkIsNotMissing(attrs)) {
        for (let key in attrs) {
            elem.setAttribute(key, attrs[key]);
        }
    }
    if (_checkIsNotMissing(children)) {
        for (let i = 0; i < children.length; i++) {

            elem.appendChild(children[i]);
        }
    }
    return elem;
}

/**
 * Get item position relative to document
 * @param {HTMLElement} elem - item
 * @returns {object} coordinates of the upper left (x1,y1) and lower right(x2,y2) corners
 */
export function getCoords(elem) {
    const rect = elem.getBoundingClientRect();
    return {
        y1: rect.top + pageYOffset,
        x1: rect.left + pageXOffset,
        x2: rect.right + pageXOffset,
        y2: rect.bottom + pageYOffset
    }
}