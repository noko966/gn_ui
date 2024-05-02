import React from "react";
import {
  Symbol,
  Text,
  Odd,
  OddsWrapper,
  HomeEventWidgetRow,
  Button,
  Collapse,
  HomeEventWidgetLegend,
  Tooltip
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

const HomePage = () => {
  return (
    <div className="home_page_widgets_wrapper">
      <div className="european_view_home_events_widgets_list">
        <div className="european_view_home_events_widget_root">
          <div className="european_view_home_event_filter">
            <span className="widget_name">{"Live events"}</span>
            <div className="european_view_home_event_tabs_row">
              <button className="european_view_home_event_tab state_active">
                <Text text="now" />
              </button>
              <button className="european_view_home_event_tab">
                <Text text="coming up" />
              </button>
            </div>
          </div>
          <Collapse
            toggler={
              <div className="european_view_home_event_header">
                <Symbol sportId={"angle_up"} />
                <div>
                  <Text
                    customClassName={"ev_name"}
                    text={getData().sportName}
                  />
                  <Text customClassName={"ev_count"} text={getData().sportId} />
                </div>
                <Symbol sportId={5} />
              </div>
            }
          >
            <HomeEventWidgetLegend />
            {EVENTS_DATA.map((d, i) => {
              return (
                <HomeEventWidgetRow
                  key={i}
                  HTN={d.HTN}
                  ATN={d.ATN}
                  HTSc={d.HTSc}
                  ATSc={d.ATSc}
                  HasLI={d.HasLI}
                  HasLC={d.HasLC}
                  Time={d.Time}
                  MoreCount={d.MoreCount}
                >
                  {
                    <OddsWrapper>
                    
                        <Odd factor={"1.01"} market={"p1"} />
                      <Odd factor={"1.01"} market={"x"} />
                      <Odd factor={"1.01"} market={"p2"} />
                    </OddsWrapper>
                  }
                </HomeEventWidgetRow>
              );
            })}

            <div className="european_view_home_events_widget_more">
              <Symbol
                customClassName="state_indicator"
                sportId={"angle_down"}
              />
            </div>
          </Collapse>
        </div>
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="european_view_home_events_widget_root">
            <div className="european_view_home_event_filter">
              <span className="widget_name">{"Some events"}</span>
              <div className="european_view_home_event_tabs_row">
                <button className="european_view_home_event_tab state_active">
                  <Symbol sportId={1} />
                </button>
                <button className="european_view_home_event_tab">
                  <Symbol sportId={5} />
                </button>
              </div>
            </div>
            <Collapse
              toggler={
                <div className="european_view_home_event_header">
                  <Symbol sportId={"angle_up"} />
                  <div>
                    <Text
                      customClassName={"ev_name"}
                      text={getData().sportName}
                    />
                    <Text
                      customClassName={"ev_count"}
                      text={getData().sportId}
                    />
                  </div>
                  <Symbol sportId={index + 1} />
                </div>
              }
            >
              <HomeEventWidgetLegend />
              {EVENTS_DATA.map((d, i) => {
                return (
                  <HomeEventWidgetRow
                    key={i}
                    HTN={d.HTN}
                    ATN={d.ATN}
                    HTSc={d.HTSc}
                    ATSc={d.ATSc}
                    HasLI={d.HasLI}
                    HasLC={d.HasLC}
                    Time={d.Time}
                    MoreCount={d.MoreCount}
                  >
                    <OddsWrapper>
                      <Odd factor={"1.01"} market={"p1"} />
                      <Odd factor={"1.01"} market={"x"} />
                      <Odd factor={"1.01"} market={"p2"} />
                    </OddsWrapper>
                  </HomeEventWidgetRow>
                );
              })}
              <div className="european_view_home_events_widget_more">
                <Symbol
                  customClassName="state_indicator"
                  sportId={"angle_down"}
                />
              </div>
            </Collapse>
          </div>
        ))}
      </div>
      <div className="european_view_home_events_widgets_list">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="european_view_home_events_widget_root">
            <div className="european_view_home_event_filter">
            
              <span className="widget_name"><Tooltip text="This is Upcoming events tooltip! "><span>{"Upcoming events"}</span></Tooltip></span>
              
              {Array.from({ length: 3 }, (_, index) => (
                <button key={index} className="european_view_home_event_tab">
                  <Symbol sportId={index} />
                </button>
              ))}
            </div>
            <Collapse
              toggler={
                <div className="european_view_home_event_header">
                  <Symbol sportId={"angle_up"} />
                  <div>
                    <Text
                      customClassName={"ev_name"}
                      text={getData().sportName}
                    />
                    <Text
                      customClassName={"ev_count"}
                      text={getData().sportId}
                    />
                  </div>
                  <Symbol sportId={5} />
                </div>
              }
            >
              <HomeEventWidgetLegend />
              {EVENTS_DATA.map((d, i) => {
                return (
                  <HomeEventWidgetRow
                    key={i}
                    HTN={d.HTN}
                    ATN={d.ATN}
                    HTSc={d.HTSc}
                    ATSc={d.ATSc}
                    HasLI={d.HasLI}
                    HasLC={d.HasLC}
                    Time={d.Time}
                    MoreCount={d.MoreCount}
                  >
                    {
                      <OddsWrapper>
                        <Odd factor={"1.01"} market={"p1"} />
                        <Odd factor={"1.01"} market={"x"} />
                        <Odd factor={"1.01"} market={"p2"} />
                      </OddsWrapper>
                    }
                  </HomeEventWidgetRow>
                );
              })}

              <div className="european_view_home_events_widget_more">
                <Symbol
                  customClassName="state_indicator"
                  sportId={"angle_down"}
                />
              </div>
            </Collapse>
          </div>
        ))}
        <div className="european_view_home_events_widget_root">
          <div className="european_view_home_event_filter">
            <span className="widget_name">{"Toto expert"}</span>
            <div className="european_view_home_event_tabs_row">
              {Array.from({ length: 3 }, (_, index) => (
                <button key={index} className="european_view_home_event_tab">
                  <Symbol sportId={index} />
                </button>
              ))}
            </div>
          </div>

          <div className="european_view_home_event_expert_legend">
            <div className="legend_item_start">{"event"}</div>
            <div className="legend_item_center">{"time"}</div>
            <div className="legend_item_start">{"bet"}</div>
            <div className="legend_item_center">{"odds"}</div>
          </div>

          {EVENTS_DATA.map((d, i) => {
            return (
              <HomeEventWidgetRow
                variant={"expert"}
                key={i}
                HTN={d.HTN}
                ATN={d.ATN}
                Bet={d.Bet}
                Time={d.Time}
              >
                <div className="odds_layout">
                  <Odd factor={"1.01"} market={"p1"} />
                </div>
              </HomeEventWidgetRow>
            );
          })}
          <div className="european_view_home_events_widget_more">
            <Symbol customClassName="state_indicator" sportId={"angle_down"} />
          </div>
        </div>

        <div className="european_view_home_events_widget_root">
          <div className="european_view_home_event_filter">
            <span className="widget_name">{"Multi bet of the day"}</span>
          </div>
          <div className="view_european_multi_bet_widget_controls">
            <div className="mbw_controls">
              <button className="mbw_control_p">
                <Symbol sportId={"angle_left"} />
              </button>
              <button className="mbw_control_p">
                <Symbol sportId={"angle_right"} />
              </button>
            </div>
            <div className="mbw_name">
              <Text text={"N1"} />
            </div>
          </div>

          {EVENTS_DATA.map((d, i) => {
            return (
              <HomeEventWidgetRow
                variant={"nultiBet"}
                key={i}
                HTN={"Team name home"}
                ATN={"Team name away"}
                Bet={"Res: win 1"}
                Date={"20-04"}
                Time={"19-00"}
                Arg={"5.21"}
                EID={"12355"}
                LN={"League name"}
                sportId={1}
              />
            );
          })}
          <div className="view_european_multi_bet_widget_footer">
            <div>
              <Text text={""} />
            </div>
            <div>
              <Text text={"5.54"} />
            </div>
            <div>
              <Button
                variant="accent"
                icon={<Symbol sportId={"boost"} />}
                text={"8.45"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
