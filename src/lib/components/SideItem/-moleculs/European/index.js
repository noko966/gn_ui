import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";
import Icon from "../../../SportIcon/index.js";



const EuropeanView = ({ child, isActive, isDisabled, sportId, count, iconVariant }) => {
  const ViewClassName = classNames({
    [`view_european_${"side_bar_item"}`]: true,
    ["state_active"]: isActive,
    ["state_disabled"]: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      <Icon variant={iconVariant} sportId={sportId}/>
      <div>
        <span>{child}</span>
        <strong>{count}</strong>
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

EuropeanView.propTypes = {
  child: PropTypes.string.isRequired,
  sportId: PropTypes.number,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default EuropeanView;
