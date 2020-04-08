'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ScalePoint = require('./ScalePoint');

var _ScalePoint2 = _interopRequireDefault(_ScalePoint);

var _Rotator = require('./Rotator');

var _Rotator2 = _interopRequireDefault(_Rotator);

var _freeTransform = require('free-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SCALE_HANDLE_PRESETS = {
  'corners': ['tl', 'tr', 'bl', 'br'],
  'sides': ['tm', 'mr', 'bm', 'ml'],
  'all': ['tl', 'ml', 'tr', 'tm', 'mr', 'bl', 'bm', 'br']
};

var Transform = function (_React$Component) {
  _inherits(Transform, _React$Component);

  function Transform(props) {
    _classCallCheck(this, Transform);

    var _this = _possibleConstructorReturn(this, (Transform.__proto__ || Object.getPrototypeOf(Transform)).call(this, props));

    _this.handleTranslation = _this.handleTranslation.bind(_this);
    _this.handleScale = _this.handleScale.bind(_this);
    _this.handleRotation = _this.handleRotation.bind(_this);
    return _this;
  }

  _createClass(Transform, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          classPrefix = _props.classPrefix,
          x = _props.x,
          y = _props.y,
          scaleX = _props.scaleX,
          scaleY = _props.scaleY,
          width = _props.width,
          height = _props.height,
          angle = _props.angle,
          disableScale = _props.disableScale,
          rotateEnabled = _props.rotateEnabled,
          scaleEnabled = _props.scaleEnabled,
          translateEnabled = _props.translateEnabled,
          scaleHandles = _props.scaleHandles,
          open = _props.open;

      // replace anchor shortcuts

      for (var name in SCALE_HANDLE_PRESETS) {
        var index = scaleHandles.indexOf(name);
        if (index !== -1) {
          scaleHandles.splice.apply(scaleHandles, [index, 1].concat(_toConsumableArray(SCALE_HANDLE_PRESETS[name])));
        }
      }

      var _styler = (0, _freeTransform.styler)({ x: x, y: y, scaleX: scaleX, scaleY: scaleY, width: width, height: height, angle: angle, disableScale: disableScale }),
          elementStyle = _styler.element,
          controlsStyles = _styler.controls;

      return _react2.default.createElement(
        'div',
        { className: classPrefix + '-transform',
          onMouseDown: open && translateEnabled ? this.handleTranslation : null,
          onTouchStart: open && translateEnabled ? this.handleTranslation : null
        },
        _react2.default.createElement(
          'div',
          { className: classPrefix + '-transform__content', style: elementStyle },
          children
        ),
        open && _react2.default.createElement(
          'div',
          { className: classPrefix + '-transform__controls', style: controlsStyles },
          scaleEnabled && scaleHandles.map(function (position) {
            return _react2.default.createElement(_ScalePoint2.default, { key: position,
              position: position,
              classPrefix: classPrefix,
              onMouseDown: function onMouseDown(event) {
                return _this2.handleScale(position, event);
              },
              onTouchStart: function onTouchStart(event) {
                return _this2.handleScale(position, event);
              }
            });
          }),
          rotateEnabled && _react2.default.createElement(_Rotator2.default, { onMouseDown: this.handleRotation,
            onTouchStart: this.handleRotation,
            classPrefix: classPrefix })
        )
      );
    }
  }, {
    key: 'handleTranslation',
    value: function handleTranslation(event) {
      var _this3 = this;

      event.stopPropagation();
      // Если был второй targetTouches, делаем не перенос картинки а скаляцию
      if (event.targetTouches && event.targetTouches.length >= 2) {
        event.preventDefault();
        // повторное нажатие = розтягивание
        if (event.targetTouches[0].pageX < event.targetTouches[1].pageX) {
          this.handleScale('tl', event);
        } else {
          this.handleScale('br', event);
        }
      } else {
        var drag = (0, _freeTransform.translate)({
          x: this.props.x,
          y: this.props.y,
          startX: event.pageX || event.targetTouches[0].pageX,
          startY: event.pageY || event.targetTouches[0].pageY
        }, this.props.onTranslate || this.props.onUpdate);

        var up = function up(event) {
          document.removeEventListener('mousemove', drag);
          document.removeEventListener('touchmove', drag);

          document.removeEventListener('mouseup', up);
          document.removeEventListener('touchend', up);

          var onEnd = _this3.props.onTranslateEnd || _this3.props.onTransformEnd;
          if (onEnd) onEnd(event);
        };

        var onStart = this.props.onTranslateStart || this.props.onTransformStart;
        if (onStart) onStart(event);

        document.addEventListener('touchmove', drag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchend', up);
        document.addEventListener('mouseup', up);
      }
    }
  }, {
    key: 'handleScale',
    value: function handleScale(scaleType, event) {
      var _this4 = this;

      event.stopPropagation();

      if (!event.targetTouches) event.preventDefault();

      var drag = (0, _freeTransform.scale)(scaleType, {
        event: event,
        x: this.props.x,
        y: this.props.y,
        scaleX: this.props.scaleX,
        scaleY: this.props.scaleY,
        width: this.props.width,
        height: this.props.height,
        angle: this.props.angle,
        scaleMinLimit: this.props.scaleMinLimit,
        scaleMaxLimit: this.props.scaleMaxLimit,
        scaleFromCenter: this.props.scaleFromCenter,
        aspectRatio: this.props.aspectRatio
      }, this.props.onScale || this.props.onUpdate);

      var up = function up(event) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', up);
        document.removeEventListener('touchend', up);

        var onEnd = _this4.props.onScaleEnd || _this4.props.onTransformEnd;
        if (onEnd) onEnd(event);
      };

      document.addEventListener("mousemove", drag);
      document.addEventListener("touchmove", drag);
      document.addEventListener("mouseup", up);
      document.addEventListener("touchend", up);

      var onStart = this.props.onScaleStart || this.props.onTransformStart;
      if (onStart) onStart(event);
    }
  }, {
    key: 'handleRotation',
    value: function handleRotation(event) {
      var _this5 = this;

      event.stopPropagation();

      var drag = (0, _freeTransform.rotate)({
        startX: event.pageX || event.targetTouches[0].pageX,
        startY: event.pageY || event.targetTouches[0].pageY,
        x: this.props.x,
        y: this.props.y,
        scaleX: this.props.scaleX,
        scaleY: this.props.scaleY,
        width: this.props.width,
        height: this.props.height,
        angle: this.props.angle,
        offsetX: this.props.offsetX,
        offsetY: this.props.offsetY
      }, this.props.onRotate || this.props.onUpdate);

      var up = function up(event) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', up);
        document.removeEventListener('touchend', up);

        var onEnd = _this5.props.onRotateEnd || _this5.props.onTransformEnd;
        if (onEnd) onEnd(event);
      };

      document.addEventListener("mousemove", drag);
      document.addEventListener("touchmove", drag);
      document.addEventListener("mouseup", up);
      document.addEventListener("touchend", up);

      var onStart = this.props.onRotateStart || this.props.onTransformStart;
      if (onStart) onStart(event);
    }
  }]);

  return Transform;
}(_react2.default.Component);

