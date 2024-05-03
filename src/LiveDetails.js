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

const SportImageComponent = ({ sportId }) => {
  const imageSource = `./images/backgrounds/${sportId}.webp`;
  return <img className="dg_deco_image" src={imageSource} />;
};

const EventDetailsBillboard = ({ sportId, data }) => {
  const rootClassName = classNames({
    european_view_event_details_billboard_root: true,
  });

  return (
    <div className={rootClassName}>
      <div className="european_view_event_details_billboard_table_wrapper">
        <div className="european_view_event_details_billboard_layout_start">
          <div className="billboard_layout_row">
            <Symbol sportId="angle_left" />
            <Text customClassName="lg" text="league name" />
            <Symbol sportId="info" />
          </div>
          <div className="billboard_layout_row_team">
            <Symbol sportId="issue" />
            <Text customClassName="tn" text="team name home" />
          </div>
          <div className="billboard_layout_row_team">
            <Symbol sportId="issue" />
            <Text customClassName="tn" text="team name away" />
          </div>
        </div>
        <div className="european_view_event_details_billboard_layout_end">
          <Scroll isHorizontal={true}>
            <div className="billboard_layout_row_table_wrapper">
              <div className="billboard_layout_col_table">
                <div className="billboard_layout_row_thead">
                  {data.scoresHt.map((s, i) => {
                    return (
                      <div key={i} className="td">
                        <Text text={i + 1} />
                      </div>
                    );
                  })}
                </div>
                <div className="billboard_layout_row_trow">
                  <div className="td m">
                    <Text text={10} />
                  </div>
                  {data.scoresHt.map((s, i) => {
                    return (
                      <div key={i} className="td">
                        <Text text={s} />
                      </div>
                    );
                  })}
                </div>
                <div className="billboard_layout_row_trow">
                  <div className="td m">
                    <Text text={5} />
                  </div>
                  {data.scoresAt.map((s, i) => {
                    return (
                      <div key={i} className="td">
                        <Text text={s} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Scroll>
        </div>
      </div>

      <div className="european_view_event_details_billboard_layout_filters"></div>
      <SportImageComponent sportId={sportId} />
    </div>
  );
};

const LiveDetailsPage = () => {
  return (
    <div className="european_view_live_root">
      <div className="european_view_live_content_layout">
        <Scroll>
          <div className="european_view_live_list">
            {marketComponentFakeData.map((st) => {
              return (
                <div>
                  <MarketComponent variant="header" data={st} />
                  <MarketComponent variant="stakes" data={st.Stakes} />
                </div>
              );
            })}
          </div>
        </Scroll>
      </div>
    </div>
  );
};
export default LiveDetailsPage;
