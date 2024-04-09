import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./index.scss";
import EuropeanView from "./-moleculs/European/index.js";
import EsportView from "./-moleculs/Esport/index.js";

const RootComponent = ({ children, view, fullHeight, fullHeight, isRTL }) => {
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
      children={children}
      fullHeight={fullHeight}
      isRTL={isRTL}
      view={view}
    />
  );
};

RootComponent.propTypes = {
  view: PropTypes.string,
  children: PropTypes.array,
  fullHeight: PropTypes.bool,
};

export default RootComponent;
