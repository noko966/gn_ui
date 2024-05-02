import React  from "react";
import classNames from "classnames";
// import "./index.scss";
import EuropeanView from "./-moleculs/European/index.js";
import EsportView from "./-moleculs/Esport/index.js";

const ScrollComponent = ({ children, view, fullHeight, isHorizontal }) => {
  const Component =
    {
      european: EuropeanView,
      esport: EsportView,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[view] || EuropeanView;

    


  return <Component children={children} fullHeight={fullHeight} view={view} isHorizontal={isHorizontal} />;
};

export default ScrollComponent;
