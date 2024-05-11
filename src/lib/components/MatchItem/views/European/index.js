import React, { useState } from "react";
import classNames from "classnames";
import Symbol from "../../../Symbol/index.js";
import Text from "../../../Text/index.js";
import Dropdown from "../../../Dropdown/Dropdown.js";
import "./index.scss";

const GameHeader = ({ data, isDisabled }) => {
  const [isActive, setIsActive] = useState(true);

  const rootClassName = classNames({
    [`european_view_match_header_base`]: true,
    variant_sport: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });

  // Function to toggle the visibility
  const setIsActiveFunction = () => {
    setIsActive(!isActive);
  };

  return (
    <div onClick={setIsActiveFunction} className={rootClassName}>
      <div className="layout_start">
        <div className="layout_t">
          <Text customClassName={"n"} text={data.HT} />
          <Text customClassName={"n"} text={data.AT} />
        </div>
      </div>
      <div className="layout_end">
        <Text text={`#${data.eventId}`} />
        <Text text={data.date} />
        <Text text={data.time} />
        <div className="match_event_header_layout_more">
          <button
            onClick={() => {}}
            className="match_event_more"
          >{`+${data.count}`}</button>
        </div>
      </div>
    </div>
  );
};

const GameHeaderMarkets = ({ isActive, isDisabled, data }) => {
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
          <Text customClassName={"n"} text={data.HT} />
          <Text customClassName={"n"} text={data.AT} />
        </div>
      </div>
      <div className="layout_end">
        <Text text={data.date} />
        <Text text={data.time} />
        <Symbol sportId={"swap"} />
      </div>
    </div>
  );
};

const MarketFilter = ({ isDisabled, isActive, data }) => {
  const rootClassName = classNames({
    [`european_view_match_header_base`]: true,
    variant_markets_filter: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });

  const BgClassName = classNames({
    sport_bg_graphics: true,
    [`sport_type_${data.id}`]: true,
  });

  return (
    <div className={rootClassName}>
      <div className="layout_start">
        <Symbol sportId={"double"} />
        <Symbol sportId={data.id} />
        <div className="layout_t">
          <Text customClassName={"n"} text={data.name} />
        </div>
        {data.info && <Symbol sportId={"info"} />}
        <Dropdown
          onChange={() => {}}
          options={data.options.map((d) => {
            return { value: d.value, icon: d.icon };
          })}
        />
      </div>
      <div className="layout_end">
        {/* <Symbol sportId={"swap"} /> */}
        <div className={BgClassName}></div>
      </div>
    </div>
  );
};

const EuropeanView = ({ variant, data, ...rest }) => {
  const Component =
    {
      gameHeaderMarkets: GameHeaderMarkets,
      filter: MarketFilter,
      gameHeader: GameHeader,
    }[variant] || GameHeader;

  return <Component variant={variant} data={data} {...rest} />;
};

export default EuropeanView;
