import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";

const EsportView = ({ child, isActive, isDisabled }) => {
  const ViewClassName = classNames({
    [`view_esport${"_side_bar_item"}`]: true,
    ["state_active"]: isActive,
    ["state_disabled"]: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      <i className="sport_front_icon-3" />
      <span>{child}</span>
      <strong>{50}</strong>
    </div>
  );
};

EsportView.propTypes = {
  child: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default EsportView;
