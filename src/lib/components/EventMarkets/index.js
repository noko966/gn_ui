import React from "react";

// import "./index.scss";
import EuropeanView from "./views/European/index";
import { data } from "./data/data";

const MarketComponent = ({ view, variant, data, ...rest }) => {
  const Component =
    {
      european: EuropeanView,
      // african: AfricanView,
    }[view] || EuropeanView;

  return <Component view={view} variant={variant} data={data} {...rest} />;
};

export { MarketComponent, data as marketComponentFakeData };
