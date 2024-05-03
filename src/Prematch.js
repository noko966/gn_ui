import React from "react";
import {
  Scroll,
  Text,
  Odd,
  OddsWrapper,
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
          <div className="european_view_event_tabs_root">
            <Scroll isHorizontal={true}>
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
            </Scroll>
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
export default PrematchPage;
