import React from "react";
import classNames from "classnames";
import "./index.scss";

import EuropeanView from "./views/european/index"

// Main component
const HomeEventWidgetRow = ({ view,variant, HTN,ATN,HTSc,ATSc, HasLI, HasLC, Time, MoreCount, Bet   }) => {
  const Component =
    {
      european: EuropeanView,
      // african: AfricanView,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[view, variant] || EuropeanView;

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
      Bet={Bet}
      MoreCount={MoreCount}
    />
  );
};

export {HomeEventWidgetRow};
