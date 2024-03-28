import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
import "./Input.scss";



const Input = ({ placeholder, isSearcgInput, isDatePickerInput, sportIconStyle = 400, isDisabled }) => {
  const inputClassName = classNames({
    "dg_input_root": true,
    "dg_icons_outline": sportIconStyle === 100,
    'dg_input_type_search': isSearcgInput,
    'dg_input_type_date': isDatePickerInput,
    'dg_input_state_disabled': isDisabled,
  });
  return (
    <div className={inputClassName}>
      { isSearcgInput && <i className="dg_icon_search"/>}
      <input className="dg_input" type="text" placeholder={placeholder} disabled={isDisabled}/>
      { isDatePickerInput && <i className="dg_icon_date_picker"/>}
    </div>
  );
};

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
};

export default Input;
