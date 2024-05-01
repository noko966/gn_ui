import React, { useState } from "react";
import classNames from "classnames";
// import "./index.scss";
import EuropeanView from "./-moleculs/European/index.js";
import EsportView from "./-moleculs/Esport/index.js";
import { TooltipRoot, TooltipContext } from "../../Tooltip/index.js";

const RootComponent = ({ children, view, fullHeight, isRTL }) => {
  const [tooltip, setTooltip] = useState({
    text: "",
    visible: false,
    bounds: { x: 0, y: 0, width: 0, height: 0 },
  });
  const Component =
    {
      european: EuropeanView,
      esport: EsportView,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[view] || EuropeanView;

  const tooltipApi = {
    setTooltip,
  };

  return (
    <TooltipContext.Provider value={tooltipApi}>
      <Component
        children={children}
        fullHeight={fullHeight}
        isRTL={isRTL}
        view={view}
      >
        {children}
        <TooltipRoot tooltip={tooltip} />
      </Component>
    </TooltipContext.Provider>
  );
};

export default RootComponent;
