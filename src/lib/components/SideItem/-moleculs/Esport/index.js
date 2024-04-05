import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";
import Icon from "../../../SportIcon/index.js";


const EsportView = ({ child, isActive, isDisabled, sportId, count, iconVariant }) => {
  const ViewClassName = classNames({
    [`view_esport${"_side_bar_item"}`]: true,
    ["state_active"]: isActive,
    ["state_disabled"]: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      <Icon variant={iconVariant} sportId={sportId}/>
      <span>{child}</span>
      <strong>{count}</strong>
    </div>
  );
};

EsportView.propTypes = {
  child: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default EsportView;
