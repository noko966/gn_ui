import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./Dropdown.scss";

const Dropdown = ({ options, onChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const dropdownRef = useRef(null);

  const dropdownClassName = classNames({
    dg_dropdown_root: true,
    dg_dropdown_state_opened: isOpen,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectItem = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={dropdownClassName} ref={dropdownRef}>
      <button onClick={handleToggleDropdown} className="dg_dropdown_value">
        <i
          className={
            options.find((option) => option.value === selectedValue)?.icon || ""
          }
        />
        <span>
          {options.find((option) => option.value === selectedValue)?.value ||
            "Select an option"}
        </span>
        <i className="dg_icon_angle_bottom" />
      </button>
      {isOpen && (
        <div className="dg_dropdown_content">
          {options.map((option) => (
            <div
              className={`${option.value === selectedValue ? "dg_dropdown_content_item dg_dropdown_content_item_selected" : "dg_dropdown_content_item"}`}
              key={option.value}
              onClick={() => handleSelectItem(option.value)}
            >
              <i className={option.icon} />
              <span>{option.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  option: PropTypes.array,
  onClick: PropTypes.func,
  isWithIcon: PropTypes.bool,
  iconClassName: PropTypes.string,
  isDisabled: PropTypes.bool,
  iconPositionStart: PropTypes.bool,
  sportIconStyle: PropTypes.number,
};

export default Dropdown;
