/*
 * Originally
 * EventDispatcher
 * Visit http://createjs.com/ for documentation, updates and examples.
 * Copyright (c) 2010 gskinner.com, inc.
 *
 *
 */

export default class EventDispatcher {
  constructor() {
    this.listeners = null;
  }

  /* eslint-disable */
  static bind(TargetClass) {
    TargetClass.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent;
    TargetClass.prototype.hasEventListener = EventDispatcher.prototype.hasEventListener;
    TargetClass.prototype.addEventListener = EventDispatcher.prototype.addEventListener;
    TargetClass.prototype.removeEventListener = EventDispatcher.prototype.removeEventListener;
    TargetClass.prototype.removeAllEventListeners =
      EventDispatcher.prototype.removeAllEventListeners;
  }
  /* eslint-enable */

  addEventListener(type, listener) {
    if (!this.listeners) {
      this.listeners = {};
    } else {
      this.removeEventListener(type, listener);
    }

    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);

    return listener;
  }

  removeEventListener(type, listener) {
    if (!this.listeners) return;
    if (!this.listeners[type]) return;

    const arr = this.listeners[type];
    const { length } = arr;

    for (let i = 0; i < length; i++) {
      if (arr[i] === listener) {
        if (length === 1) {
          delete this.listeners[type];
        } else {
          // allows for faster checks.
          arr.splice(i, 1);
        }

        break;
      }
    }
  }

  removeAllEventListeners(type) {
    if (!type) this.listeners = null;
    else if (this.listeners) delete this.listeners[type];
  }

  dispatchEvent(type, args) {
    let result = false;

    if (type && this.listeners) {
      let arr = this.listeners[type];
      if (!arr) return result;

      // to avoid issues with items being removed or added during the dispatch
      arr = arr.slice();

      let handler;
      let i = arr.length;
      while (i--) {
        handler = arr[i];
        result = result || handler(args);
      }
    }

    return !!result;
  }

  hasEventListener(type) {
    return !!(this.listeners && this.listeners[type]);
  }
}
