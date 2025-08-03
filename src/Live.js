import React, { Children, useState } from "react";
import classNames from "classnames";
import {
  Scroll,
  Collapse,
  MatchItemLive
} from "../library/digi-library";

const eventFakeData = {
  hs: "1",
  ht: "home team 1",
  as: "4",
  at: "away team 1",
};

const sliderFakeData = [
  {
    marketName: "Result 1",
    odds: [
      { factor: "1.01", market: "p1" },
      { factor: "1.02", market: "x" },
      { factor: "1.03", market: "p2" },
    ],
  },
  {
    marketName: "Result 2",
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
                    <Collapse toggler={
                      <MatchItemLive
                        variant={"header"}
                        sportId={index}
                        sportName={"sport name"}
                        eventCount={index++}
                      />
                    }>

                      <MatchItemLive variant={"legend"} leagueName="qaq" comment="tttt" />
                      <MatchItemLive variant={"event"}
                        hs={eventFakeData.hs}
                        ht={eventFakeData.ht}
                        as={eventFakeData.as}
                        at={eventFakeData.at}
                      >
                        <MatchItemLive variant={"slider"}
                          slides={sliderFakeData}
                        />
                      </MatchItemLive>
                    </Collapse>
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
