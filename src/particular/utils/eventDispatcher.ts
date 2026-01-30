/*
 * Originally
 * EventDispatcher
 * Visit http://createjs.com/ for documentation, updates and examples.
 * Copyright (c) 2010 gskinner.com, inc.
 *
 */

type EventHandler<T = unknown> = (args?: T) => boolean | void;

interface EventListeners {
  [eventType: string]: EventHandler[];
}

export interface IEventDispatcher {
  addEventListener<T = unknown>(type: string, listener: EventHandler<T>): EventHandler<T>;
  removeEventListener<T = unknown>(type: string, listener: EventHandler<T>): void;
  removeAllEventListeners(type?: string): void;
  dispatchEvent<T = unknown>(type: string, args?: T): boolean;
  hasEventListener(type: string): boolean;
}

export default class EventDispatcher implements IEventDispatcher {
  private listeners: EventListeners | null = null;

  static bind(TargetClass: any): void {
    TargetClass.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent;
    TargetClass.prototype.hasEventListener = EventDispatcher.prototype.hasEventListener;
    TargetClass.prototype.addEventListener = EventDispatcher.prototype.addEventListener;
    TargetClass.prototype.removeEventListener = EventDispatcher.prototype.removeEventListener;
    TargetClass.prototype.removeAllEventListeners =
      EventDispatcher.prototype.removeAllEventListeners;
  }

  addEventListener<T = unknown>(type: string, listener: EventHandler<T>): EventHandler<T> {
    if (!this.listeners) {
      this.listeners = {};
    } else {
      this.removeEventListener(type, listener);
    }

    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type]!.push(listener as EventHandler);

    return listener;
  }

  removeEventListener<T = unknown>(type: string, listener: EventHandler<T>): void {
    if (!this.listeners) return;
    if (!this.listeners[type]) return;

    const arr = this.listeners[type]!;
    const { length } = arr;

    for (let i = 0; i < length; i++) {
      if (arr[i] === listener) {
        if (length === 1) {
          delete this.listeners[type];
        } else {
          arr.splice(i, 1);
        }
        break;
      }
    }
  }

  removeAllEventListeners(type?: string): void {
    if (!type) {
      this.listeners = null;
    } else if (this.listeners) {
      delete this.listeners[type];
    }
  }

  dispatchEvent<T = unknown>(type: string, args?: T): boolean {
    let result = false;

    if (type && this.listeners) {
      let arr = this.listeners[type];
      if (!arr) return result;

      // to avoid issues with items being removed or added during the dispatch
      arr = arr.slice();

      let handler: EventHandler;
      let i = arr.length;
      while (i--) {
        handler = arr[i]!;
        result = result || !!handler(args);
      }
    }

    return result;
  }

  hasEventListener(type: string): boolean {
    return !!(this.listeners && this.listeners[type]);
  }
}
