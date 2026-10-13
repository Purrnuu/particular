'use strict';

var chunkDHMBMWD6_cjs = require('./chunk-DHMBMWD6.cjs');
var chunkELTIAHJF_cjs = require('./chunk-ELTIAHJF.cjs');
var chunkDSCJ6LNA_cjs = require('./chunk-DSCJ6LNA.cjs');
var chunk4IB6HY3F_cjs = require('./chunk-4IB6HY3F.cjs');
var chunkZMNMQZSP_cjs = require('./chunk-ZMNMQZSP.cjs');
var React = require('react');
var reactDom = require('react-dom');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

var CanvasWrapper = class extends React__default.default.Component {
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
      this.configuration = chunkDSCJ6LNA_cjs.configureParticular(configuration);
      this.particular.initialize(this.configuration);
      if (this.canvas) {
        const renderer = this.configuration?.renderer === "webgl" ? new chunkZMNMQZSP_cjs.WebGLRenderer(this.canvas, {
          maxInstances: this.configuration?.webglMaxInstances
        }) : new chunk4IB6HY3F_cjs.CanvasRenderer(this.canvas);
        this.particular.addRenderer(renderer);
      }
      if (this.configuration.autoStart) {
        this.create({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }
    };
    this.create = (settings) => {
      if (!this.configuration) return;
      const combinedSettings = chunkDSCJ6LNA_cjs.configureParticle(settings, this.configuration);
      let icons = [];
      if (combinedSettings.icons) {
        icons = chunkDHMBMWD6_cjs.processImages(combinedSettings.icons);
      }
      const x = (settings?.x ?? 0) / this.configuration.pixelRatio;
      const y = (settings?.y ?? 0) / this.configuration.pixelRatio;
      this.particular.addEmitter(
        new chunkDSCJ6LNA_cjs.Emitter({
          point: new chunkDSCJ6LNA_cjs.Vector(x, y),
          ...combinedSettings,
          icons
        })
      );
    };
    this.state = { width: 100, height: 100 };
    this.particular = new chunkELTIAHJF_cjs.Particular();
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
    return /* @__PURE__ */ jsxRuntime.jsx(
      "canvas",
      {
        ref: (canvas) => {
          this.canvas = canvas;
        },
        className: "particular",
        width: this.state.width,
        height: this.state.height,
        style: {
          ...chunkDHMBMWD6_cjs.particlesBackgroundLayerStyle,
          position: "absolute",
          width: this.state.width,
          height: this.state.height,
          cursor: "auto",
          opacity: 1,
          zIndex: this.configuration?.zIndex ?? chunkDHMBMWD6_cjs.particlesBackgroundLayerStyle.zIndex
        }
      }
    );
  }
};
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}
var particularWrapper = (configuration = chunkDSCJ6LNA_cjs.presets.Burst.magic) => (WrappedComponent) => {
  const { icons } = configuration;
  class ParticularWrapper extends React.Component {
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
      return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        reactDom.createPortal(
          /* @__PURE__ */ jsxRuntime.jsx(
            CanvasWrapper,
            {
              ref: (particles) => {
                this.particles = particles;
              }
            }
          ),
          this.portalContainer
        ),
        /* @__PURE__ */ jsxRuntime.jsx(WrappedComponent, { ...wrappedProps })
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
  if (prototype !== Object.prototype && prototype !== Array.prototype && prototype !== chunkDSCJ6LNA_cjs.Vector.prototype)
    return false;
  const left = a;
  const right = b;
  const keys = Object.keys(left);
  return keys.length === Object.keys(right).length && keys.every(
    (key) => Object.prototype.hasOwnProperty.call(right, key) && equalConfig(left[key], right[key])
  );
}
function useStableConfig(config) {
  const ref = React.useRef(config);
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
  const canvasRef = React.useRef(null);
  const controllerRef = React.useRef(null);
  const [controller, setController] = React.useState(null);
  const stableConfig = useStableConfig(config);
  const stableMouseForce = useStableConfig(mouseForce);
  const canvasStyle = container ? chunkDHMBMWD6_cjs.getParticlesContainerLayerStyle(config?.zIndex) : backgroundLayer ? chunkDHMBMWD6_cjs.getParticlesBackgroundLayerStyle(config?.zIndex) : void 0;
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller2 = chunkDHMBMWD6_cjs.createParticles({
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
  const requireController = React.useCallback(() => {
    const active = controllerRef.current;
    if (!active)
      throw new Error("Particular: the canvas must be mounted before creating particles.");
    return active;
  }, []);
  const burst = React.useCallback((options) => {
    controllerRef.current?.burst(options);
  }, []);
  const burstFromEvent = React.useCallback(
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
  const explode = React.useCallback((options) => {
    controllerRef.current?.explode(options);
  }, []);
  const scatter = React.useCallback((options) => {
    controllerRef.current?.scatter(options);
  }, []);
  const startWobble = React.useCallback((config2) => {
    controllerRef.current?.startWobble(config2);
  }, []);
  const stopWobble = React.useCallback(() => {
    controllerRef.current?.stopWobble();
  }, []);
  const imageToParticles = React.useCallback(
    async (config2) => {
      return requireController().imageToParticles(config2);
    },
    [requireController]
  );
  const textToParticles = React.useCallback(
    async (text, config2) => {
      return requireController().textToParticles(text, config2);
    },
    [requireController]
  );
  const elementToParticles = React.useCallback(
    async (element, config2) => {
      return requireController().elementToParticles(element, config2);
    },
    [requireController]
  );
  const shatterImage = React.useCallback(
    async (config2) => {
      return requireController().shatterImage(config2);
    },
    [requireController]
  );
  const shatterText = React.useCallback(
    async (text, config2) => {
      return requireController().shatterText(text, config2);
    },
    [requireController]
  );
  const setIdleEffect = React.useCallback((enabled) => {
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
  const canvasRef = React.useRef(null);
  const screensaverRef = React.useRef(null);
  const stableConfig = useStableConfig(config);
  const stableMouseWind = useStableConfig(mouseWind);
  const canvasStyle = container ? chunkDHMBMWD6_cjs.getParticlesContainerLayerStyle(config?.zIndex) : backgroundLayer ? chunkDHMBMWD6_cjs.getParticlesBackgroundLayerStyle(config?.zIndex) : void 0;
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const screensaver = chunkDHMBMWD6_cjs.startScreensaver({
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
  const destroy = React.useCallback(() => {
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

exports.ParticularWrapper_default = ParticularWrapper_default;
exports.useParticles = useParticles;
exports.useScreensaver = useScreensaver;
exports.withParticles = withParticles;
//# sourceMappingURL=chunk-S5ZEBZQL.cjs.map
//# sourceMappingURL=chunk-S5ZEBZQL.cjs.map