'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var POSITIONING = {
  l: '0', r: '100%',
  t: '0', b: '100%',
  m: '50%'
};

var ScalePoint = function ScalePoint(_ref) {
  var onMouseDown = _ref.onMouseDown,
      classPrefix = _ref.classPrefix,
      position = _ref.position,
      styles = _ref.styles;
  return _react2.default.createElement('div', {
    className: classPrefix + '-transform__scale-point ' + classPrefix + '-transform__scale-point--' + position,
    onMouseDown: onMouseDown,
    style: _extends({
      position: 'absolute',
      top: POSITIONING[position[0]],
      left: POSITIONING[position[1]],
      transform: 'translate(-50%, -50%)'
    }, styles) });
};

ScalePoint.defaultProps = {
  classPrefix: 'tr',
  styles: {}
};

ScalePoint.propTypes = {
  onMouseDown: _propTypes2.default.func.isRequired,
  classPrefix: _propTypes2.default.string,
  position: _propTypes2.default.string.isRequired,
  styles: _propTypes2.default.object.isRequired
};

exports.default = ScalePoint;