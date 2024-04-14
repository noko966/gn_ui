import React, { Component } from "react";
// import "../library/global.css";
// import "../library/fonts.css";
// import "../library/flags.css";
// import "../library/variables.css";
import {
  Root,
  Symbol,
  Scroll,
  Text,
  SidebarItem,
  SidebarTabs,
  SidebarTab,
  Search_European,
  European_Button_var_settings,
  European_Buttons_Row_settings,
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
                {Array.from({ length: 10 }, (_, index) => (
                  <SidebarItem
                    key={index + 1}
                    view={"european"}
                    variant={"sport"}
                    sportName={getData().sportName}
                    sportCount={index + 1}
                    sportId={getData().sportId}
                  />
                ))}

                {Array.from({ length: 6 }, (_, index) => (
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
                {Array.from({ length: 30 }, (_, index) => (
                  <SidebarItem
                    key={index + 1}
                    view={"european"}
                    variant={"sport"}
                    sportName={getData().sportName}
                    sportCount={index + 1}
                    sportId={getData().sportId}
                  />
                ))}
              </SidebarTab>
            </SidebarTabs>
          </Scroll>

          <Scroll>
            <div className="european_view_home_events_widgets_list">
              {Array.from({ length: 10 }, (_, index) => (
                <>
                  <div className="european_view_home_events_widget_root">
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
                    {Array.from({ length: 10 }, (_, index) => (
                      <div className="european_view_home_event_row">
                        <div className="team_container">
                          <Text customClassName={"ev_score h"} text={0} />
                          <Text
                            customClassName={"ev_team h"}
                            text={"team name"}
                          />
                          <Text customClassName={"ev_score a"} text={0} />
                          <Text
                            customClassName={"ev_team a"}
                            text={"team name 2"}
                          />
                        </div>
                        <div className="icons_container">
                          <Symbol sportId={"stream"} />
                          <Symbol sportId={"info"} />
                          <Symbol sportId={"stream"} />
                        </div>
                        <div className="time_container">
                          <Text text={`${87} '`} />
                        </div>
                        <div className="odds_container">
                          <div className="european_view_home_odd">-</div>
                          <div className="european_view_home_odd">-</div>
                          <div className="european_view_home_odd">-</div>
                        </div>
                        <div className="rest_container">
                          <div className="european_view_home_rest">{`+${15}`}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ))}
            </div>
          </Scroll>

          <Scroll></Scroll>
        </Root>
      </div>
    );
  }
}

export default App;