exports.default = Transform;


Transform.SCALE_HANDLE_PRESETS = SCALE_HANDLE_PRESETS;

Transform.defaultProps = {
  classPrefix: "tr",
  scaleMinLimit: 0.1,
  scaleMaxLimit: 2,
  disableScale: false,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  offsetX: 0,
  offsetY: 0,
  onUpdate: function onUpdate() {},
  rotateEnabled: true,
  scaleEnabled: true,
  translateEnabled: true,
  scaleHandles: SCALE_HANDLE_PRESETS['all'],
  open: true,
  scaleFromCenter: false,
  aspectRatio: false
};

Transform.propTypes = {
  classPrefix: _propTypes2.default.string,
  width: _propTypes2.default.number.isRequired,
  height: _propTypes2.default.number.isRequired,
  x: _propTypes2.default.number.isRequired,
  y: _propTypes2.default.number.isRequired,
  scaleX: _propTypes2.default.number.isRequired,
  scaleY: _propTypes2.default.number.isRequired,
  scaleMinLimit: _propTypes2.default.number.isRequired,
  scaleMaxLimit: _propTypes2.default.number.isRequired,
  angle: _propTypes2.default.number.isRequired,

  onUpdate: _propTypes2.default.func,
  onTransformStart: _propTypes2.default.func,
  onTransformEnd: _propTypes2.default.func,

  onTranslate: _propTypes2.default.func,
  onRotate: _propTypes2.default.func,
  onScale: _propTypes2.default.func,

  onTranslateStart: _propTypes2.default.func,
  onRotateStart: _propTypes2.default.func,
  onScaleStart: _propTypes2.default.func,

  onTranslateEnd: _propTypes2.default.func,
  onRotateEnd: _propTypes2.default.func,
  onScaleEnd: _propTypes2.default.func,

  children: _propTypes2.default.element,
  disableScale: _propTypes2.default.bool,
  offsetX: _propTypes2.default.number.isRequired,
  offsetY: _propTypes2.default.number.isRequired,

  rotateEnabled: _propTypes2.default.bool,
  scaleEnabled: _propTypes2.default.bool,
  translateEnabled: _propTypes2.default.bool,

  scaleHandles: _propTypes2.default.array,
  scaleFromCenter: _propTypes2.default.bool,
  aspectRatio: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.number]),

  open: _propTypes2.default.bool
};