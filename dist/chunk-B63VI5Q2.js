import { processImages, particlesBackgroundLayerStyle, getParticlesContainerLayerStyle, getParticlesBackgroundLayerStyle, createParticles, startScreensaver } from './chunk-MQOQL5F2.js';
import { Particular } from './chunk-OOHJXDS5.js';
import { configureParticular, configureParticle, Emitter, Vector, presets } from './chunk-EC3NJVOO.js';
import { CanvasRenderer } from './chunk-KAFFPNOE.js';
import { WebGLRenderer } from './chunk-RITFPPIO.js';
import React, { useRef, useState, useEffect, useCallback, Component } from 'react';
import { createPortal } from 'react-dom';
import { jsx, jsxs } from 'react/jsx-runtime';

var CanvasWrapper = class extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.onWindowResize = () => {
      this.particular.onResize();
      const height = window.innerHeight;
      const width = window.innerWidth;
      this.setState({ width, height });
    };
    this.configure = (configuration) => {
      this.configuration = configureParticular(configuration);
      this.particular.initialize(this.configuration);
      if (this.canvas) {
        const renderer = this.configuration?.renderer === "webgl" ? new WebGLRenderer(this.canvas, {
          maxInstances: this.configuration?.webglMaxInstances
        }) : new CanvasRenderer(this.canvas);
        this.particular.addRenderer(renderer);
      }
      if (this.configuration.autoStart) {
        this.create({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }
    };
    this.create = (settings) => {
      if (!this.configuration) return;
      const combinedSettings = configureParticle(settings, this.configuration);
      let icons = [];
      if (combinedSettings.icons) {
        icons = processImages(combinedSettings.icons);
      }
      const x = (settings?.x ?? 0) / this.configuration.pixelRatio;
      const y = (settings?.y ?? 0) / this.configuration.pixelRatio;
      this.particular.addEmitter(
        new Emitter({
          point: new Vector(x, y),
          ...combinedSettings,
          icons
        })
      );
    };
    this.state = { width: 100, height: 100 };
    this.particular = new Particular();
  }
  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
    this.particular.destroy();
  }
  render() {
    return /* @__PURE__ */ jsx(
      "canvas",
      {
        ref: (canvas) => {
          this.canvas = canvas;
        },
        className: "particular",
        width: this.state.width,
        height: this.state.height,
        style: {
          ...particlesBackgroundLayerStyle,
          position: "absolute",
          width: this.state.width,
          height: this.state.height,
          cursor: "auto",
          opacity: 1,
          zIndex: this.configuration?.zIndex ?? particlesBackgroundLayerStyle.zIndex
        }
      }
    );
  }
};
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
var particularWrapper = (configuration = presets.Burst.magic) => (WrappedComponent) => {
  const { icons } = configuration;
  class ParticularWrapper extends Component {
    constructor(props) {
      super(props);
      this.particles = null;
      this.burst = (settings) => {
        if (this.particles && settings.clientX !== void 0 && settings.clientY !== void 0) {
          this.particles.create({
            x: settings.clientX,
            y: settings.clientY,
            ...settings,
            icons: icons ?? settings.icons
          });
        }
      };
      this.portalContainer = document.createElement("div");
      document.body.appendChild(this.portalContainer);
    }
    componentDidMount() {
      if (this.particles) {
        this.particles.configure(configuration);
      }
    }
    componentWillUnmount() {
      if (this.portalContainer.parentNode) {
        this.portalContainer.parentNode.removeChild(this.portalContainer);
      }
    }
    render() {
      const wrappedProps = {
        ...this.props,
        burst: this.burst
      };
      return /* @__PURE__ */ jsxs("div", { children: [
        createPortal(
          /* @__PURE__ */ jsx(
            CanvasWrapper,
            {
              ref: (particles) => {
                this.particles = particles;
              }
            }
          ),
          this.portalContainer
        ),
        /* @__PURE__ */ jsx(WrappedComponent, { ...wrappedProps })
      ] });
    }
  }
  ParticularWrapper.displayName = `Particular(${getDisplayName(WrappedComponent)})`;
  return ParticularWrapper;
};
var ParticularWrapper_default = particularWrapper;
var withParticles = particularWrapper;
function equalConfig(a, b) {
  if (Object.is(a, b)) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const prototype = Object.getPrototypeOf(a);
  if (prototype !== Object.getPrototypeOf(b)) return false;
  if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== Vector.prototype)
    return false;
  const left = a;
  const right = b;
  const keys = Object.keys(left);
  return keys.length === Object.keys(right).length && keys.every(
    (key) => Object.prototype.hasOwnProperty.call(right, key) && equalConfig(left[key], right[key])
  );
}
function useStableConfig(config) {
  const ref = useRef(config);
  if (!equalConfig(ref.current, config)) ref.current = config;
  return ref.current;
}

