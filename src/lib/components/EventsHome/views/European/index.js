import React, { useEffect, useLayoutEffect, useState } from "react";
import classNames from "classnames";
import Symbol from "../../../Symbol/index.js";
import Favorite from "../../../Favorite/index.js";
import Text from "../../../Text/index.js";
import { Odd, OddsWrapper } from "../../../Odd/index.js";
import "./index.scss";


const EventHeaderHome = ({ isDisabled, isActive, data }) => {
  const rootClassName = classNames({
    [`european_view_home_event_header`]: true,
    prematch_live: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });

  let renderCount = `(${data.CNT.length})`;

  return (
    <div className={rootClassName}>
      <div className="dont_shrink">
        <Symbol sportId={"angle_up"} />
      </div>
      <div className="grow">
        <Text
          customClassName={"event_group_name"}
          text={data.N}
        />
        <Text customClassName={"event_groups_count"} text={renderCount} />
      </div>
      <div className="dont_shrink">
        <Symbol sportId={data.Id} />
      </div>
    </div>
  );
};


const EventHomeOdds = ({ stakes }) => {
  // Create an array of default <Odd /> components
  const defaultOdds = [];
  for (let i = 0; i < 3; i++) {
    defaultOdds.push(<Odd key={`default-${i}`} factor={'-'} />);
  }

  // Determine the components to render based on `stakes`
  const oddsToRender = stakes && stakes.length === 3
    ? stakes[0].Stakes.map((st, i) => <Odd key={i} factor={st.F} />)
    : defaultOdds;

  return (
    <div className="td_stakes">
      {oddsToRender}
    </div>
  );
};


const EventHome = ({ isDisabled, isActive, data }) => {
  const rootClassName = classNames({
    [`euw_event_home`]: true,
    prematch_live: true,
    state_active: isActive,
    state_disabled: isDisabled,
  });


  const stakes = data.CL[0].E[0].StakeTypes

  return (
    <div className={rootClassName}>
      <div className="td_team">
        <div className="flex">
          <Text
            customClassName={"text_score"}
            text={data.CL[0].E[0].HS}
          />
          <Text
            customClassName={"text_team ellipsis"}
            text={data.CL[0].E[0].HT}
          />
        </div>
        <div className="flex">
          <Text
            customClassName={"text_score"}
            text={data.CL[0].E[0].AS}
          />
          <Text
            customClassName={"text_team ellipsis"}
            text={data.CL[0].E[0].AT}
          />
        </div>
      </div>
      <div className="td_icons">
        {data.CL[0].E[0].IsLS && <Symbol sportId={'stream'} />}
        {data.CL[0].E[0].IsLI && <Symbol sportId={'liva_info'} />}
      </div>
      <div className="td_time">
        <Text
          customClassName={"text_time"}
          text={data.CL[0].E[0].D}
        />
      </div>
      {<EventHomeOdds stakes={stakes}/>}
      <div className="dont_shrink">
        <button className="euw_event_home_btn_more"></button>
      </div>
    </div>
  );
};

const EventFilterHome = ({ data }) => {
  const rootClassName = classNames({
    [`euv_home_event_filter`]: true,
    prematch_live: true,
    // state_disabled: isDisabled,
  });

  return (
    <div className={rootClassName}>
      <div className="grow">
        <Text customClassName="widget_name" text={data.N} />
      </div>
      <div className="dont_shrink">
        <div className="european_view_home_event_tabs_row">
          {data.filters.map((f, i) => {
            return (
              <button key={i} className="european_view_home_event_tab state_active">
                <Symbol sportId={f.id} />
              </button>
            )
          })}

        </div>

      </div>
    </div>



  );
};


const EventGroupTheadHome = ({ data, translations }) => {
  return (
    <div className="euv_home_event_thead">
      <div className="grow ellipsis">{translations.event}</div>
      <div className="tdTime ellipsis">{translations.time}</div>

      <div className="dont_shrink tdStakes">
        {
          data.map((stk, i) => {
            return (
              <div key={i} className={"tdStake ellipsis"}>{stk.SN}</div>
            )
          })
        }
      </div>
      <div className="tdMore ellipsis">{translations.more}</div>
    </div>
  )
}



const EuropeanView = ({ variant, data, ...rest }) => {
  const Component =
    {
      header: EventHeaderHome,
      filter: EventFilterHome,
      thead: EventGroupTheadHome,
      event: EventHome,
    }[variant] || EventHeaderHome;

  return <Component variant={variant} data={data} {...rest} />;
};

export default EuropeanView;
