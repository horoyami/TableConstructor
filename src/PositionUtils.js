export let Position = (function () {

    function getPositionOfElement(elem) {
        let rect = elem.getBoundingClientRect();
        return {
            y1: rect.top + pageYOffset,
            x1: rect.left + pageXOffset,
            x2: rect.right + pageXOffset,
            y2: rect.bottom + pageYOffset
        }
    }

    function getPositionMouseRegardingElementByEvent(event) {
        let rect = getPositionOfElement(event.currentTarget);
        console.log()
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