// src/particular/useParticles.ts
function useParticles({
  preset = "magic",
  config,
  renderer = "webgl",
  autoResize = true,
  autoClick = false,
  clickTarget,
  backgroundLayer = true,
  container,
  mouseForce
} = {}) {
  const canvasRef = useRef(null);
  const controllerRef = useRef(null);
  const [controller, setController] = useState(null);
  const stableConfig = useStableConfig(config);
  const stableMouseForce = useStableConfig(mouseForce);
  const canvasStyle = container ? getParticlesContainerLayerStyle(config?.zIndex) : backgroundLayer ? getParticlesBackgroundLayerStyle(config?.zIndex) : void 0;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller2 = createParticles({
      canvas,
      preset,
      config: stableConfig,
      renderer,
      autoResize,
      autoClick,
      clickTarget,
      container,
      mouseForce: stableMouseForce
    });
    controllerRef.current = controller2;
    setController(controller2);
    return () => {
      controller2.destroy();
      controllerRef.current = null;
      setController(null);
    };
  }, [
    preset,
    stableConfig,
    renderer,
    autoResize,
    autoClick,
    clickTarget,
    container,
    stableMouseForce
  ]);
  const requireController = useCallback(() => {
    const active = controllerRef.current;
    if (!active)
      throw new Error("Particular: the canvas must be mounted before creating particles.");
    return active;
  }, []);
  const burst = useCallback((options) => {
    controllerRef.current?.burst(options);
  }, []);
  const burstFromEvent = useCallback(
    (event, overrides) => {
      const { clientX, clientY } = event;
      controllerRef.current?.burst({
        x: clientX,
        y: clientY,
        ...overrides ?? {}
      });
    },
    []
  );
  const explode = useCallback((options) => {
    controllerRef.current?.explode(options);
  }, []);
  const scatter = useCallback((options) => {
    controllerRef.current?.scatter(options);
  }, []);
  const startWobble = useCallback((config2) => {
    controllerRef.current?.startWobble(config2);
  }, []);
  const stopWobble = useCallback(() => {
    controllerRef.current?.stopWobble();
  }, []);
  const imageToParticles = useCallback(
    async (config2) => {
      return requireController().imageToParticles(config2);
    },
    [requireController]
  );
  const textToParticles = useCallback(
    async (text, config2) => {
      return requireController().textToParticles(text, config2);
    },
    [requireController]
  );
  const elementToParticles = useCallback(
    async (element, config2) => {
      return requireController().elementToParticles(element, config2);
    },
    [requireController]
  );
  const shatterImage = useCallback(
    async (config2) => {
      return requireController().shatterImage(config2);
    },
    [requireController]
  );
  const shatterText = useCallback(
    async (text, config2) => {
      return requireController().shatterText(text, config2);
    },
    [requireController]
  );
  const setIdleEffect = useCallback((enabled) => {
    controllerRef.current?.setIdleEffect(enabled);
  }, []);
  return {
    canvasRef,
    canvasKey: renderer,
    canvasStyle,
    controller,
    burst,
    burstFromEvent,
    explode,
    scatter,
    startWobble,
    stopWobble,
    imageToParticles,
    textToParticles,
    elementToParticles,
    shatterImage,
    shatterText,
    setIdleEffect
  };
}
function useScreensaver({
  preset = "snow",
  config,
  renderer = "webgl",
  autoResize = true,
  backgroundLayer = true,
  mouseWind,
  container
} = {}) {
  const canvasRef = useRef(null);
  const screensaverRef = useRef(null);
  const stableConfig = useStableConfig(config);
  const stableMouseWind = useStableConfig(mouseWind);
  const canvasStyle = container ? getParticlesContainerLayerStyle(config?.zIndex) : backgroundLayer ? getParticlesBackgroundLayerStyle(config?.zIndex) : void 0;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const screensaver = startScreensaver({
      canvas,
      preset,
      config: stableConfig,
      renderer,
      autoResize,
      mouseWind: stableMouseWind,
      container
    });
    screensaverRef.current = screensaver;
    return () => {
      screensaver.destroy();
      screensaverRef.current = null;
    };
  }, [preset, stableConfig, renderer, autoResize, stableMouseWind, container]);
  const destroy = useCallback(() => {
    screensaverRef.current?.destroy();
    screensaverRef.current = null;
  }, []);
  return {
    canvasRef,
    canvasKey: renderer,
    canvasStyle,
    destroy
  };
}

export { ParticularWrapper_default, useParticles, useScreensaver, withParticles };
//# sourceMappingURL=chunk-B63VI5Q2.js.map
//# sourceMappingURL=chunk-B63VI5Q2.js.map