import React from "react";
import classNames from "classnames";
import "./index.scss";
import Text from "../../../../../Text/index.js";

const Variant = ({ isDisabled, isActive, leagueName }) => {
  const ViewClassName = classNames({
    view_european_side_bar_item_league: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div className={ViewClassName}>
      <i className="fav_icon dg_icon_star" />
      <div>
        <Text customClassName={"league_name"} text={leagueName} />
      </div>
    </div>
  );
};

export default Variant;
