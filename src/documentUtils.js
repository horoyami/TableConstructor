/**
 * The object provides helper methods for working with DOM
 */
export const DOM = (function () {

    /**
     * Create DOM element with set parameters
     * @param tagName - Html tag of the element to be created
     * @param cssClasses - Css classes that must be applied to an element
     * @param attrs - Attributes that must be applied to the element
     */
    function createDOMElement(tagName, cssClasses, attrs) {
        const elem = document.createElement(tagName);
        for(let i = 0; i < cssClasses.length; i++) {
            elem.classList.add(cssClasses[i]);
        }
        for(let key in attrs) {
            elem.setAttribute(key, attrs[key]);
        }
        console.dir(elem);
        console.log(elem);
        return elem;
    }
    
    return {
        createDOMElement: createDOMElement
    };
})();