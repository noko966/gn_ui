import React from "react";
import classNames from "classnames";
import Symbol from "../../../Symbol/index.js";
import Favorite from "../../../Favorite/index.js";
import Text from "../../../Text/index.js";
import Flag from "../../../Flag/index.js";
import "./index.scss";

const Sport = ({ id, isActive, isDisabled, name, count, iconVariant }) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_base`]: true,
    variant_sport: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div className={rootClassName}>
      <Symbol variant={iconVariant} sportId={id} />
      <div className="layout_fill">
        <Text customClassName={"n"} text={name} />
        <Text customClassName={"c"} text={`(${count})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  )
}


const Country = ({ id, isActive, isDisabled, name, count, iconVariant }) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_base`]: true,
    variant_country: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div className={rootClassName}>
      <Flag fId={id} />
      <div className="layout_fill">
        <Text customClassName={"n"} text={name} />
        <Text customClassName={"c"} text={`(${count})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  )
}

const League = ({ isActive, isDisabled, name, count, iconVariant }) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_base`]: true,
    variant_league: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div className={rootClassName}>
      <Favorite onChange={()=>{}}/>
      <div className="layout_fill">
        <Text customClassName={"n"} text={name} />
        <Text customClassName={"c"} text={`(${count})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  )
}


const FavVariant = ({ isActive, isDisabled, name, count, iconVariant }) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_base`]: true,
    variant_favorite: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div className={rootClassName}>
      <Symbol variant={iconVariant} sportId={'star_out'} />
      <div className="layout_fill">
        <Text customClassName={"n"} text={name} />
        <Text customClassName={"c"} text={`(${count})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  )
}

const SideBarItemVariant = ({
  view,
  variant,
  name,
  id,
  count,
  iconVariant,
  isActive,
  isDisabled,
}) => {
  const Component =
    {
      sport: Sport,
      country: Country,
      favorite: FavVariant,
      league: League,

    }[variant] || Sport;

  return (
    <Component
      view={view}
      variant={variant}
      name={name}
      id={id}
      count={count}
      isActive={isActive}
      isDisabled={isDisabled}
      iconVariant={iconVariant}
    />
  );
};

export default SideBarItemVariant;




