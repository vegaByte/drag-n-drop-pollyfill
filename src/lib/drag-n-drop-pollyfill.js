import {
  relativeCoordinatesForElementAndEvent,
  retrieveSizeForElement,
  triggerEvent,
} from '../util/helpers';

const defaultOpts = {
  dropableSelector: '.dropable',
  dragableSelector: '.dragable',
};

export class DragNDropPollyfill {
  constructor(props){
    this.opts = {
      ...defaultOpts,
      ...props,
    };

    this.dropables = [];
    this.dragging = false;

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDrop = this.handleDrop.bind(this);

    this.init = this.init.bind(this);
    this.listen = this.listen.bind(this);

    this.init();
  }

  init() {
    let dropablesElements = window.document.querySelectorAll(this.opts.dropableSelector);
    dropablesElements.forEach(dropableEl => {

      let dragables = [];
      dropableEl.querySelectorAll(this.opts.dragableSelector).forEach(dragable => {
        dragables = [...dragables, {
          el: dragable,
          parent: dropableEl,
        }];
      });

      this.dropables = [
        ...this.dropables,
        {
          el: dropableEl,
          dragables,
        }
      ];
    });

    this.listen();
  }

  handleDragStart(e, dragable) {
    this.dragging = true;
    this.draggingObject = dragable;
  }

  handleDrop(e) {
    if ( !this.dragging ) return;
    this.dragging = false;
    this.draggingObject.el.style.pointerEvents = 'auto';

    triggerEvent(this.draggingObject.parent, 'drop');
  }

  handleDrag(e) {
    if ( !this.dragging ) return;
    const point = relativeCoordinatesForElementAndEvent(this.draggingObject.parent, e);
    const size = retrieveSizeForElement(this.draggingObject.el);
    const offset = {
      height: size.height/2,
      width: size.width/2,
    };

    const style = {
      top: `${point.y - offset.height}px`,
      left: `${point.x - offset.width}px`,
    }

    this.draggingObject.el.style.pointerEvents = 'none';
    this.draggingObject.el.style.left = style.left;
    this.draggingObject.el.style.top = style.top;

    triggerEvent(this.draggingObject.el, 'drag');
  }

  listen() {
    this.dropables.forEach(dropable => {
      dropable.dragables.forEach(dragable => {
        dragable.el.addEventListener('click', e => this.handleDragStart(e, dragable));
      });
      dropable.el.addEventListener('mousedown', this.handleDrop);
      dropable.el.addEventListener('mousemove', this.handleDrag);
    });
  }

};
