import React, { useEffect, useState } from 'react';
import type { Preview } from '@storybook/react';
import { showFPSOverlay } from '../src/particular/devFPSOverlay';

function FPSOverlayGate({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show) return;
    const { destroy } = showFPSOverlay({});
    return destroy;
  }, [show]);

  return (
    <>
      {children}
      <button
        type="button"
        aria-label="Toggle FPS overlay"
        onClick={() => setShow((s) => !s)}
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '12px',
          zIndex: 2147483646,
          padding: '6px 10px',
          fontFamily: 'ui-monospace, monospace',
          fontSize: '11px',
          color: show ? '#fff' : '#888',
          backgroundColor: show ? '#2a2a2a' : '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        {show ? 'FPS ✓' : 'FPS'}
      </button>
    </>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <FPSOverlayGate>
        <Story />
      </FPSOverlayGate>
    ),
  ],
};

export default preview;
