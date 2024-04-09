import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";

const EuropeanView = ({ children, fullHeight, view, isRTL }) => {
  const ViewClassName = classNames({
    [`view_european_${"root"}`]: true,
    dg_rtl: isRTL,
    view_european_scroll_y_full_height: fullHeight,
  });
  return (
    <main view={view} isRTL={isRTL} className={ViewClassName}>
      {children}
    </main>
  );
};

EuropeanView.propTypes = {
  children: PropTypes.object,
};

export default EuropeanView;
