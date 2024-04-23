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
    />
  );
};

export default SideBarItemComponent;
