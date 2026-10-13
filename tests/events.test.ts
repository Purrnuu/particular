import { describe, expect, it } from 'vitest';
import EventDispatcher from '../src/particular/utils/eventDispatcher';

describe('event dispatch', () => {
  it('calls every listener even when a listener returns true', () => {
    const dispatcher = new EventDispatcher();
    const calls: string[] = [];
    dispatcher.addEventListener('event', () => {
      calls.push('first');
    });
    dispatcher.addEventListener('event', () => {
      calls.push('second');
      return true;
    });
    expect(dispatcher.dispatchEvent('event')).toBe(true);
    expect(calls).toEqual(['second', 'first']);
  });

  it('does not repeat listeners when a callback removes another callback', () => {
    const dispatcher = new EventDispatcher();
    const calls: string[] = [];
    const first = () => {
      calls.push('first');
    };
    dispatcher.addEventListener('event', first);
    dispatcher.addEventListener('event', () => {
      calls.push('second');
      dispatcher.removeEventListener('event', first);
    });
    dispatcher.dispatchEvent('event');
    expect(calls).toEqual(['second']);
  });

  it('defers listeners added during dispatch to the next event', () => {
    const dispatcher = new EventDispatcher();
    const calls: number[] = [];
    const late = () => {
      calls.push(2);
    };
    dispatcher.addEventListener('event', () => {
      calls.push(1);
      dispatcher.addEventListener('event', late);
    });
    dispatcher.dispatchEvent('event');
    expect(calls).toEqual([1]);
    dispatcher.dispatchEvent('event');
    expect(calls).toEqual([1, 2, 1]);
  });
});
