import React from "react";
import classNames from "classnames";
import "./index.scss";
import Text from "../../../../../Text/index.js";

const Variant = ({ favCount, isDisabled, isActive, name }) => {
  const ViewClassName = classNames({
    view_european_side_bar_item_favorite: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      <i className="fav_icon dg_icon_star" />
      <div>
        <Text customClassName={"fav_name"} text={name} />
      </div>

      <Text customClassName={"fav_count"} text={`(${favCount})`} />
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

export default Variant;
