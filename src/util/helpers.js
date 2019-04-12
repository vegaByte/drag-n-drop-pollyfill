export function relativeCoordinatesForElementAndEvent(element, event) {
  const boundingRect = element.getBoundingClientRect();
  
  return {
    x: event.clientX - boundingRect.left,
    y: event.clientY - boundingRect.top,
  };
};

export function retrieveSizeForElement(element) {
  const boundingRect = element.getBoundingClientRect();
  return {
    height: boundingRect.height,
    width: boundingRect.width,
  }
};

export function triggerEvent(el, type) {
  if ('createEvent' in document) {
    // modern browsers, IE9+
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  } else {
    // IE 8
    var e = document.createEventObject();
    e.eventType = type;
    el.fireEvent('on' + e.eventType, e);
  }
};
