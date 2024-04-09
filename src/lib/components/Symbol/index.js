import React from "react";
import PropTypes from "prop-types";
// import classNames from "classnames";
// import "./index.scss";
import Symbol from "./-moleculs/Symbol/index.js";

const SymbolComponent = ({ variant, sportId }) => {
  const Component =
    {
      Symbol: Symbol,
      // icon_outline: IconOutline,
      // image: Image,
      // flag: Flag,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[(variant, sportId)] || Symbol;

  return <Component sportId={sportId} variant={variant} />;
};

SymbolComponent.propTypes = {
  variant: PropTypes,
};

export default SymbolComponent;
