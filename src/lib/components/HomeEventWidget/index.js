import React from "react";
import "./index.scss";

import EuropeanView from "./views/european/index";

// Main component
const HomeEventWidgetRow = ({
  view,
  variant,
  HTN,
  ATN,
  HTSc,
  ATSc,
  HasLI,
  HasLC,
  Date,
  Time,
  MoreCount,
  Bet,
  Arg,
  EID,
  LN,
  children,
}) => {
  const Component =
    {
      european: EuropeanView,
      // african: AfricanView,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[(view, variant)] || EuropeanView;

  return (
    <Component
      view={view}
      variant={variant}
      HTN={HTN}
      ATN={ATN}
      HTSc={HTSc}
      ATSc={ATSc}
      HasLI={HasLI}
      HasLC={HasLC}
      Time={Time}
      Date={Date}
      Bet={Bet}
      MoreCount={MoreCount}
      Arg={Arg}
      EID={EID}
      LN={LN}
    >
      {children}
    </Component>
  );
};

export default HomeEventWidgetRow;
