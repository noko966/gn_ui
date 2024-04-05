import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./index.scss";
import EuropeanView from "./-moleculs/European/index.js";
import EsportView from "./-moleculs/Esport/index.js";

const SideItemComponent = ({ child, view, isActive, isDisabled, variant }) => {
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
      child={child}
      view={view}
      isActive={isActive}
      isDisabled={isDisabled}
      variant={variant}
    />
  );
};

SideItemComponent.propTypes = {
  region: PropTypes.string.isRequired,
  factor: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default SideItemComponent;
