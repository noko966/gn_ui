import React from "react";
import classNames from "classnames";
import "./Button.scss";

const European_Button_var_settings = ({ onClick, icon }) => {
  const buttonClassName = classNames({
    view_european_settings_button: true,
  });
  const isValidIcon = icon && icon.type && icon.type.name === "SymbolComponent";
  return (
    <button onClick={onClick} className={buttonClassName}>
      {isValidIcon ? icon : <span>Invalid icon</span>}
    </button>
  );
};

const buttonVariantMapping = {
  normal: "variant_normal",
  accent: "variant_accent",
  outline: "variant_outline",
};

const Button = ({
  onClick,
  icon,
  text,
  isDisabled,
  variant = "normal",
  className,
}) => {
  const variantClassName = buttonVariantMapping[variant];
  const isValidIcon = icon && icon.type && icon.type.name === "SymbolComponent";

  const buttonClassName = classNames({
    view_european_btn: true,
    state_disabled: isDisabled,
    [variantClassName]: true,
    layout_with_icon: isValidIcon,
    [className]: className,
  });
  return (
    <button onClick={onClick} className={buttonClassName}>
      {isValidIcon && icon}
      <span>{text}</span>
    </button>
  );
};

const European_Buttons_Row_settings = ({ children }) => {
  const buttonRowClassName = classNames({
    view_european_settings_buttons_row: true,
  });
  return <div className={buttonRowClassName}>{children}</div>;
};

export { Button, European_Button_var_settings, European_Buttons_Row_settings };
