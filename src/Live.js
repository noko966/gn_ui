import React, { Children } from "react";
import classNames from "classnames";
import {
  Scroll,
  Text,
  Symbol,
  OddsWrapper,
  Odd,
  MatchItem,
  MarketFilter,
} from "../library/digi-library";

const EVENTS_DATA = [
  {
    HTN: "Real Madrid",
    ATN: "Barcelona",
    HTSc: 1,
    ATSc: 2,
    HasLI: true,
    HasLC: true,
    Time: "28'",
    MoreCount: 5,
    Bet: "Some Market Name",
  },
  {
    HTN: "Manchester United",
    ATN: "Liverpool",
    HTSc: 3,
    ATSc: 3,
    HasLI: false,
    HasLC: true,
    Time: "45'",
    MoreCount: 7,
    Bet: "Some Market Name",
  },
  {
    HTN: "Los Angeles Lakers",
    ATN: "Boston Celtics",
    HTSc: 102,
    ATSc: 99,
    HasLI: true,
    HasLC: false,
    Time: "48'",
    MoreCount: 10,
    Bet: "Some Market Name",
  },
];

const getData = () => {
  const arrSport = [1, 10, 4, 46, 6, 39];
  const dataSport = {
    1: "football",
    10: "ice hockey",
    4: "basketball",
    46: "martial arts",
    6: "american football",
    39: "aussie rules",
  };
  const arrCountry = [111, 170, 121, 194, 133];

  const dataCountry = {
    111: "denmark",
    170: "poland",
    121: "iran",
    194: "tunisia",
    133: "cyprus",
  };
  let indexSport = Math.ceil(Math.random() * arrSport.length - 1);
  let indexCountry = Math.ceil(Math.random() * arrCountry.length - 1);
  let res = {
    sportName: dataSport[arrSport[indexSport]],
    sportId: arrSport[indexSport],
    countryName: dataCountry[arrCountry[indexCountry]],
    countryId: arrCountry[indexCountry],
  };
  return res;
};

const LiveMatchHeaderComponent = ({ id }) => {
  const BgClassName = classNames({
    sport_bg_graphics: true,
    [`sport_type_${id}`]: true,
  });

  return (
    <div className="european_view_live_match_header">
      <div className="layout_fill">
        <Symbol sportId={"double"} />
        <Text customClassName={"n"} text={"Sport Name"} />
      </div>
      <div className="layout_hug">
        <Text customClassName={"c"} text={`(${25})`} />
        <div className={BgClassName}></div>
      </div>
    </div>
  );
};

const LiveMatchLegendComponent = ({ id }) => {
  const BgClassName = classNames({
    sport_bg_graphics: true,
    [`sport_type_${id}`]: true,
  });

  return (
    <div className="european_view_live_match_legend">
      <div className="layout_fill">
        <Text customClassName={"n"} text={"Sport Name"} />
        <Symbol sportId={"info"} />
      </div>
      <div className="layout_hug">
        <Text customClassName={"c"} text={"some comment"} />
        <Symbol sportId={"stream"} />
      </div>
    </div>
  );
};

const LiveMatchEventComponent = ({ id, children }) => {
  const rootClassName = classNames({
    european_view_live_match_event: true,
  });

  return (
    <div className={rootClassName}>
      <div className="layout_start">
        <div className="lo_ts">
          <div className="lo_tsr">
            <Text customClassName="sc" text={10} />
            <Text customClassName="tn" text={"team name home"} />
          </div>
          <div className="lo_tsr">
            <Text customClassName="sc" text={9} />
            <Text customClassName="tn" text={"team name away"} />
          </div>
        </div>
      </div>
      <div className="layout_end">
        <div className="lo_slider_container">
          <button className="lo_slider_control">
            <Symbol sportId="angle_left" />
          </button>
          <div className="lo_slider">{children}</div>
          <button className="lo_slider_control">
            <Symbol sportId="angle_right" />
          </button>
        </div>
        <div className="lo_rest">
          <button className="european_view_live_match_rest">{`+${5}`}</button>
        </div>
      </div>
    </div>
  );
};

const LivePage = () => {
  return (
    <div className="european_view_live_root">
      <div className="european_view_live_content_layout">
        <Scroll>
          <div className="european_view_live_list">
            <div>
              <LiveMatchHeaderComponent id={1} />
              <LiveMatchLegendComponent />
              <LiveMatchEventComponent>
                <OddsWrapper>
                  <Odd variant="full" factor={"1.01"} market={"p1"} />
                  <Odd variant="full" factor={"1.01"} market={"x"} />
                  <Odd variant="full" factor={"1.01"} market={"p2"} />
                </OddsWrapper>
                <OddsWrapper>
                  <Odd variant="full" factor={"1.01"} market={"p1"} />
                  <Odd variant="full" factor={"1.01"} market={"x"} />
                  <Odd variant="full" factor={"1.01"} market={"p2"} />
                </OddsWrapper>
                <OddsWrapper>
                  <Odd variant="full" factor={"1.01"} market={"p1"} />
                  <Odd variant="full" factor={"1.01"} market={"x"} />
                  <Odd variant="full" factor={"1.01"} market={"p2"} />
                </OddsWrapper>
              </LiveMatchEventComponent>
            </div>
          </div>
        </Scroll>
      </div>
    </div>
  );
};
export default LivePage;
