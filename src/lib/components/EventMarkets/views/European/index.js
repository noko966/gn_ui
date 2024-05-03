import React, { useEffect, useLayoutEffect, useState } from "react";
import classNames from "classnames";
import Symbol from "../../../Symbol/index.js";
import Favorite from "../../../Favorite/index.js";
import Text from "../../../Text/index.js";
import Dropdown from "../../../Dropdown/Dropdown.js";
import { Odd, OddsWrapper } from "../../../Odd/index.js";
import "./index.scss";

const MarketStakes = ({ data, isDisabled, isActive }) => {
  const rootClassName = classNames({
    [`european_view_market_stakes_base`]: true,
    prematch_live: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });

  return (
    <div className={rootClassName}>
      <OddsWrapper>
        {data.map((st) => {
          return <Odd variant="full" factor={st.F} market={st.N} />;
        })}
      </OddsWrapper>
    </div>
  );
};

const MarketFilter = ({ isDisabled, isActive, data }) => {
  const rootClassName = classNames({
    [`euv_market_header_base`]: true,
    prematch_live: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });

  return (
    <div className={rootClassName}>
      <div className="">
        <Dropdown
          onChange={() => {}}
          options={data.map((m) => {
            return {
              value: m.N,
            };
          })}
        />
      </div>
    </div>
  );
};

const MarketHeader = ({ data }) => {
  const rootClassName = classNames({
    [`european_view_market_header_base`]: true,
    prematch_live: true,
    state_active: data.IsA,
    // state_disabled: isDisabled,
  });

  return (
    <div className={rootClassName}>
      <div className="flex grow">
        <div className="dont_shrink">
          <Favorite id={data.Id} onClick={() => {}} />
        </div>
        <div className="dont_shrink">
          <Symbol className={"sub_state_affect"} sportId={"angle_up"} />
        </div>
        <div className="grow">
          <Text customClassName={"market_name"} text={data.N} />
        </div>
      </div>
      {data.IsC && <Symbol sportId={"cash_out"} />}
    </div>
  );
};

const EuropeanView = ({ variant, data, ...rest }) => {
  const Component =
    {
      header: MarketHeader,
      filter: MarketFilter,
      stakes: MarketStakes,
    }[variant] || MarketHeader;

  return <Component variant={variant} data={data} {...rest} />;
};

export default EuropeanView;
