import React from "react";

// import "./index.scss";
import { MatchItemVariant as European } from "./views/European/index.js";
import { MarketFilter } from "./views/European/index.js";

const MatchItemComponent = ({
  view,
  variant,
  ht,
  at,
  id,
  date,
  time,
  more,
  children,
  isActive,
  isDisabled,
  mn,
  hasCashout,
}) => {
  const Component =
    {
      european: European,
    }[view] || European;

  return (
    <Component
      view={view}
      variant={variant}
      ht={ht}
      at={at}
      id={id}
      date={date}
      time={time}
      more={more}
      isActive={isActive}
      isDisabled={isDisabled}
      mn={mn}
      children={children}
      hasCashout={hasCashout}
    />
  );
};

export { MatchItemComponent as MatchItem, MarketFilter };
