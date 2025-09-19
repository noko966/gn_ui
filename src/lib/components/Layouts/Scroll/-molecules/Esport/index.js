import React from "react";
import classNames from "classnames";
import "./index.scss";

const EsportView = ({ children, fullHeight }) => {
  const ViewClassName = classNames({
    [`view_esport_${"scroll_y"}`]: true,
    view_esport_scroll_y_full_height: fullHeight,
  });
  return <div className={ViewClassName}>{children}</div>;
};

export default EsportView;
