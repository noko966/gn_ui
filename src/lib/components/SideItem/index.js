import React from "react";
import classNames from "classnames";
// import "./index.scss";
import EuropeanView from "./-moleculs/European/index.js";
import EsportView from "./-moleculs/Esport/index.js";

const SideItemComponent = ({
  child,
  view,
  isActive,
  isDisabled,
  variant,
  sportId,
  iconVariant,
  isVariantCountry,
  fId,
}) => {
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
      isVariantCountry={isVariantCountry}
      fId={fId}
    />
  );
};

export default SideItemComponent;
