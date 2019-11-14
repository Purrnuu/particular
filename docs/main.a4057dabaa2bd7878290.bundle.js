(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  {
    213: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1),
        react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__,
        ),
        _storiesDecorator_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(214),
        _storiesDecorator_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(
          _storiesDecorator_css__WEBPACK_IMPORTED_MODULE_1__,
        ),
        storiesDecorator = function(story) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            'div',
            { className: _storiesDecorator_css__WEBPACK_IMPORTED_MODULE_1___default.a.root },
            Object(react__WEBPACK_IMPORTED_MODULE_0__.createElement)(story),
          );
        };
      (__webpack_exports__.a = storiesDecorator),
        (storiesDecorator.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'storiesDecorator',
        }),
        'undefined' != typeof STORYBOOK_REACT_CLASSES &&
          (STORYBOOK_REACT_CLASSES['storiesDecorator/index.js'] = {
            name: 'storiesDecorator',
            docgenInfo: storiesDecorator.__docgenInfo,
            path: 'storiesDecorator/index.js',
          });
    },
    214: function(module, exports, __webpack_require__) {
      var content = __webpack_require__(414);
      'string' == typeof content && (content = [[module.i, content, '']]);
      var options = { hmr: !0, transform: void 0, insertInto: void 0 };
      __webpack_require__(416)(content, options);
      content.locals && (module.exports = content.locals);
    },
    215: function(module, exports, __webpack_require__) {
      module.exports =
        __webpack_require__.p + 'images/smiley_sad.889e801ea5fc009a301fd03436c47f26.png';
    },
    216: function(module, exports, __webpack_require__) {
      module.exports =
        __webpack_require__.p + 'images/smiley_cry.7dc8b869b03bc46cac07d874581292e8.png';
    },
    217: function(module, exports, __webpack_require__) {
      module.exports =
        __webpack_require__.p + 'images/smiley_sad_2.de029a664f05340b9c814cd050c2bb86.png';
    },
    223: function(module, exports, __webpack_require__) {
      __webpack_require__(224),
        __webpack_require__(319),
        (module.exports = __webpack_require__(320));
    },
    246: function(module, exports) {},
    320: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          __webpack_require__(54),
            __webpack_require__(55),
            __webpack_require__(53),
            __webpack_require__(71);
          var _storybook_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20),
            _storiesDecorator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(213),
            req = __webpack_require__(418);
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_4__.addDecorator)(
            _storiesDecorator__WEBPACK_IMPORTED_MODULE_5__.a,
          ),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_4__.configure)(function loadStories() {
              req.keys().forEach(req);
            }, module);
        }.call(this, __webpack_require__(154)(module));
    },
    37: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__(198);
      var classCallCheck = __webpack_require__(7),
        classCallCheck_default = __webpack_require__.n(classCallCheck),
        defineProperty = __webpack_require__(0),
        defineProperty_default = __webpack_require__.n(defineProperty),
        filter = __webpack_require__(218),
        filter_default = __webpack_require__.n(filter),
        each = __webpack_require__(35),
        each_default = __webpack_require__.n(each),
        createClass = __webpack_require__(30),
        createClass_default = __webpack_require__.n(createClass),
        eventDispatcher_EventDispatcher = (function() {
          function EventDispatcher() {
            classCallCheck_default()(this, EventDispatcher), (this.listeners = null);
          }
          return (
            createClass_default()(
              EventDispatcher,
              [
                {
                  key: 'addEventListener',
                  value: function(type, listener) {
                    return (
                      this.listeners
                        ? this.removeEventListener(type, listener)
                        : (this.listeners = {}),
                      this.listeners[type] || (this.listeners[type] = []),
                      this.listeners[type].push(listener),
                      listener
                    );
                  },
                },
                {
                  key: 'removeEventListener',
                  value: function(type, listener) {
                    if (this.listeners && this.listeners[type])
                      for (
                        var arr = this.listeners[type], length = arr.length, i = 0;
                        i < length;
                        i++
                      )
                        if (arr[i] === listener) {
                          1 === length ? delete this.listeners[type] : arr.splice(i, 1);
                          break;
                        }
                  },
                },
                {
                  key: 'removeAllEventListeners',
                  value: function(type) {
                    type ? this.listeners && delete this.listeners[type] : (this.listeners = null);
                  },
                },
                {
                  key: 'dispatchEvent',
                  value: function(type, args) {
                    var result = !1;
                    if (type && this.listeners) {
                      var arr = this.listeners[type];
                      if (!arr) return result;
                      for (var handler, i = (arr = arr.slice()).length; i--; )
                        (handler = arr[i]), (result = result || handler(args));
                    }
                    return !!result;
                  },
                },
                {
                  key: 'hasEventListener',
                  value: function(type) {
                    return !(!this.listeners || !this.listeners[type]);
                  },
                },
              ],
              [
                {
                  key: 'bind',
                  value: function(TargetClass) {
                    (TargetClass.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent),
                      (TargetClass.prototype.hasEventListener =
                        EventDispatcher.prototype.hasEventListener),
                      (TargetClass.prototype.addEventListener =
                        EventDispatcher.prototype.addEventListener),
                      (TargetClass.prototype.removeEventListener =
                        EventDispatcher.prototype.removeEventListener),
                      (TargetClass.prototype.removeAllEventListeners =
                        EventDispatcher.prototype.removeAllEventListeners);
                  },
                },
              ],
            ),
            EventDispatcher
          );
        })(),
        objectSpread = __webpack_require__(24),
        objectSpread_default = __webpack_require__.n(objectSpread),
        vector_Vector = function Vector(x, y) {
          var _this = this;
          classCallCheck_default()(this, Vector),
            defineProperty_default()(this, 'getMagnitude', function() {
              return Math.sqrt(_this.x * _this.x + _this.y * _this.y);
            }),
            defineProperty_default()(this, 'add', function(vector) {
              (_this.x += vector.x), (_this.y += vector.y);
            }),
            defineProperty_default()(this, 'addFriction', function(friction) {
              (_this.x -= friction * _this.x), (_this.y -= friction * _this.y);
            }),
            defineProperty_default()(this, 'addGravity', function(gravity) {
              _this.y += gravity;
            }),
            defineProperty_default()(this, 'getAngle', function() {
              return Math.atan2(_this.y, _this.x);
            }),
            (this.x = x || 0),
            (this.y = y || 0);
        };
      defineProperty_default()(vector_Vector, 'fromAngle', function(angle, magnitude) {
        return new vector_Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
      });
      var defaultParticular = {
          pixelRatio: 2,
          zIndex: 1e4,
          maxCount: 300,
          autoStart: !1,
          continuous: !1,
        },
        defaultParticle = {
          rate: 8,
          life: 30,
          velocity: vector_Vector.fromAngle(-90, 5),
          spread: Math.PI / 1.3,
          sizeMin: 5,
          sizeMax: 15,
          velocityMultiplier: 6,
          fadeTime: 30,
          gravity: 0.15,
          scaleStep: 1,
        };
      function destroy(array, param) {
        for (var i = array.length; i--; ) {
          try {
            array[i].destroy(param);
          } catch (e) {}
          delete array[i];
        }
        array.splice(0, array.length);
      }
      var particular_Particular = function Particular() {
        var _this = this;
        classCallCheck_default()(this, Particular),
          defineProperty_default()(this, 'initialize', function(_ref) {
            var maxCount = _ref.maxCount,
              continuous = _ref.continuous,
              pixelRatio = _ref.pixelRatio;
            (_this.maxCount = maxCount),
              (_this.continuous = continuous),
              (_this.pixelRatio = pixelRatio),
              _this.update();
          }),
          defineProperty_default()(this, 'start', function() {
            _this.isOn = !0;
          }),
          defineProperty_default()(this, 'stop', function() {
            _this.isOn = !1;
          }),
          defineProperty_default()(this, 'onResize', function() {
            var height = (_this.height = window.innerHeight),
              width = (_this.width = window.innerWidth);
            _this.dispatchEvent(Particular.RESIZE, { width: width, height: height });
          }),
          defineProperty_default()(this, 'addRenderer', function(renderer) {
            _this.renderers.push(renderer), renderer.init(_this, _this.pixelRatio), _this.start();
          }),
          defineProperty_default()(this, 'addEmitter', function(emitter) {
            _this.emitters.push(emitter), emitter.assignParticular(_this), _this.start();
          }),
          defineProperty_default()(this, 'update', function() {
            (_this.animateRequest = window.requestAnimationFrame(_this.update)),
              _this.isOn &&
                (_this.dispatchEvent(Particular.UPDATE),
                _this.updateEmitters(),
                _this.dispatchEvent(Particular.UPDATE_AFTER));
          }),
          defineProperty_default()(this, 'updateEmitters', function() {
            _this.getCount() <= _this.maxCount &&
              each_default()(_this.emitters, function(emitter) {
                emitter.emit();
              }),
              each_default()(_this.emitters, function(emitter) {
                emitter.update(_this.width, _this.height);
              }),
              (_this.emitters = filter_default()(_this.emitters, function(emitter) {
                return _this.continuous || emitter.isAlive() ? emitter : (emitter.destroy(), null);
              })),
              _this.emitters.length || _this.stop();
          }),
          defineProperty_default()(this, 'getCount', function() {
            return _this.getAllParticles().length;
          }),
          defineProperty_default()(this, 'getAllParticles', function() {
            for (var particles = [], i = _this.emitters.length; i--; )
              particles = particles.concat(_this.emitters[i].particles);
            return particles;
          }),
          defineProperty_default()(this, 'destroy', function() {
            window.clearInterval(_this.animateRequest),
              destroy(_this.renderers),
              destroy(_this.emitters);
          }),
          (this.isOn = !1),
          (this.emitters = []),
          (this.renderers = []),
          (this.maxCount = defaultParticular.maxCount),
          (this.width = 0),
          (this.height = 0),
          (this.pixelRatio = 2),
          (this.continuous = !1);
      };
      defineProperty_default()(particular_Particular, 'UPDATE', 'UPDATE'),
        defineProperty_default()(particular_Particular, 'UPDATE_AFTER', 'UPDATE_AFTER'),
        defineProperty_default()(particular_Particular, 'RESIZE', 'RESIZE'),
        eventDispatcher_EventDispatcher.bind(particular_Particular);
      var helpers_extends = __webpack_require__(219),
        extends_default = __webpack_require__.n(helpers_extends),
        possibleConstructorReturn = __webpack_require__(84),
        possibleConstructorReturn_default = __webpack_require__.n(possibleConstructorReturn),
        getPrototypeOf = __webpack_require__(85),
        getPrototypeOf_default = __webpack_require__.n(getPrototypeOf),
        assertThisInitialized = __webpack_require__(36),
        assertThisInitialized_default = __webpack_require__.n(assertThisInitialized),
        inherits = __webpack_require__(86),
        inherits_default = __webpack_require__.n(inherits),
        react = __webpack_require__(1),
        react_default = __webpack_require__.n(react),
        getDisplayName = __webpack_require__(220),
        getDisplayName_default = __webpack_require__.n(getDisplayName),
        PortalCompat = __webpack_require__(487),
        sample = __webpack_require__(221),
        sample_default = __webpack_require__.n(sample),
        randomColor = __webpack_require__(222),
        randomColor_default = __webpack_require__.n(randomColor);
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      var TO_RADIANS = Math.PI / 180;
      var particle_Particle = function Particle(_ref) {
        var _this = this,
          point = _ref.point,
          velocity = _ref.velocity,
          acceleration = _ref.acceleration,
          friction = _ref.friction,
          size = _ref.size,
          gravity = _ref.gravity,
          scaleStep = _ref.scaleStep,
          fadeTime = _ref.fadeTime;
        classCallCheck_default()(this, Particle),
          defineProperty_default()(this, 'init', function(image, particular) {
            (_this.image = image),
              (_this.particular = particular),
              _this.dispatch('PARTICLE_CREATED', _this);
          }),
          defineProperty_default()(this, 'update', function() {
            _this.velocity.add(_this.acceleration),
              _this.velocity.addFriction(_this.friction),
              _this.velocity.addGravity(_this.gravity),
              _this.position.add(_this.velocity),
              (_this.rotation += _this.rotationVelocity),
              (_this.factoredSize = Math.min(_this.factoredSize + _this.scaleStep, _this.size)),
              (_this.alpha = Math.max((_this.lifeTime - _this.lifeTick) / _this.fadeTime, 0)),
              _this.lifeTick++,
              _this.dispatch('PARTICLE_UPDATE', _this);
          }),
          defineProperty_default()(this, 'resetImage', function() {
            _this.image = null;
          }),
          defineProperty_default()(this, 'getRoundedLocation', function() {
            return [0.1 * ((10 * _this.position.x) << 0), 0.1 * ((10 * _this.position.y) << 0)];
          }),
          defineProperty_default()(this, 'dispatch', function(event, target) {
            _this.particular && _this.particular.dispatchEvent(event, target);
          }),
          defineProperty_default()(this, 'destroy', function() {
            _this.dispatch('PARTICLE_DEAD', _this);
          }),
          (this.position = point || new vector_Vector(0, 0)),
          (this.velocity = velocity || new vector_Vector(0, 0)),
          (this.acceleration = acceleration || new vector_Vector(0, 0)),
          (this.friction = friction || 0),
          (this.rotation = 360 * Math.random()),
          (this.rotationDirection = 0.5 < Math.random() ? 1 : -1),
          (this.rotationVelocity = this.rotationDirection * getRandomInt(1, 3)),
          (this.factoredSize = 1),
          (this.lifeTime = getRandomInt(75, 100)),
          (this.lifeTick = 0),
          (this.size = size || getRandomInt(5, 15)),
          (this.gravity = gravity),
          (this.scaleStep = scaleStep),
          (this.fadeTime = fadeTime),
          (this.alpha = 1),
          (this.color = randomColor_default()()),
          (this.particular = null);
      };
      eventDispatcher_EventDispatcher.bind(particle_Particle);
      var emitter_Emitter = function Emitter(configuration) {
          var _this = this;
          classCallCheck_default()(this, Emitter),
            defineProperty_default()(this, 'emit', function() {
              if (_this.isEmitting)
                for (var j = 0; j < _this.configuration.rate; j++) {
                  var particle = _this.createParticle(),
                    icon = sample_default()(_this.configuration.icons, 1);
                  particle.init(icon, _this.particular), _this.particles.push(particle);
                }
            }),
            defineProperty_default()(this, 'assignParticular', function(particular) {
              _this.particular = particular;
            }),
            defineProperty_default()(this, 'update', function(boundsX, boundsY) {
              var currentParticles = [];
              each_default()(_this.particles, function(particle) {
                var pos = particle.position;
                0 > pos.x || pos.x > boundsX || pos.y < -boundsY || pos.y > boundsY
                  ? particle.destroy()
                  : (particle.update(), currentParticles.push(particle));
              }),
                (_this.particles = currentParticles),
                (_this.isEmitting = _this.lifeCycle < _this.configuration.life);
            }),
            defineProperty_default()(this, 'isAlive', function() {
              return _this.isEmitting || 0 < _this.particles.length;
            }),
            defineProperty_default()(this, 'createParticle', function() {
              var _this$configuration = _this.configuration,
                velocity = _this$configuration.velocity,
                spread = _this$configuration.spread,
                point = _this$configuration.point,
                sizeMin = _this$configuration.sizeMin,
                sizeMax = _this$configuration.sizeMax,
                velocityMultiplier = _this$configuration.velocityMultiplier,
                gravity = _this$configuration.gravity,
                scaleStep = _this$configuration.scaleStep,
                fadeTime = _this$configuration.fadeTime,
                angle = velocity.getAngle() + spread - Math.random() * spread * 2,
                magnitude = velocity.getMagnitude(),
                newPoint = new vector_Vector(point.x, point.y),
                newVelocity = vector_Vector.fromAngle(angle, magnitude),
                size = getRandomInt(sizeMin, sizeMax);
              newVelocity.add({ x: 0, y: (-(sizeMax - size) / 15) * velocityMultiplier });
              var acceleration = new vector_Vector(0, size / 100);
              return (
                _this.lifeCycle++,
                new particle_Particle({
                  point: newPoint,
                  velocity: newVelocity,
                  acceleration: acceleration,
                  friction: size / 2e3,
                  size: size,
                  gravity: gravity,
                  scaleStep: scaleStep,
                  fadeTime: fadeTime,
                })
              );
            }),
            defineProperty_default()(this, 'destroy', function() {
              destroy(_this.particles);
            }),
            (this.configuration = configuration),
            (this.particles = []),
            (this.isEmitting = !1),
            (this.particular = null),
            (this.lifeCycle = 0);
        },
        icons_images = [];
      __webpack_require__(73), __webpack_require__(484);
      var canvasRenderer_CanvasRenderer = (function() {
          function CanvasRenderer(target) {
            var _this = this;
            classCallCheck_default()(this, CanvasRenderer),
              defineProperty_default()(this, 'resize', function(_ref) {
                var width = _ref.width,
                  height = _ref.height;
                (_this.target.width = width), (_this.target.height = height);
              }),
              defineProperty_default()(this, 'onUpdate', function() {
                _this.context.save(),
                  _this.context.scale(_this.pixelRatio, _this.pixelRatio),
                  _this.context.clearRect(0, 0, _this.target.width, _this.target.height);
              }),
              defineProperty_default()(this, 'onUpdateAfter', function() {
                _this.context.restore();
              }),
              defineProperty_default()(this, 'onParticleCreated', function() {}),
              defineProperty_default()(this, 'onParticleUpdated', function(particle) {
                particle.image
                  ? particle.image instanceof Image && _this.drawImage(particle)
                  : _this.drawBasicElement(particle);
              }),
              defineProperty_default()(this, 'onParticleDead', function(particle) {
                particle.resetImage();
              }),
              defineProperty_default()(this, 'drawImage', function(particle) {
                _this.context.save(), (_this.context.globalAlpha = particle.alpha);
                var pixelRounded = particle.getRoundedLocation();
                _this.context.translate(pixelRounded[0], pixelRounded[1]),
                  _this.context.rotate(
                    (function degToRad(deg) {
                      return deg * TO_RADIANS;
                    })(particle.rotation),
                  ),
                  _this.context.drawImage(
                    particle.image,
                    -particle.factoredSize,
                    -particle.factoredSize,
                    2 * particle.factoredSize,
                    2 * particle.factoredSize,
                  ),
                  (_this.context.globalAlpha = 1),
                  _this.context.restore();
              }),
              defineProperty_default()(this, 'drawBasicElement', function(particle) {
                (_this.context.fillStyle = particle.color), _this.context.beginPath();
                var pixelRounded = particle.getRoundedLocation();
                _this.context.arc(
                  pixelRounded[0],
                  pixelRounded[1],
                  particle.factoredSize,
                  0,
                  2 * Math.PI,
                  !0,
                ),
                  _this.stroke &&
                    ((_this.context.strokeStyle = _this.stroke.color),
                    (_this.context.lineWidth = _this.stroke.thinkness),
                    _this.context.stroke()),
                  _this.context.closePath(),
                  _this.context.fill();
              }),
              (this.target = target),
              (this.context = this.target.getContext('2d')),
              (this.name = 'CanvasRenderer');
          }
          return (
            createClass_default()(CanvasRenderer, [
              {
                key: 'init',
                value: function(particular, pixelRatio) {
                  (this.particular = particular),
                    (this.pixelRatio = pixelRatio),
                    this.context.scale(this.pixelRatio, this.pixelRatio),
                    (this.context.imageSmoothingEnabled = !0),
                    particular.addEventListener('UPDATE', this.onUpdate),
                    particular.addEventListener('UPDATE_AFTER', this.onUpdateAfter),
                    particular.addEventListener('RESIZE', this.resize),
                    particular.addEventListener('PARTICLE_CREATED', this.onParticleCreated),
                    particular.addEventListener('PARTICLE_UPDATE', this.onParticleUpdated),
                    particular.addEventListener('PARTICLE_DEAD', this.onParticleDead);
                },
              },
              {
                key: 'destroy',
                value: function() {
                  this.remove();
                },
              },
              {
                key: 'remove',
                value: function() {
                  this.particular.removeEventListener('UPDATE', this.onUpdate),
                    this.particular.removeEventListener('UPDATE_AFTER', this.onUpdateAfter),
                    this.particular.removeEventListener('PARTICLE_CREATED', this.onParticleCreated),
                    this.particular.removeEventListener('PARTICLE_UPDATE', this.onParticleUpdated),
                    this.particular.removeEventListener('PARTICLE_DEAD', this.onParticleDead),
                    (this.particular = null);
                },
              },
            ]),
            CanvasRenderer
          );
        })(),
        CanvasWrapper_CanvasWrapper = (function(_React$Component) {
          function CanvasWrapper(props) {
            var _this;
            return (
              classCallCheck_default()(this, CanvasWrapper),
              (_this = possibleConstructorReturn_default()(
                this,
                getPrototypeOf_default()(CanvasWrapper).call(this, props),
              )),
              defineProperty_default()(
                assertThisInitialized_default()(_this),
                'onWindowResize',
                function() {
                  _this.particular.onResize();
                  var height = window.innerHeight,
                    width = window.innerWidth;
                  _this.setState({ width: width, height: height });
                },
              ),
              defineProperty_default()(
                assertThisInitialized_default()(_this),
                'configure',
                function(configuration) {
                  (_this.configuration = (function configureParticular(configuration) {
                    return objectSpread_default()(
                      {},
                      defaultParticular,
                      defaultParticle,
                      configuration,
                    );
                  })(configuration)),
                    _this.particular.initialize(_this.configuration),
                    _this.particular.addRenderer(new canvasRenderer_CanvasRenderer(_this.canvas)),
                    _this.configuration.autoStart &&
                      _this.create(window.innerWidth / 2, window.innerHeight / 2);
                },
              ),
              defineProperty_default()(assertThisInitialized_default()(_this), 'create', function(
                settings,
              ) {
                var combinedSettings = (function configureParticle(settings, configuration) {
                    return objectSpread_default()({}, defaultParticle, configuration, settings);
                  })(settings, _this.configuration),
                  icons = [];
                combinedSettings.icons &&
                  (icons = (function processImages(icons) {
                    return (
                      (icons_images = []),
                      each_default()(icons, function(icon) {
                        var imageObject = new Image();
                        (imageObject.src = icon), icons_images.push(imageObject);
                      }),
                      icons_images
                    );
                  })(combinedSettings.icons)),
                  _this.particular.addEmitter(
                    new emitter_Emitter(
                      objectSpread_default()(
                        {
                          point: new vector_Vector(
                            combinedSettings.x / _this.configuration.pixelRatio,
                            combinedSettings.y / _this.configuration.pixelRatio,
                          ),
                        },
                        combinedSettings,
                        { icons: icons },
                      ),
                    ),
                  );
              }),
              (_this.state = { width: 100, height: 100 }),
              (_this.canvas = null),
              (_this.particular = new particular_Particular()),
              _this
            );
          }
          return (
            inherits_default()(CanvasWrapper, _React$Component),
            createClass_default()(CanvasWrapper, [
              {
                key: 'componentDidMount',
                value: function() {
                  this.particular || (this.particular = new particular_Particular()),
                    window.addEventListener('resize', this.onWindowResize),
                    this.onWindowResize();
                },
              },
              {
                key: 'componentWillUnmount',
                value: function() {
                  window.removeEventListener('resize', this.onWindowResize),
                    this.particular.destroy();
                },
              },
              {
                key: 'render',
                value: function() {
                  var _this2 = this;
                  return react_default.a.createElement('canvas', {
                    ref: function(canvas) {
                      _this2.canvas = canvas;
                    },
                    className: 'particular',
                    width: this.state.width,
                    height: this.state.height,
                    style: {
                      width: ''.concat(this.state.width, 'px'),
                      height: ''.concat(this.state.height, 'px'),
                      position: 'absolute',
                      pointerEvents: 'none',
                      cursor: 'auto',
                      opacity: 1,
                      left: 0,
                      top: 0,
                      zIndex: this.configuration ? this.configuration.zIndex : 1e4,
                    },
                  });
                },
              },
            ]),
            CanvasWrapper
          );
        })(react_default.a.Component),
        particular_ParticularWrapper = function() {
          var configuration = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
          return function(Wrapped) {
            var icons = configuration.icons,
              ParticularWrapper = (function(_Component) {
                function ParticularWrapper() {
                  var _this;
                  return (
                    classCallCheck_default()(this, ParticularWrapper),
                    (_this = possibleConstructorReturn_default()(
                      this,
                      getPrototypeOf_default()(ParticularWrapper).call(this),
                    )),
                    defineProperty_default()(
                      assertThisInitialized_default()(_this),
                      'burst',
                      function(settings) {
                        _this.particles &&
                          void 0 !== settings.clientX &&
                          void 0 !== settings.clientY &&
                          _this.particles.create(
                            objectSpread_default()(
                              { x: settings.clientX, y: settings.clientY },
                              settings,
                              { icons: icons || settings.icons },
                            ),
                          );
                      },
                    ),
                    (_this.particles = null),
                    _this
                  );
                }
                return (
                  inherits_default()(ParticularWrapper, _Component),
                  createClass_default()(ParticularWrapper, [
                    {
                      key: 'componentDidMount',
                      value: function() {
                        this.particles.configure(configuration);
                      },
                    },
                    {
                      key: 'render',
                      value: function() {
                        var _this2 = this;
                        return react_default.a.createElement(
                          'div',
                          null,
                          react_default.a.createElement(
                            PortalCompat.a,
                            { isOpened: !0 },
                            react_default.a.createElement(CanvasWrapper_CanvasWrapper, {
                              ref: function(particles) {
                                _this2.particles = particles;
                              },
                            }),
                          ),
                          react_default.a.createElement(
                            Wrapped,
                            extends_default()({}, this.props, { burst: this.burst }),
                          ),
                        );
                      },
                    },
                  ]),
                  ParticularWrapper
                );
              })(react.Component);
            return (
              defineProperty_default()(
                ParticularWrapper,
                'displayName',
                'Particular('.concat(getDisplayName_default()(Wrapped), ')'),
              ),
              ParticularWrapper
            );
          };
        };
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return particular_ParticularWrapper;
      });
    },
    414: function(module, exports, __webpack_require__) {
      (exports = module.exports = __webpack_require__(415)(!1)).push([
        module.i,
        ":root {\n}\n\n.storiesDecorator__root___35OG9 {\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',\n    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n",
        '',
      ]),
        (exports.locals = { root: 'storiesDecorator__root___35OG9' });
    },
    418: function(module, exports, __webpack_require__) {
      var map = { './src/Particular.story.js': 419 };
      function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
      }
      function webpackContextResolve(req) {
        if (!__webpack_require__.o(map, req)) {
          var e = new Error("Cannot find module '" + req + "'");
          throw ((e.code = 'MODULE_NOT_FOUND'), e);
        }
        return map[req];
      }
      (webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
      }),
        (webpackContext.resolve = webpackContextResolve),
        (module.exports = webpackContext),
        (webpackContext.id = 418);
    },
    419: function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      __webpack_require__.r(__webpack_exports__),
        function(module) {
          var _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
              24,
            ),
            _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
              _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0__,
            ),
            react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1),
            react__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(
              react__WEBPACK_IMPORTED_MODULE_1__,
            ),
            prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(31),
            prop_types__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(
              prop_types__WEBPACK_IMPORTED_MODULE_2__,
            ),
            _storybook_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20),
            icons_smiley_sad_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(215),
            icons_smiley_sad_png__WEBPACK_IMPORTED_MODULE_4___default = __webpack_require__.n(
              icons_smiley_sad_png__WEBPACK_IMPORTED_MODULE_4__,
            ),
            icons_smiley_cry_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(216),
            icons_smiley_cry_png__WEBPACK_IMPORTED_MODULE_5___default = __webpack_require__.n(
              icons_smiley_cry_png__WEBPACK_IMPORTED_MODULE_5__,
            ),
            icons_smiley_sad_2_png__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(217),
            icons_smiley_sad_2_png__WEBPACK_IMPORTED_MODULE_6___default = __webpack_require__.n(
              icons_smiley_sad_2_png__WEBPACK_IMPORTED_MODULE_6__,
            ),
            _index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(37),
            customIcons = [
              icons_smiley_sad_png__WEBPACK_IMPORTED_MODULE_4___default.a,
              icons_smiley_cry_png__WEBPACK_IMPORTED_MODULE_5___default.a,
              icons_smiley_sad_2_png__WEBPACK_IMPORTED_MODULE_6___default.a,
            ],
            Playground = function(_ref) {
              var burst = _ref.burst;
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                'div',
                { onClick: burst },
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  'h1',
                  {
                    style: {
                      textAlign: 'center',
                      paddingTop: '45vh',
                      paddingBottom: '40vh',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  },
                  'CLICK ME FOR PARTICLES',
                ),
              );
            };
          Playground.propTypes = { burst: prop_types__WEBPACK_IMPORTED_MODULE_2___default.a.func };
          var PlaygroundWrapped = Object(_index__WEBPACK_IMPORTED_MODULE_7__.a)()(Playground),
            PlaygroundCustomWrapped = Object(_index__WEBPACK_IMPORTED_MODULE_7__.a)({
              icons: customIcons,
            })(Playground),
            PlaygroundCustomControlsWrapped = Object(_index__WEBPACK_IMPORTED_MODULE_7__.a)({
              icons: customIcons,
              rate: 1,
              life: 200,
              maxCount: 1e3,
            })(Playground),
            PlaygroundAutomaticWrapped = Object(_index__WEBPACK_IMPORTED_MODULE_7__.a)({
              icons: customIcons,
              rate: 1,
              life: 200,
              maxCount: 1e3,
              continuous: !0,
              autoStart: !0,
            })(function() {
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                'div',
                null,
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  'h1',
                  {
                    style: {
                      textAlign: 'center',
                      paddingTop: '45vh',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  },
                  'I AM CONTINUOUS. ',
                  react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement('br', null),
                  'I EXIST FOREVER.',
                ),
              );
            }),
            PlaygroundMassive = Object(_index__WEBPACK_IMPORTED_MODULE_7__.a)({
              rate: 1e3,
              life: 1e3,
              maxCount: 1e3,
            })(Playground),
            PlaygroundParticleControls = Object(_index__WEBPACK_IMPORTED_MODULE_7__.a)({
              rate: 8,
              life: 30,
              sizeMin: 1,
              sizeMax: 5,
              maxCount: 300,
              velocityMultiplier: 110,
            })(function(_ref2) {
              var burst = _ref2.burst;
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                'div',
                {
                  onClick: function(e) {
                    burst(
                      _babel_runtime_helpers_objectSpread__WEBPACK_IMPORTED_MODULE_0___default()(
                        {},
                        e,
                        {
                          sizeMin: 10 * Math.random(),
                          sizeMax: 10 + 10 * Math.random(),
                          velocityMultiplier: 15 * Math.random(),
                          gravity: 0.5 * Math.random(),
                        },
                      ),
                    );
                  },
                },
                react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                  'h1',
                  {
                    style: {
                      textAlign: 'center',
                      paddingTop: '45vh',
                      paddingBottom: '40vh',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  },
                  'CLICK ME FOR PARTICLES',
                ),
              );
            });
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_3__.storiesOf)('Particular', module).add(
            'Burst',
            function() {
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                PlaygroundWrapped,
                null,
              );
            },
          ),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_3__.storiesOf)(
              'Particular',
              module,
            ).add('Burst with custom icons', function() {
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                PlaygroundCustomWrapped,
                null,
              );
            }),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_3__.storiesOf)(
              'Particular',
              module,
            ).add('Burst with custom emitter controls', function() {
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                PlaygroundCustomControlsWrapped,
                null,
              );
            }),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_3__.storiesOf)(
              'Particular',
              module,
            ).add('Performance beauty', function() {
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                PlaygroundMassive,
                null,
              );
            }),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_3__.storiesOf)(
              'Particular',
              module,
            ).add('Particle sizing', function() {
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                PlaygroundParticleControls,
                null,
              );
            }),
            Object(_storybook_react__WEBPACK_IMPORTED_MODULE_3__.storiesOf)(
              'Particular',
              module,
            ).add('Automatic and continuous', function() {
              return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                PlaygroundAutomaticWrapped,
                null,
              );
            });
        }.call(this, __webpack_require__(154)(module));
    },
  },
  [[223, 1, 2]],
]);
//# sourceMappingURL=main.a4057dabaa2bd7878290.bundle.js.map
