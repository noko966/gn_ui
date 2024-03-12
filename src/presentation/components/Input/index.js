import React from "react";

const Input = ({ placeholder }) => {
  return (
    <div className="dg_input_root">
      <input className="dg_input" type="text" placeholder={placeholder} />
    </div>
  );
};

export default Input;
