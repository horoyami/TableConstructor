export const Position = (function () {

    function getPositionOfElement(elem) {
        const rect = elem.getBoundingClientRect();
        return {
            y1: rect.top + pageYOffset,
            x1: rect.left + pageXOffset,
            x2: rect.right + pageXOffset,
            y2: rect.bottom + pageYOffset
        }
    }

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