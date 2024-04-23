import React from "react";

// import "./index.scss";
import European from "./views/European/index.js";

const SideBarItemComponent = ({
  view,
  variant,
  name,
  id,
  count,
  iconVariant,
  isActive,
  isDisabled,
  ht,
  at,
  hs,
  as,
  time,
  HasLI
}) => {
  const Component =
    {
      european: European,
    }[view] || European;

  return (
    <Component
      view={view}
      variant={variant}
      name={name}
      id={id}
      count={count}
      isActive={isActive}
      isDisabled={isDisabled}
      iconVariant={iconVariant}
      ht={ht}
      at={at}
      hs={hs}
      as={as}
      time={time}
      HasLI={HasLI}
    />
  );
};

export default SideBarItemComponent;
