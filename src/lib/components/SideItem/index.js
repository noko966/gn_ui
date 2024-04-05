import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./index.scss";
import EuropeanView from "./-moleculs/European/index.js";
import EsportView from "./-moleculs/Esport/index.js";

const SideItemComponent = ({ child, view, isActive, isDisabled, variant, sportId, iconVariant }) => {
  const Component =
    {
      european: EuropeanView,
      esport: EsportView,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[view] || EuropeanView;

  return (
    <Component
    iconVariant={iconVariant}
      sportId={sportId}
      child={child}
      view={view}
      isActive={isActive}
      isDisabled={isDisabled}
      variant={variant}
    />
  );
};

SideItemComponent.propTypes = {
  view: PropTypes.string.isRequired,
  sportId: PropTypes.number,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default SideItemComponent;
