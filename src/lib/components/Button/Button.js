import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import "./Button.scss";

const Button = ({ title = "click me", isPrimary, onClick, isWithIcon, iconPositionStart, iconClassName = 'dg_icon_lock', isDisabled, sportIconStyle = 400 }) => {
  const buttonClassName = classNames({
    "dg_button_root": true,
    "dg_button_type_with_icon": isWithIcon,
    "dg_button_state_disabled": isDisabled,
    'dg_button_type_secondary': !isPrimary,
    "dg_icons_outline": sportIconStyle === 100,
  });

  const buttonIconClassName = classNames({
    [`${iconClassName}`]: iconClassName ? iconClassName : 'dg_icon_lock',
  });
  return <button onClick={onClick} className={buttonClassName}>
      {isWithIcon && !iconPositionStart && <i className={buttonIconClassName}/>}
      <span>{title}</span>
      {isWithIcon && iconPositionStart && <i className={buttonIconClassName}/>}
    </button>;
    

};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isPrimary: PropTypes.bool,
  isWithIcon: PropTypes.bool,
  iconClassName: PropTypes.string,
  isDisabled: PropTypes.bool,
  iconPositionStart: PropTypes.bool,
  sportIconStyle: PropTypes.number,
};

export default Button;
