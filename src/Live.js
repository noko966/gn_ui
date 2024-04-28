import React, { Children, useState } from "react";
import classNames from "classnames";
import {
  Scroll,
  Text,
  Symbol,
  OddsWrapper,
  Odd,
  MatchItem,
  MarketFilter,
  ScoreTeamName,
  LiveMatchEventOddSliderComponent,
  LiveMatchEventComponent,
  LiveMatchLegendComponent,
  LiveMatchHeaderComponent,
} from "../library/digi-library";

const eventFakeData = {
  hs: "1",
  ht: "home team 1",
  as: "4",
  at: "away team 1",
};

const sliderFakeData = [
  {
    result: "Result 1",
    odds: [
      { factor: "1.01", market: "p1" },
      { factor: "1.02", market: "x" },
      { factor: "1.03", market: "p2" },
    ],
  },
  {
    result: "Result 2",
    odds: [
      { factor: "2.01", market: "p1" },
      { factor: "2.02", market: "x" },
      { factor: "2.03", market: "p2" },
    ],
  },
];

const LivePage = () => {
  return (
    <div className="european_view_live_root">
      <div className="european_view_live_content_layout">
        <Scroll>
          <div className="european_view_live_list">
            {Array(6)
              .fill("")
              .map((_, index) => {
                return (
                  <div key={index}>
                    <LiveMatchHeaderComponent
                      sportId={index}
                      sportName={"sport name"}
                      eventCount={index++}
                    />
                    <LiveMatchLegendComponent leagueName="qaq" comment="tttt" />
                    <LiveMatchEventComponent
                      hs={eventFakeData.hs}
                      ht={eventFakeData.ht}
                      as={eventFakeData.as}
                      at={eventFakeData.at}
                    >
                      <LiveMatchEventOddSliderComponent
                        slides={sliderFakeData}
                      />
                    </LiveMatchEventComponent>
                  </div>
                );
              })}
          </div>
        </Scroll>
      </div>
    </div>
  );
};
export default LivePage;
