import React from "react";
import classNames from "classnames";
// import "./index.scss";
import Sport from "./variants/sport/index.js";
import Country from "./variants/country/index.js";
// import tournament from "./variants/tournament/index.js";

const SideBarItemVariant = ({
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
      sport: Sport,
      country: Country,
      // tournament: tournament,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[variant] || Sport;

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

export default SideBarItemVariant;
