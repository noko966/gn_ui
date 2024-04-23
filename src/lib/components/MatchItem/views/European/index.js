import React from "react";
import classNames from "classnames";
import Symbol from "../../../Symbol/index.js";
import Favorite from "../../../Favorite/index.js";
import Text from "../../../Text/index.js";
import "./index.scss";

const Game = ({ ht, at, id, date, time, more, children, isActive, isDisabled }) => {
  const rootClassName = classNames({
    [`european_view_match_header_base`]: true,
    variant_sport: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  return (
    <div>
      <div className={rootClassName}>
        <div className="layout_start">
          <div className="layout_t">
            <Text customClassName={"n"} text={ht} />
            <Text customClassName={"n"} text={at} />
          </div>
        </div>
        <div className="layout_end">
          <Text text={`#${id}`} />
          <Text text={date} />
          <Text text={time} />
          <div className="match_event_header_layout_more">
            <button onClick={() => { }} className="match_event_more">{`+${more}`}</button>
          </div>
        </div>
      </div>
      <div className="european_view_match_event_content">
        {children}
      </div>
    </div>

  )
}


const MatchItemVariant = ({
  view,
  variant,
  ht,
  at,
  id,
  date,
  time,
  more,
  children,
  isActive,
  isDisabled
}) => {
  const Component =
    {
      game: Game,
      // country: Country,

    }[variant] || Sport;

  return (
    <Component
      view={view}
      variant={variant}
      ht={ht}
      at={at}
      id={id}
      date={date}
      time={time}
      more={more}
      children={children}
      isActive={isActive}
      isDisabled={isDisabled}
    />
  );
};

export default MatchItemVariant;




