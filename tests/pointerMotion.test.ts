import { describe, expect, it } from 'vitest';
import PointerMotion from '../src/particular/utils/pointerMotion';

describe('normalized pointer motion', () => {
  it.each([30, 60, 120, 144, 240])('preserves cursor speed and event batching at %i Hz', (hz) => {
    const motion = new PointerMotion();
    const dt = 60 / hz;
    motion.record(100, 100);
    expect(motion.consume(dt)).toBeNull();
    for (let i = 1; i <= hz; i++) {
      for (let event = 1; event <= 4; event++) {
        motion.record(100 + (i - 1 + event / 4) * 2 * dt, 100 + (i - 1 + event / 4) * dt);
      }
      const velocity = motion.consume(dt)!;
      expect(velocity.x).toBeCloseTo(2, 10);
      expect(velocity.y).toBeCloseTo(1, 10);
      expect(motion.consume(dt)).toBeNull();
    }
  });

  it('keeps movement through zero-time frames and resets on retracking', () => {
    const motion = new PointerMotion();
    motion.record(100, 100);
    motion.record(101, 100);
    expect(motion.consume(0)).toBeNull();
    expect(motion.consume(0.5)!.x).toBe(2);
    motion.reset();
    motion.record(400, 400);
    expect(motion.consume(1)).toBeNull();
  });
});
