import React from "react";
import classNames from "classnames";
import "./index.scss";
import Symbol from "../../../../../Symbol/index.js";
import Text from "../../../../../Text/index.js";

const Variant = ({
  sportName,
  sportId,
  sportCount,
  iconVariant,
  isActive,
  isDisabled,
}) => {
  const ViewClassName = classNames({
    [`view_european_side_bar_item_sport`]: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      <Symbol variant={iconVariant} sportId={sportId} />
      <div>
        <Text customClassName={"sport_name"} text={sportName} />
        <Text customClassName={"sport_count"} text={`(${sportCount})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

export default Variant;
