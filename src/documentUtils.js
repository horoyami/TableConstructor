/**
 * The object provides helper methods for working with DOM
 */
export const DOM = (function () {

    /**
     * Checks if there is any important information in the variable
     * @param elem - elememt
     * @returns {boolean} true if element contains something
     * @private
     */
    function _checkElementExisting(elem) {
        return (!(elem === undefined || elem === null));
    }

    /**
     * Create DOM element with set parameters
     * @param tagName - Html tag of the element to be created
     * @param cssClasses - Css classes that must be applied to an element
     * @param attrs - Attributes that must be applied to the element
     * @param children - child elements of creating element
     */
    function createDOMElement(tagName, cssClasses, attrs, children) {
        const elem = document.createElement(tagName);
        if (_checkElementExisting(cssClasses)) {
            for (let i = 0; i < cssClasses.length; i++) {
                elem.classList.add(cssClasses[i]);
            }
        }
        if (_checkElementExisting(attrs)) {
            for (let key in attrs) {
                elem.setAttribute(key, attrs[key]);
            }
        }
        if (_checkElementExisting(children)) {
            for(let i = 0; i < children.length; i++) {
                elem.appendChild(children[i]);
            }
        }
        return elem;
    }

    return {
        createDOMElement: createDOMElement
    };
})();