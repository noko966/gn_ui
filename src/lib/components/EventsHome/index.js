import React from "react";

// import "./index.scss";
import EuropeanView from "./views/European/index";
import { data, eventData } from "./data/data";

const EventComponent = ({ view, variant, data, ...rest }) => {
  const Component =
    {
      european: EuropeanView,
      // african: AfricanView,
    }[view] || EuropeanView;

  return <Component view={view} variant={variant} data={data} {...rest} />;
};

export { EventComponent, data as eventHomeComponentFakeData, eventData as eventFakeData };
