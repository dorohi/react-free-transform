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

var Rotator = function Rotator(_ref) {
  var onMouseDown = _ref.onMouseDown,
      classPrefix = _ref.classPrefix,
      styles = _ref.styles;
  return _react2.default.createElement('div', {
    className: classPrefix + '-transform__rotator',
    onMouseDown: onMouseDown,
    style: _extends({
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }, styles) });
};

Rotator.defaultProps = {
  classPrefix: 'tr',
  styles: {}
};

Rotator.propTypes = {
  onMouseDown: _propTypes2.default.func.isRequired,
  classPrefix: _propTypes2.default.string
};

exports.default = Rotator;