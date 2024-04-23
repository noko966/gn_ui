import React from "react";

// import "./index.scss";
import European from "./views/European/index.js";

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
  isDisabled

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
      children={children}
      isActive={isActive}
      isDisabled={isDisabled}
    />
  );
};

export default MatchItemComponent;
