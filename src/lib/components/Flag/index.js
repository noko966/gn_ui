import React from "react";
import classNames from "classnames";
// import "./index.scss";
const Mapping = {
  0: "dg_flag-default",
  113: "dg_flag-113",
  111: "dg_flag-111",
  133: "dg_flag-133",
  170: "dg_flag-170",
  121: "dg_flag-121",
  194: "dg_flag-194",
};
const Flag = ({ fId }) => {
  const iconClassName = Mapping[fId] || "dg_flag-default";
  const flagClassName = classNames({
    dg_flag: true,
    [iconClassName]: true,
    [`${fId}`]: fId,
  });
  return <i className={flagClassName} />;
};

export default Flag;
