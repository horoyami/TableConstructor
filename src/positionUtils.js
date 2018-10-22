/**
 * The object provides helper methods for working with coordinates
 */
export const Position = (function () {

    /**
     * Get item position relative to document
     * @param elem - item
     * @returns coordinates of the upper left (x1,y1) and lower right(x2,y2) corners
     */
    function getPositionOfElement(elem) {
        const rect = elem.getBoundingClientRect();
        return {
            y1: rect.top + pageYOffset,
            x1: rect.left + pageXOffset,
            x2: rect.right + pageXOffset,
            y2: rect.bottom + pageYOffset
        }
    }

    /**
     * Get item and mouse position relative to document
     * @param event - Mouse element and coordinates are taken relative to some mouse event
     * @returns coordinates of the upper left (x1,y1) and lower right(x2,y2) corners and mouse
     */
    function getPositionMouseRegardingElementByEvent(event) {
        const rect = getPositionOfElement(event.currentTarget);
        return {
            top: rect.y1,
            left: rect.x1,
            bottom: rect.y2,
            right: rect.x2,
            x: event.pageX,
            y: event.pageY
        };
    }

    return {
        getPositionOfElement: getPositionOfElement,
        getPositionMouseRegardingElementByEvent: getPositionMouseRegardingElementByEvent
    };
})();