import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./index.scss";
const Mapping = {
  0: "dg_flag-default",
  113: "dg_flag-113",
};
const Flag = ({ fId }) => {
  const iconClassName = Mapping[fId] || "dg_flag-default";
  const flagClassName = classNames({
    dg_flag: true,
    [iconClassName]: true,
  });
  return <i className={flagClassName} />;
};

Flag.propTypes = {
  fId: PropTypes.number,
};

export default Flag;
