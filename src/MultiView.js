import React, { Children, useState } from "react";
import classNames from "classnames";
import {
  Collapse,
  MatchItemLive,
  Text,
  Symbol,
  Scroll,
  MarketComponent,
  marketComponentFakeData,
} from "../library/digi-library";


const MultiViewPage = () => {
  const oddIndexedData = marketComponentFakeData.filter(
    (_, index) => index % 2 !== 0
  );
  const evenIndexedData = marketComponentFakeData.filter(
    (_, index) => index % 2 === 0
  );

  return (
    <div className="european_view_live_root">
      <div className="european_view_live_content_layout">
        <Scroll>
          <MarketComponent variant="filter" data={oddIndexedData} />
          <div className="euv_page_lists_row">
            <div className="flex_col euv_page_list euv_page_list_50">
              {oddIndexedData.map((st) => {
                return (
                  <div>
                    <MarketComponent variant="header" data={st} />
                    <MarketComponent variant="stakes" data={st.Stakes} />
                  </div>
                );
              })}
            </div>
            <div className="euv_page_list euv_page_list_50">
              {evenIndexedData.map((st) => {
                return (
                  <div>
                    <MarketComponent variant="header" data={st} />
                    <MarketComponent variant="stakes" data={st.Stakes} />
                  </div>
                );
              })}
            </div>
          </div>
        </Scroll>
      </div>
    </div>
  );
};
export default MultiViewPage;
