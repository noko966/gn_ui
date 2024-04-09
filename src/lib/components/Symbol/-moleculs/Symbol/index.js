import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";

const Mapping = {
  0: "icon_36",
  1: "icon_3",
  2: "icon_2",
  3: "icon_3",
  4: "icon_4",
  5: "icon_5",
  6: "icon_6",
  7: "icon_7",
  8: "icon_8",
  9: "icon_9",
  10: "icon_10",
  11: "icon_11",
  12: "icon_12",
  13: "icon_13",
  14: "icon_14",
  15: "icon_15",
  16: "icon_16",
  17: "icon_17",
  18: "icon_18",
  19: "icon_19",
  20: "icon_20",
};

const Variants = {
  300: "dg_icon_300",
  400: "dg_icon_400",
};

const Symbol = ({ sportId, variant }) => {
  const iconClassName = Mapping[sportId] || "icon_36";
  const iconVariantClassName = Variants[variant] || "dg_icon_400";
  const ViewClassName = classNames({
    dg_icon: true,
    [iconClassName]: true,
    [iconVariantClassName]: true,
  });
  return <i className={ViewClassName} />;
};

Symbol.propTypes = {
  sportId: PropTypes.number,
  variant: PropTypes.number,
};

export default Symbol;
