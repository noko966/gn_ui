import React from "react";

const Button = ({ title = 'click me' }) => {
  return <button className="dg_button_root">{title}</button>;
};

export default Button;
