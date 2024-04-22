import React from "react";

// import "./index.scss";
import European from "./views/European/index.js";

const SideBarItemComponent = ({
  view,
  variant,
  favCount,
  name,
  countryName,
  countryId,
  eventCount,
  sportName,
  leagueName,
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
    }[view] || European;

  return (
    <Component
      view={view}
      variant={variant}
      favcount={favCount}
      name={name}
      countryName={countryName}
      countryId={countryId}
      eventCount={eventCount}
      sportName={sportName}
      leagueName={leagueName}
      sportId={sportId}
      sportCount={sportCount}
      iconVariant={iconVariant}
      isActive={isActive}
      isDisabled={isDisabled}
    />
  );
};

export default SideBarItemComponent;
