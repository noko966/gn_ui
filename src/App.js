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
  HomeEventWidgetLegend
} from "../library/digi-library";

import HomePage from "./Home";
import PrematchPage from "./Prematch";
import LivePage from "./Live";




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
    Bet: "Some Market Name"
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
    Bet: "Some Market Name"
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
    Bet: "Some Market Name"
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

              <Link className="european_view_home_nav_item" to="/live">
                <span>live event list</span>
              </Link>

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
                  <Control onChange={() => { }} />
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
                <Route path="/live" element={<LivePage />} />
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
