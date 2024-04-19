import React, { Component } from "react";
import cn from "classnames";
// import "../library/global.css";
// import "../library/fonts.css";
// import "../library/flags.css";
// import "../library/variables.css";

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
  },
];

import {
  Root,
  Symbol,
  Scroll,
  Text,
  SidebarItem,
  SidebarTabs,
  SidebarTab,
  Search_European,
  Input,
  European_Button_var_settings,
  European_Buttons_Row_settings,
  Odd,
  HomeEventWidgetRow,
  Button,
} from "../library/digi-library";

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

const demoRandom = () => {
  return Math.floor(Math.random() * 6) + 2;
};

class App extends Component {
  render() {
    return (
      <div style={{ height: "100svh" }} className="App">
        <Root>
          <Search_European placeholder={"search here ..."} />
          <div className="european_view_home_nav_row">
            <div className="european_view_home_nav_item">
              <span>home</span>
            </div>
            <div className="european_view_home_nav_item">
              <span>live event list</span>
            </div>
            <div className="european_view_home_nav_item">
              <span>multi view</span>
            </div>
            <div className="european_view_home_nav_item">
              <span>results</span>
            </div>
            <div className="european_view_home_nav_item">
              <span>calendar</span>
            </div>
          </div>
          <European_Buttons_Row_settings>
            <European_Button_var_settings
              icon={<Symbol sportId={"calculator_v2"} />}
            />
            <European_Button_var_settings
              icon={<Symbol sportId={"settings_v2"} />}
            />
          </European_Buttons_Row_settings>
          <Scroll>
            <SidebarTabs>
              <SidebarTab title="Prematch" count={200}>
                <SidebarItem
                  view={"european"}
                  variant={"favorite"}
                  name="favorites"
                  favCount={0}
                />
                {Array.from({ length: demoRandom() }, (_, index) => (
                  <SidebarItem
                    key={index + 1}
                    view={"european"}
                    variant={"sport"}
                    sportName={getData().sportName}
                    sportCount={index + 1}
                    sportId={getData().sportId}
                  />
                ))}

                {Array.from({ length: demoRandom() }, (_, index) => (
                  <SidebarItem
                    view={"european"}
                    variant={"country"}
                    countryName={getData().countryName}
                    eventCount={index + 1}
                    countryId={getData().countryId}
                  />
                ))}
              </SidebarTab>
              <SidebarTab title="Live">
                {Array.from({ length: demoRandom() }, (_, index) => (
                  <SidebarItem
                    key={index + 1}
                    view={"european"}
                    variant={"sport"}
                    sportName={getData().sportName}
                    sportCount={index + 1}
                    sportId={getData().sportId}
                  />
                ))}
                <div className="view_european_side_bar_item_live_legend">
                  {"Women. UTR Pro Tennis Series. Australia"}
                </div>
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="view_european_side_bar_item_live">
                    <div className="child_row_top">
                      <Symbol sportId="star_out" />
                      <div className="child_row_top_team_and_score">
                        <Text
                          customClassName="sbi_team h"
                          text={"home team name"}
                        />
                        <Text customClassName="sbi_score h" text={0} />
                        <Symbol sportId="stream" size="sm" />
                        <Text
                          customClassName="sbi_tean a"
                          text={"away team score"}
                        />
                        <Text customClassName="sbi_score a" text={0} />
                        <Text text={"3:25"} />
                      </div>
                    </div>
                    <div className="child_row_bot">
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
                ))}
              </SidebarTab>
            </SidebarTabs>
          </Scroll>

          <Scroll>
            <div className="home_page_widgets_wrapper">
              <div className="european_view_home_events_widgets_list">
                {Array.from({ length: 3 }, (_, index) => (
                  <div className="european_view_home_events_widget_root">
                    <div className="european_view_home_event_filter">
                      <span className="widget_name">{"Live events"}</span>
                      <div className="european_view_home_event_tabs_row">
                        {Array.from({ length: 5 }, (_, index) => (
                          <button
                            key={index}
                            className="european_view_home_event_tab"
                          >
                            <Symbol sportId={index} />
                          </button>
                        ))}
                      </div>
                    </div>
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

                    <div className="european_view_home_event_legend">
                      <div className="legend_item_start">{"event"}</div>
                      <div className="legend_item_center">{"time"}</div>
                      <div className="event_odds_x3">
                        <div className="odd_w">{"win1"}</div>
                        <div className="odd_w">{"draw"}</div>
                        <div className="odd_w">{"win2"}</div>
                      </div>
                      <div className="legend_item_center">{"more"}</div>
                    </div>
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
                        />
                      );
                    })}
                    <div className="european_view_home_events_widget_more">
                      <Symbol
                        customClassName="state_indicator"
                        sportId={"angle_down"}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="european_view_home_events_widgets_list">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className="european_view_home_events_widget_root"
                  >
                    <div className="european_view_home_event_filter">
                      <span className="widget_name">{"upcoming events"}</span>
                      <div className="european_view_home_event_tabs_row">
                        {Array.from({ length: 6 }, (_, index) => (
                          <button
                            key={index}
                            className="european_view_home_event_tab"
                          >
                            <Symbol sportId={index} />
                          </button>
                        ))}
                      </div>
                    </div>
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
                    <div className="european_view_home_event_legend">
                      <div className="legend_item_start">{"event"}</div>
                      <div className="legend_item_center">{"time"}</div>
                      <div className="event_odds_x3">
                        <div className="odd_w">{"win1"}</div>
                        <div className="odd_w">{"draw"}</div>
                        <div className="odd_w">{"win2"}</div>
                      </div>
                      <div className="legend_item_center">{"more"}</div>
                    </div>
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
                        />
                      );
                    })}
                    <div className="european_view_home_events_widget_more">
                      <Symbol
                        customClassName="state_indicator"
                        sportId={"angle_down"}
                      />
                    </div>
                  </div>
                ))}
                <div className="european_view_home_events_widget_root">
                  <div className="european_view_home_event_filter">
                    <span className="widget_name">{"Toto expert"}</span>
                    <div className="european_view_home_event_tabs_row">
                      {Array.from({ length: 3 }, (_, index) => (
                        <button
                          key={index}
                          className="european_view_home_event_tab"
                        >
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
                      />
                    );
                  })}
                  <div className="european_view_home_events_widget_more">
                    <Symbol
                      customClassName="state_indicator"
                      sportId={"angle_down"}
                    />
                  </div>
                </div>

                <div className="european_view_home_events_widget_root">
                  <div className="european_view_home_event_filter">
                    <span className="widget_name">
                      {"Multi bet of the day"}
                    </span>
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
          </Scroll>

          <Scroll>
            <div className="european_view_home_widgets_list">
              <div className="european_view_home_widget_root">
                <div className="european_view_home_widget_header">
                  <Text customClassName={"w_text"} text={"Bet Checker"} />
                  <Symbol sportId={"angle_down"} />
                </div>

                <div className="european_view_home_widget_content">
                  <Button
                    variant="accent"
                    className="child_btn"
                    text={"Check"}
                  />
                </div>
              </div>

              <div className="european_view_home_widget_root">
                <div className="european_view_home_widget_header">
                  <Text customClassName={"w_text"} text={"Check Better"} />
                  <Symbol sportId={"angle_down"} />
                </div>

                <div className="european_view_home_widget_content">
                  <div className="layout_2x">
                    <Input label={"ttt"} placeholder="Your Stake is .." />
                    <Input label={"ttt"} placeholder="win amount" />
                  </div>
                  <div className="action_container">
                    <Button
                      className="child_btn"
                      text={"Generate"}
                      variant="accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Scroll>
        </Root>
      </div>
    );
  }
}

export default App;
