import React from "react";
import classNames from "classnames";
import "./Button.scss";

const Button = ({
  title = "click me",
  isPrimary,
  onClick,
  isWithIcon,
  iconPositionStart,
  iconClassName = "dg_icon_lock",
  isDisabled,
  sportIconStyle = 400,
}) => {
  const buttonClassName = classNames({
    dg_button_root: true,
    dg_button_type_with_icon: isWithIcon,
    dg_button_state_disabled: isDisabled,
    dg_button_type_secondary: !isPrimary,
    dg_icons_outline: sportIconStyle === 100,
  });

  const buttonIconClassName = classNames({
    [`${iconClassName}`]: iconClassName ? iconClassName : "dg_icon_lock",
  });
  return (
    <button onClick={onClick} className={buttonClassName}>
      {isWithIcon && !iconPositionStart && (
        <i className={buttonIconClassName} />
      )}
      <span>{title}</span>
      {isWithIcon && iconPositionStart && <i className={buttonIconClassName} />}
    </button>
  );
};

const European_Button_var_settings = ({ onClick, icon }) => {
  const buttonClassName = classNames({
    view_european_settings_button: true,
  });
  const isValidIcon = icon && icon.type && icon.type.name === "Symbol";
  return (
    <button onClick={onClick} className={buttonClassName}>
      {isValidIcon ? icon : <span>Invalid icon</span>}
    </button>
  );
};

export { Button, European_Button_var_settings };
