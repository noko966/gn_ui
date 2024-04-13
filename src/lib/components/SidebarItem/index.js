import React from "react";
import classNames from "classnames";
// import "./index.scss";
import European from "./views/European/index.js";

const SideBarItemComponent = ({
  view,
  variant,
  countryName,
  countryId,
  eventCount,
  sportName,
  sportId,
  sportCount,
  iconVariant,
  isActive,
  isDisabled,
}) => {
  const Component =
    {
      european: European,
      // esport: EsportView,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[(view, variant)] || European;

  return (
    <Component
      view={view}
      variant={variant}
      countryName={countryName}
      countryId={countryId}
      eventCount={eventCount}
      sportName={sportName}
      sportId={sportId}
      sportCount={sportCount}
      iconVariant={iconVariant}
      isActive={isActive}
      isDisabled={isDisabled}
    />
  );
};

export default SideBarItemComponent;
