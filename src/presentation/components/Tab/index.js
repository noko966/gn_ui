"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Tab = function Tab(_ref) {
  var _ref$title = _ref.title,
    title = _ref$title === void 0 ? 'title' : _ref$title;
  return /*#__PURE__*/_react["default"].createElement("button", {
    className: "dg_button_root"
  }, title);
};
var _default = exports["default"] = Tab;