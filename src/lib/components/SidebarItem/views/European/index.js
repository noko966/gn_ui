import React from "react";
import classNames from "classnames";
import Symbol from "../../../Symbol/index.js";
import Favorite from "../../../Favorite/index.js";
import Text from "../../../Text/index.js";
import Flag from "../../../Flag/index.js";
import "./index.scss";
const Sport = ({
  id,
  isActive,
  setIsActive,
  isDisabled,
  name,
  count,
  iconVariant,
}) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_base`]: true,
    variant_sport: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div onClick={setIsActive} className={rootClassName}>
      <Symbol variant={iconVariant} sportId={id} />
      <div className="layout_fill">
        <Text customClassName={"n"} text={name} />
        <Text customClassName={"c"} text={`(${count})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

const Country = ({
  id,
  isActive,
  setIsActive,
  isDisabled,
  name,
  count,
  iconVariant,
}) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_base`]: true,
    variant_country: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div onClick={setIsActive} className={rootClassName}>
      <Flag fId={id} />
      <div className="layout_fill">
        <Text customClassName={"n"} text={name} />
        <Text customClassName={"c"} text={`(${count})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

const League = ({
  isActive,
  setIsActive,
  isDisabled,
  name,
  count,
  iconVariant,
}) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_base`]: true,
    variant_league: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div onClick={setIsActive} className={rootClassName}>
      <Favorite onChange={() => {}} />
      <div className="layout_fill">
        <Text customClassName={"n"} text={name} />
        <Text customClassName={"c"} text={`(${count})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

const FavVariant = ({
  isActive,
  setIsActive,
  isDisabled,
  name,
  count,
  iconVariant,
}) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_base`]: true,
    variant_favorite: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div onClick={setIsActive} className={rootClassName}>
      <Symbol variant={iconVariant} sportId={"star_out"} />
      <div className="layout_fill">
        <Text customClassName={"n"} text={name} />
        <Text customClassName={"c"} text={`(${count})`} />
      </div>
      <i className="state_change_icon dg_icon_angle_bottom" />
    </div>
  );
};

const Live = ({
  isActive,
  setIsActive,
  isDisabled,
  ht,
  at,
  hs,
  as,
  time,
  HasLI,
}) => {
  const rootClassName = classNames({
    [`view_european_side_bar_item_live`]: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div onClick={setIsActive} className={rootClassName}>
      <div className="_row_start">
        <Favorite onChange={() => {}} />
        <div className="layout_fill">
          <div className="layout_t_s">
            <Text customClassName={"n"} text={ht} />
            <Text customClassName={"s"} text={hs} />
          </div>
          <div className="layout_t_s">
            <Text customClassName={"n"} text={at} />
            <Text customClassName={"s"} text={as} />
          </div>
        </div>
        <div className="layout_end">
          {HasLI && <Symbol sportId={"stream"} />}
          <Text customClassName={"t"} text={time} />
        </div>
      </div>
      <div className="_row_end">
        <Text text={"("} />
        <div className="live_score_token">
          <Text text={"0"} />
          <Text customClassName="spr" text={":"} />
          <Text text={"1"} />
        </div>
        <div className="live_score_token">
          <Text text={"0"} />
          <Text customClassName="spr" text={":"} />
          <Text text={"1"} />
        </div>

        <Text text={")"} />
      </div>
    </div>
  );
};

const SideBarItemVariant = ({
  view,
  variant,
  name,
  id,
  count,
  iconVariant,
  isActive,
  setIsActive,
  isDisabled,
  ht,
  at,
  hs,
  as,
  time,
  HasLI,
}) => {
  const Component =
    {
      sport: Sport,
      country: Country,
      favorite: FavVariant,
      league: League,
      live: Live,
    }[variant] || Sport;

  return (
    <Component
      view={view}
      variant={variant}
      name={name}
      id={id}
      count={count}
      isActive={isActive}
      setIsActive={setIsActive}
      isDisabled={isDisabled}
      iconVariant={iconVariant}
      ht={ht}
      at={at}
      hs={hs}
      as={as}
      time={time}
      HasLI={HasLI}
    />
  );
};

export default SideBarItemVariant;
