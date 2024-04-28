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


const EventDetailsBillboard = ({ sportId, data }) => {
  const rootClassName = classNames({
    european_view_event_details_billboard_root: true,
  });
  const BgClassName = classNames({
    sport_bg_graphics: true,
    [`sport_type_${sportId}`]: true,
  });
  
  return (
    <div className={rootClassName}>
      

      <div className={BgClassName}></div>
    </div>
  );
};

const LiveDetailsPage = () => {
  return (
    <div className="european_view_live_root">
      <div className="european_view_live_content_layout">
        <Scroll>
          <div className="european_view_live_list">
            <EventDetailsBillboard/>
          </div>
        </Scroll>
      </div>
    </div>
  );
};
export default LiveDetailsPage;
