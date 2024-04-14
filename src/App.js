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
      <div className="App">
        <Root>
          <Scroll>
            <Search_European placeholder={"search here ..."} />
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

            <Text text="text" />
          </Scroll>

          <Scroll></Scroll>

          <Scroll>
            <European_Button_var_settings icon={<Symbol sportId={20} />} />
            <European_Button_var_settings icon={<Symbol sportId={10} />} />
          </Scroll>
        </Root>
      </div>
    );
  }
}

export default App;
