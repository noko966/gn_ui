import React from "react";
import PropTypes from "prop-types";
// import classNames from "classnames";
// import "./index.scss";
import Symbol from "./-moleculs/Symbol/index.js";

const SymbolComponent = ({ variant, sportId, size, className }) => {
  const Component =
    {
      Symbol: Symbol,
      // icon_outline: IconOutline,
      // image: Image,
      // flag: Flag,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[(variant, sportId, size, className)] || Symbol;

  return (
    <Component sportId={sportId} variant={variant} className={className} />
  );
};

SymbolComponent.propTypes = {
  variant: PropTypes,
};

export default SymbolComponent;
