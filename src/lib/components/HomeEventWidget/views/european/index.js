import React from "react";
import cn from "classnames";
import "./index.scss";
import Odd from "../../../Odd/index";
import Text from "../../../Text/index";
import Symbol from "../../../Symbol/index";

const HomeEventRow = ({
  HTN,
  ATN,
  HTSc,
  ATSc,
  HasLI,
  HasLC,
  Time,
  MoreCount,
  children,
}) => {
  const componentCn = cn({
    european_view_home_event_row: true,
  });
  return (
    <div className={componentCn}>
      <div className="team_container">
        <Text customClassName={"ev_score h"} text={HTSc} />
        <Text customClassName={"ev_team h"} text={HTN} />
        <Text customClassName={"ev_score a"} text={ATSc} />
        <Text customClassName={"ev_team a"} text={ATN} />
      </div>
      <div className="icons_container">
        {HasLI && <Symbol sportId={"stream"} />}
        {HasLC && <Symbol sportId={"info"} />}
        <Symbol sportId={"stream"} />
      </div>
      <div className="time_container">
        <Text text={Time} />
      </div>
      <div className="eu_ew_odds_container">{children}</div>
      <div className="rest_container">
        <button className="european_view_home_rest">{`+${MoreCount}`}</button>
      </div>
    </div>
  );
};

const HomeEventRowExpert = ({ HTN, ATN, Bet, Time, children }) => {
  const componentCn = cn({
    "european_view_home_event_row grid_layout_expert": true,
  });
  return (
    <div className={componentCn}>
      <div className="team_container">
        <Text customClassName={"ev_team h"} text={HTN} />
        <Text customClassName={"ev_team a"} text={ATN} />
      </div>
      <div className="time_container">
        <Text text={Time} />
      </div>
      <div className="bet_container">
        <Text customClassName={"ev_team a"} text={Bet} />
      </div>
      <div className="odd_container">{children}</div>
    </div>
  );
};

const HomeEventRowMultiBet = ({
  HTN,
  ATN,
  Bet,
  Time,
  Date,
  sportId,
  Arg,
  EID,
  LN,
}) => {
  const componentCn = cn({
    "european_view_home_event_row grid_layout_multi_bet": true,
  });
  return (
    <div className={componentCn}>
      <Symbol sportId={sportId} />
      <div className="multi_bet_time_container">
        <div>
          <Text text={Date} />
        </div>
        <div>
          <Text text={Time} />
        </div>
      </div>
      <div className="multi_bet_team_container">
        <div className="layout_inline_3">
          <Text customClassName={"ev_id"} text={EID} />
          <Text customClassName={"sp"} text={"|"} />
          <Text customClassName={"ev_league"} text={LN} />
        </div>
        <div className="layout_inline_3">
          <Text customClassName={"ev_team h"} text={HTN} />
          <Text customClassName={"sp"} text={"-"} />
          <Text customClassName={"ev_team a"} text={ATN} />
        </div>
      </div>

      <div className="bet_container">
        <Text customClassName={"ev_res"} text={Bet} />
      </div>
      <div className="arg_container">
        <Text customClassName={"ev_arg"} text={Arg} />
      </div>
    </div>
  );
};

const HomeEventWidgetRowVariant = ({
  variant,
  HTN,
  ATN,
  HTSc,
  ATSc,
  HasLI,
  HasLC,
  Time,
  MoreCount,
  Bet,
  Date,
  sportId,
  Arg,
  EID,
  LN,
  children,
}) => {
  const Component =
    {
      default: HomeEventRow,
      expert: HomeEventRowExpert,
      nultiBet: HomeEventRowMultiBet,
    }[variant] || HomeEventRow;

  return (
    <Component
      variant={variant}
      HTN={HTN}
      ATN={ATN}
      HTSc={HTSc}
      ATSc={ATSc}
      HasLI={HasLI}
      HasLC={HasLC}
      Time={Time}
      Date={Date}
      Bet={Bet}
      MoreCount={MoreCount}
      sportId={sportId}
      Arg={Arg}
      EID={EID}
      LN={LN}
    >
      {children}
    </Component>
  );
};

const HomeEventWidgetLegend = ({}) => {
  return (
    <div className="european_view_home_event_legend">
      <div className="legend_item_start">{"event"}</div>
      <div className="tdTime">{"time"}</div>

      <div className="eu_ew_l_odds_container odds_layout odds_layout_3">
        <div className={"odd_w"}>{"p1"}</div>
        <div className={"odd_w"}>{"x"}</div>
        <div className={"odd_w"}>{"p2"}</div>
      </div>
      <div className="legend_item_center">{"more"}</div>
    </div>
  );
};

const HomeEventWidgetLegendExpert = ({}) => {
  return (
    <div className="european_view_home_event_expert_legend">
      <div className="legend_item_start">{"event"}</div>
      <div className="legend_item_center">{"time"}</div>
      <div className="legend_item_start">{"bet"}</div>
      <div className="legend_item_center">{"odds"}</div>
    </div>
  );
};

export {
  HomeEventWidgetRowVariant as EuropeanView,
  HomeEventWidgetLegend,
  HomeEventWidgetLegendExpert,
};
