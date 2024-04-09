import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";

const EuropeanView = ({ children, fullHeight }) => {
  const ViewClassName = classNames({
    [`view_european_${"scroll_y"}`]: true,
    view_european_scroll_y_full_height: fullHeight,
  });
  return <div className={ViewClassName}>{children}</div>;
};

EuropeanView.propTypes = {
  children: PropTypes.object,
};

export default EuropeanView;
