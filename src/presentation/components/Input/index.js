"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Input = function Input(_ref) {
  var placeholder = _ref.placeholder;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "dg_input_root"
  }, /*#__PURE__*/_react["default"].createElement("input", {
    className: "dg_input",
    type: "text",
    placeholder: placeholder
  }));
};
var _default = exports["default"] = Input;