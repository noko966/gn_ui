import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";
import Symbol from "../../../Symbol/index.js";
import Flag from "../../../Flag/index.js";

const EuropeanView = ({
  child,
  isVariantCountry,
  isActive,
  isDisabled,
  sportId,
  fId,
  count,
  iconVariant,
}) => {
  const ViewClassName = classNames({
    [`view_european_${"side_bar_item"}`]: true,
    [`view_european_${"side_bar_item_country"}`]: isVariantCountry,
    ["state_active"]: isActive,
    ["state_disabled"]: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      {!isVariantCountry ? (
        <Symbol variant={iconVariant} sportId={sportId} />
      ) : (
        <Flag fId={fId} />
      )}

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
