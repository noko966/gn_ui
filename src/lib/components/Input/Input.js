import React from "react";
import classNames from "classnames";
import "./Input.scss";
import Symbol from "../Symbol/index";

const Radio = ({
  id = `js_${Math.random()}`,
  onChange,
  icon,
  isDisabled,
  variant = "normal",
  className,
  label,
  name,
}) => {
  // const variantClassName = inputVariantMapping[variant];
  const isValidIcon = icon && icon.type && icon.type.name === "SymbolComponent";

  const inputClassName = classNames({
    view_european_control_root: true,
    state_disabled: isDisabled,
    // [variantClassName]: true,
    [className]: className,
    layout_with_label: label,
  });
  return (
    <div className={inputClassName}>
      <label htmlFor={id} className="view_european_control_wrapper">
        <input id={id} onChange={onChange} type="radio" name={name} />
        <div className="state_imitator">
          <Symbol className="state_active" sportId="control_checked" />
          <Symbol className="state_passive" sportId="control_unchecked" />
        </div>
        {label && <span>{label}</span>}
      </label>
    </div>
  );
};

const Input = ({
  id = `js_${Math.random()}`,
  onChange,
  icon,
  placeholder,
  isDisabled,
  variant = "normal",
  className,
  label,
}) => {
  const inputVariantMapping = {
    normal: "variant_normal",
    outline: "variant_outline",
  };
  const variantClassName = inputVariantMapping[variant];
  const isValidIcon = icon && icon.type && icon.type.name === "SymbolComponent";

  const inputClassName = classNames({
    view_european_input_root: true,
    state_disabled: isDisabled,
    [variantClassName]: true,
    layout_with_icon: isValidIcon,
    [className]: className,
    layout_with_label: label,
  });
  return (
    <div className={inputClassName}>
      {label && <label>{label}</label>}
      <div className="view_european_input_wrapper">
        <input
          id={id}
          onChange={onChange}
          type="text"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

const Search_European = ({ placeholder }) => {
  const rootClassName = classNames({
    view_european_variant_home_search: true,
  });
  return (
    <div className={rootClassName}>
      <input type="text" placeholder={placeholder} />
      <div className="icon_wrapper">
        <i className="dg_icon_search" />
      </div>
    </div>
  );
};

export { Input, Search_European, Radio };
