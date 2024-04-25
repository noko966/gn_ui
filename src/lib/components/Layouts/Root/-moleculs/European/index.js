import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import "./index.scss";

const EuropeanView = ({ children, fullHeight, view, isRTL }) => {
  const rootRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (rootRef.current) {
        setWidth(rootRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth(); // Initial call

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getClass = () => {
    if (width < 600) {
      return "m";
    } else if (width >= 600 && width < 900) {
      return "m t";
    } else if (width >= 900 && width < 1200) {
      return "m t ds";
    } else if (width >= 1200 && width < 1600) {
      return "m t ds dm";
    } else {
      return "m t ds dm dl";
    }
  };

  const ViewClassName = classNames({
    [`view_european_${"root"}`]: true,
    dg_rtl: isRTL,
    view_european_scroll_y_full_height: fullHeight,
    [getClass()]: true,
  });
  return (
    <main view={view} className={ViewClassName} ref={rootRef}>
      {children}
    </main>
  );
};

export default EuropeanView;
