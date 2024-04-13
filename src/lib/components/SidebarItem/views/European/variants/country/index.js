import React from "react";
import classNames from "classnames";
import "./index.scss";
import Flag from "../../../../../Flag/index.js";
import Text from "../../../../../Text/index.js";

const Variant = ({
  countryName,
  countryId,
  eventCount,
  isActive,
  isDisabled,
}) => {
  const ViewClassName = classNames({
    [`view_european_side_bar_item_country`]: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      <Flag fId={countryId} />

      <div>
        <Text customClassName={"country_name"} text={countryName} />
        <Text customClassName={"country_count"} text={`(${eventCount})`} />
      </div>

      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

export default Variant;
