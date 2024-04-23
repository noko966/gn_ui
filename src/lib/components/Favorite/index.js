import React from "react";
import classNames from "classnames";
import "./index.scss";
import Symbol from "../Symbol/index";

const Favorite = ({
  id = `js_${Math.random()}`,
  onChange,
  isDisabled,
  className,
  isActive
}) => {

  const inputClassName = classNames({
    view_european_favorite_base: true,
    state_disabled: isDisabled,
    state_active: isActive,
    [className]: className,
  });
  return (
    <div className={inputClassName}>
      <label htmlFor={id}>
        <input id={id} onChange={onChange} type="checkbox" />
        <div className="state_imitator">
          <Symbol className="state_active" sportId="star_fil" />
          <Symbol className="state_passive" sportId="star_out" />
        </div>
      </label>
    </div>
  );
};



export default Favorite;
