import React from "react";
import classNames from "classnames";
import "./index.scss";

const EsportView = ({ children, fullHeight, view, isRTL }) => {
  const ViewClassName = classNames({
    [`view_esport_${"root"}`]: true,
    dg_rtl: isRTL,
    view_esport_scroll_y_full_height: fullHeight,
  });
  return (
    <main view={view} isRTL={isRTL} className={ViewClassName}>
      {children}
    </main>
  );
};

export default EsportView;
