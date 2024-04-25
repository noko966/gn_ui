import React, { createContext, useContext, useState } from "react";

// import "./index.scss";
import European from "./views/European/index.js";

const Content = ({ view, variant, children, isActive, setIsActive }) => {
  const Component =
    {
      european: European,
    }[view] || European;

  return (
    <Component
      view={view}
      variant={variant}
      children={children}
      isActive={isActive}
      setIsActive={setIsActive}
    />
  );
};

export default Content;
