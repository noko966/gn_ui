import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";

const EuropeanView = ({ child, isActive, isDisabled }) => {
  const ViewClassName = classNames({
    [`view_european_${"side_bar_item"}`]: true,
    ["state_active"]: isActive,
    ["state_disabled"]: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      <i className="sport_front_icon-1" />
      <div>
        <span>{child}</span>
        <strong>{50}</strong>
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

EuropeanView.propTypes = {
  child: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default EuropeanView;
