import React from "react";
import PropTypes from "prop-types";
// import classNames from "classnames";
// import "./index.scss";
import SportIcon from "./-moleculs/Icon/index.js";

const Icon = ({ variant, sportId }) => {
  const Component =
    {
      sportIcon400: SportIcon,
      sportIcon300: SportIcon,
      // icon_outline: IconOutline,
      // image: Image,
      // flag: Flag,
      // asian: AsianView,
      // esport: EsportView,
      // Add other components as needed
    }[variant, sportId] || SportIcon;

  return (
    <Component
      sportId={sportId}
      variant={variant}
    />
  );
};

Icon.propTypes = {
  variant: PropTypes.object,
};

export default Icon;
