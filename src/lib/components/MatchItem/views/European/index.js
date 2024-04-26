import React, { useEffect, useLayoutEffect, useState } from "react";
import classNames from "classnames";
import Symbol from "../../../Symbol/index.js";
import Favorite from "../../../Favorite/index.js";
import Text from "../../../Text/index.js";
import Dropdown from "../../../Dropdown/Dropdown.js";
import "./index.scss";

const Game = ({ ht, at, id, date, time, more, children, isDisabled }) => {
  const [isActive, setIsActive] = useState(true);

  const rootClassName = classNames({
    [`european_view_match_header_base`]: true,
    variant_sport: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });
  const contentClassName = classNames({
    state_active: isActive,
  });

  // Function to toggle the visibility
  const setIsActiveFunction = () => {
    setIsActive(!isActive);
  };

  return (
    <div>
      <div onClick={setIsActiveFunction} className={rootClassName}>
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
            <button
              onClick={() => {}}
              className="match_event_more"
            >{`+${more}`}</button>
          </div>
        </div>
      </div>
      <div className="european_view_match_event_content">
        <div className={contentClassName}>{children}</div>
      </div>
    </div>
  );
};

const Market = ({ mn, children, isActive, isDisabled, hasCashout }) => {
  const [isVisible, setIsVisible] = useState(true);
  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };
  const [childrenCount, setChildrenCount] = useState(0);
  const rootClassName = classNames({
    [`european_view_match_header_base`]: true,
    variant_market: true,
    state_active: isActive,
    state_disabled: isDisabled,
    sub_state_visible: isVisible,
  });

  useLayoutEffect(() => {
    // Calculate and log the children props
    let count = 0;
    const calculateHeight = (c) => {
      if (c <= 3) {
        return "42px";
      } else if (c === 4 || c === 5) {
        // Add an additional 42px if the count is exactly 4 or 5
        return `${42 + 42}px`;
      } else {
        // Additional 42px for every 2 items beyond the first 3, not counting 4 or 5 because it's handled above
        return `${42 + 42 * Math.ceil((c - 5) / 2) + 42}px`; // Includes the additional 42px from the 4 or 5 items scenario
      }
    };
    React.Children.map(children, (child) => {
      let c = child.props.children.length;
      count = calculateHeight(c);
    });

    setChildrenCount(count); // Update state with the count of children
  }, [children]);

  const contentClassName = classNames({
    sub_state_idle: true,
    sub_state_visible: isVisible,
  });

  const style = { "--count": childrenCount };

  return (
    <div>
      <div onClick={toggleVisible} className={rootClassName}>
        <div className="layout_start">
          <Favorite onClick={() => {}} />
          <Symbol className={"sub_state_affect"} sportId={"angle_up"} />
          <div className="layout_m">
            <Text customClassName={"m"} text={mn} />
          </div>
        </div>
        <div className="layout_end">
          {hasCashout && <Symbol sportId={"cash_out"} />}
        </div>
      </div>
      <div className="european_view_match_event_content">
        <div className={contentClassName} style={style}>
          {children}
        </div>
      </div>
    </div>
  );
};

const MarketsHeader = ({ ht, at, date, time, isDisabled, isActive }) => {
  const rootClassName = classNames({
    [`european_view_match_header_base`]: true,
    variant_markets_header: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });

  return (
    <div className={rootClassName}>
      <div className="layout_start">
        <div className="layout_t">
          <Text customClassName={"n"} text={ht} />
          <Text customClassName={"n"} text={at} />
        </div>
      </div>
      <div className="layout_end">
        <Text text={date} />
        <Text text={time} />
        <Symbol sportId={"swap"} />
      </div>
    </div>
  );
};

const MarketFilter = ({ isDisabled, isActive, id, name, info }) => {
  const rootClassName = classNames({
    [`european_view_match_header_base`]: true,
    variant_markets_filter: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });

  const BgClassName = classNames({
    sport_bg_graphics: true,
    [`sport_type_${id}`]: true,
  });

  return (
    <div className={rootClassName}>
      <div className="layout_start">
        <Symbol sportId={"double"} />
        <Symbol sportId={id} />
        <div className="layout_t">
          <Text customClassName={"n"} text={name} />
        </div>
        {info && <Symbol sportId={"info"} />}
        <Dropdown
          onChange={() => {}}
          options={[
            { value: "football", icon: "sport_front_icon-1" },
            { value: "basketball", icon: "sport_front_icon-2" },
            { value: "ruckby", icon: "sport_front_icon-5" },
          ]}
        />
      </div>
      <div className="layout_end">
        {/* <Symbol sportId={"swap"} /> */}
        <div className={BgClassName}></div>
      </div>
    </div>
  );
};

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
  isDisabled,
  mn,
  hasCashout,
}) => {
  const Component =
    {
      game: Game,
      market: Market,
      marketsHeader: MarketsHeader,
    }[variant] || Game;

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
      mn={mn}
      hasCashout={hasCashout}
    />
  );
};

export { MatchItemVariant, MarketFilter };
