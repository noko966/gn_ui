import React from "react";
import PropTypes from "prop-types";
import "./Button.scss";

const Button = ({ title = "click me" }) => {
  return <button className="dg_button_root">{title}</button>;
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Button;
