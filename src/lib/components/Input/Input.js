import React from "react";
import PropTypes from "prop-types";
import "./Input.scss";

const Input = ({ placeholder }) => {
  return (
    <div className="dg_input_root">
      <input className="dg_input" type="text" placeholder={placeholder} />
    </div>
  );
};

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
};

export default Input;
