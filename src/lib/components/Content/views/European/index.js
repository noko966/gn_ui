import React from "react";
import classNames from "classnames";
import "./index.scss";
const Content = ({ isActive, setIsActive, children }) => {
  const rootClassName = classNames({
    [`view_european_content`]: true,
    state_active: isActive,
  });
  return (
    <div onClick={setIsActive} className={rootClassName}>
      {children}
    </div>
  );
};

export default Content;
