import React, { useContext, useState, Component, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
  OddsWrapper,
  Radio,
  HomeEventWidgetRow,
  Button,
  Control,
  Favorite,
  MatchItem,
  StateWrapper,
  Content,
  Collapse,
  MarketFilter,
} from "../library/digi-library";

const PrematchPage = () => {
  return (
    <div className="european_view_prematch_root">
      <MarketFilter id={1} name="name heading" info={false} />
      <div className="european_view_prematch_content_layout">
        <Scroll>
          <div className="european_view_prematch_list">
            {Array.from({ length: 10 }, (_, index) => (
              <MatchItem
                key={index}
                variant="game"
                ht={"team name one"}
                at={"team name two"}
                id={"1254788"}
                date={"24.03"}
                time={"12:30"}
                more={"40"}
              >
                {
                  <OddsWrapper>
                    <Odd variant="full" factor={"1.01"} market={"p1"} />
                    <Odd variant="full" factor={"1.01"} market={"x"} />
                    <Odd variant="full" factor={"1.01"} market={"p2"} />
                  </OddsWrapper>
                }
              </MatchItem>
            ))}
          </div>
        </Scroll>
        <Scroll>
          <MatchItem
            variant="marketsHeader"
            ht={"home team name"}
            at={"away team name"}
            date={"12.04"}
            time={"15:44"}
          />
          <div className="european_view_event_tabs_root view_european_scroll_x">
            <div className="european_view_event_tabs_wrapper">
              <button className="european_view_event_tab state_selected">
                <i />
                <Text text="main" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="handicaps" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="totals" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="1st quorter" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="2nd quorter" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="3rd quorter" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="3rd quorter" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="3rd quorter" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="3rd quorter" />
              </button>
              <button className="european_view_event_tab">
                <i />
                <Text text="3rd quorter" />
              </button>
            </div>
          </div>

          <div className="european_view_prematch_list">
            {Array.from({ length: 16 }, (_, index) => (
              <MatchItem
                hasCashout={true}
                key={index}
                variant="market"
                mn={"market name"}
              >
                {
                  <OddsWrapper>
                    {Array.from(
                      { length: Math.floor(Math.random() * 6) + 1 },
                      (_, index) => (
                        <Odd
                          key={index}
                          variant="full"
                          factor="1.01"
                          market={`market name ${index}`}
                        />
                      )
                    )}
                  </OddsWrapper>
                }
              </MatchItem>
            ))}
          </div>
        </Scroll>
      </div>
    </div>
  );
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
            <div>
              <div className="european_view_home_event_legend">
                <div className="legend_item_start">{"event"}</div>
                <div className="legend_item_center">{"time"}</div>

                <div className="eu_ew_l_odds_container odds_layout odds_layout_3">
                  <div className={"odd_w"}>{"p1"}</div>
                  <div className={"odd_w"}>{"x"}</div>
                  <div className={"odd_w"}>{"p2"}</div>
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
            </div>
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
              <span className="widget_name">{"Live events"}</span>
              <div className="european_view_home_event_tabs_row">
                <button className="european_view_home_event_tab state_active">
                  <Symbol sportId={1} />
                </button>
                <button className="european_view_home_event_tab">
                  <Symbol sportId={5} />
                </button>
              </div>
            </div>
            <div className="european_view_home_event_header">
              <Symbol sportId={"angle_up"} />
              <div>
                <Text customClassName={"ev_name"} text={getData().sportName} />
                <Text customClassName={"ev_count"} text={getData().sportId} />
              </div>
              <Symbol sportId={index + 1} />
            </div>

            <div className="european_view_home_event_legend">
              <div className="legend_item_start">{"event"}</div>
              <div className="legend_item_center">{"time"}</div>

              {
                <div className="odds_layout odds_layout_3">
                  <div className={"odd_w"}>{"p1"}</div>
                  <div className={"odd_w"}>{"x"}</div>
                  <div className={"odd_w"}>{"p2"}</div>
                </div>
              }
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
          </div>
        ))}
      </div>
      <div className="european_view_home_events_widgets_list">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="european_view_home_events_widget_root">
            <div className="european_view_home_event_filter">
              <span className="widget_name">{"upcoming events"}</span>
              <div className="european_view_home_event_tabs_row">
                {Array.from({ length: 6 }, (_, index) => (
                  <button key={index} className="european_view_home_event_tab">
                    <Symbol sportId={index} />
                  </button>
                ))}
              </div>
            </div>
            <div className="european_view_home_event_header">
              <Symbol sportId={"angle_up"} />
              <div>
                <Text customClassName={"ev_name"} text={getData().sportName} />
                <Text customClassName={"ev_count"} text={getData().sportId} />
              </div>
              <Symbol sportId={index + 1} />
            </div>
            <div className="european_view_home_event_legend">
              <div className="legend_item_start">{"event"}</div>
              <div className="legend_item_center">{"time"}</div>
              <div className="odds_layout odds_layout_2">
                <div className={"odd_w"}>{"p1"}</div>
                <div className={"odd_w"}>{"p2"}</div>
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
                >
                  {
                    <div className="odds_layout odds_layout_2">
                      <Odd factor={"1.01"} market={"p1"} />
                      <Odd factor={"1.01"} market={"p2"} />
                    </div>
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
      <BrowserRouter>
        <div style={{ height: "100svh" }} className="App">
          <Root>
            <Search_European placeholder={"search here ..."} />
            <div className="european_view_home_nav_row">
              <Link className="european_view_home_nav_item" to="/">
                <span>home</span>
              </Link>
              <Link className="european_view_home_nav_item" to="/line">
                <span>line event list</span>
              </Link>

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
                  <Control onChange={() => {}} />
                  <SidebarItem
                    view={"european"}
                    variant={"favorite"}
                    name="favorites"
                    count={0}
                  />
                  <SidebarItem
                    view={"european"}
                    variant={"league"}
                    name="league name"
                  />
                  <SidebarItem
                    view={"european"}
                    variant={"league"}
                    name="league name"
                  />
                  <SidebarItem
                    view={"european"}
                    variant={"league"}
                    name="league name"
                  />
                  {Array.from({ length: 3 }, (_, index) => (
                    <SidebarItem
                      view={"european"}
                      variant={"sport"}
                      name={"sport name"}
                      sportId={index + 1}
                      count={"1"}
                    />
                  ))}

                  <SidebarItem
                    view={"european"}
                    variant={"country"}
                    name="country name"
                  />
                  <SidebarItem
                    view={"european"}
                    variant={"league"}
                    name="league name"
                  />
                </SidebarTab>
                <SidebarTab title="Live">
                  {Array.from({ length: demoRandom() }, (_, index) => (
                    <SidebarItem
                      key={index + 1}
                      view={"european"}
                      variant={"sport"}
                      name={getData().sportName}
                      count={index + 1}
                      id={getData().sportId}
                    />
                  ))}
                  <div className="view_european_side_bar_item_live_legend">
                    {"Women. UTR Pro Tennis Series. Australia"}
                  </div>
                  {Array.from({ length: 5 }, (_, index) => (
                    <SidebarItem
                      key={index}
                      variant="live"
                      ht="team one"
                      at="team one"
                      hs="1"
                      as="10"
                      time="12-50"
                      HasLI={true}
                    />
                  ))}
                  <div className="view_european_side_bar_item_odds_root">
                    <div className="sbo_layout">
                      <Odd
                        variant="full"
                        layout="col"
                        factor={"1.01"}
                        market={"p1"}
                      />
                      <Odd
                        variant="full"
                        layout="col"
                        factor={"1.01"}
                        market={"x"}
                      />
                      <Odd
                        variant="full"
                        layout="col"
                        factor={"1.01"}
                        market={"p2"}
                      />
                    </div>
                  </div>
                </SidebarTab>
              </SidebarTabs>
            </Scroll>

            <Scroll>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/line" element={<PrematchPage />} />
              </Routes>
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
                      <Radio label="other" name="w11" />
                      <Radio label="sport tournament" name="w11" />
                    </div>
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
      </BrowserRouter>
    );
  }
}

export default App;
