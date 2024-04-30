import React, { Children, useState } from "react";
import classNames from "classnames";
import {
  Scroll,
  Collapse,
  MatchItemLive,
  Text,
  Symbol,
} from "../library/digi-library";

const eventFakeData = {
  hs: "1",
  ht: "home team 1",
  as: "4",
  at: "away team 1",
};

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
          <div className="billboard_layout_row_thead">
            <div className="td">
              <Text text="0" />
            </div>
            <div className="td">
              <Text text="1" />
            </div>
          </div>
          <div className="billboard_layout_row_trow">
            <div className="td">
              <Text text="0" />
            </div>
            <div className="td">
              <Text text="0" />
            </div>
          </div>
          <div className="billboard_layout_row_trow">
            <div className="td">
              <Text text="0" />
            </div>
            <div className="td">
              <Text text="0" />
            </div>
          </div>
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
            <EventDetailsBillboard sportId={1} />
          </div>
        </Scroll>
      </div>
    </div>
  );
};
export default LiveDetailsPage;
