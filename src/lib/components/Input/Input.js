import React from "react";
import classNames from "classnames";
import "./Input.scss";

const inputVariantMapping = {
  normal: "variant_normal",
  outline: "variant_outline",
};

const Input = ({
  onChange,
  icon,
  placeholder,
  isDisabled,
  variant = "normal",
  className,
  label,
}) => {
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
        <input onChange={onChange} type="text" placeholder={placeholder} />
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

export { Input, Search_European };
