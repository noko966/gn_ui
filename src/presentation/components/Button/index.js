import React from "react";
import './style.css'

const Button = ({ title = 'click me' }) => {
  return <button className="dg_button_root">{title}</button>;
};

export default Button;
