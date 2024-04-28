import React, { useEffect, useLayoutEffect, useState } from "react";
import classNames from "classnames";
import Symbol from "../../../Symbol/index.js";
import Text from "../../../Text/index.js";
import { OddsWrapper, Odd } from "../../../Odd/index.js";
import "./index.scss";
import { ScoreTeamName } from "../../../ScoreTeamName/index.js";

const LiveMatchHeaderComponent = ({ sportId, sportName, eventCount }) => {
  const BgClassName = classNames({
    sport_bg_graphics: true,
    [`sport_type_${sportId}`]: true,
  });

  return (
    <div className="european_view_live_match_header">
      <div className="layout_fill">
        <Symbol sportId={"double"} />
        <Text customClassName={"n"} text={sportName} />
      </div>
      <div className="layout_hug">
        <Text customClassName={"c"} text={`(${eventCount})`} />
        <div className={BgClassName}></div>
      </div>
    </div>
  );
};

const LiveMatchLegendComponent = ({ leagueName, comment }) => {
  return (
    <div className="european_view_live_match_legend">
      <div className="layout_fill">
        <Text customClassName={"n"} text={leagueName} />
        <Symbol sportId={"info"} />
      </div>
      <div className="layout_hug">
        <Text customClassName={"c"} text={comment} />
        <Symbol sportId={"stream"} />
      </div>
    </div>
  );
};

const LiveMatchEventComponent = ({ children, ht, at, hs, as }) => {
  const rootClassName = classNames({
    european_view_live_match_event: true,
  });

  return (
    <div className={rootClassName}>
      <div className="layout_start">
        <div className="lo_ts">
          <ScoreTeamName sc={hs} tn={ht} />
          <ScoreTeamName sc={as} tn={at} />
        </div>
      </div>
      <div className="layout_end">
        {children}
        <div className="lo_rest">
          <button className="european_view_live_match_rest">{`+${5}`}</button>
        </div>
      </div>
    </div>
  );
};

const LiveMatchEventOddSliderComponent = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const rootClassName = classNames({
    european_view_live_match_event_odd_slider_root: true,
  });

  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className={rootClassName}>
      <button className="lo_slider_control" onClick={prevSlide}>
        <Symbol sportId="angle_left" />
      </button>
      <div className="lo_slider">
        <div
          className="lo_slides_wrapper"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="european_view_live_match_event_odd_slide"
            >
              <div className="european_view_live_match_event_odd_slide_start">
                <Text text={slide.result} />
                <Symbol sportId="cashout" />
              </div>
              <OddsWrapper>
                {/* {slide.odds.map((odd, idx) => (
                  <Odd
                    key={idx}
                    variant="full"
                    factor={odd.factor}
                    market={odd.market}
                  />
                ))} */}
              </OddsWrapper>
            </div>
          ))}
        </div>
      </div>
      <button className="lo_slider_control" onClick={nextSlide}>
        <Symbol sportId="angle_right" />
      </button>
    </div>
  );
};

export {
  LiveMatchEventOddSliderComponent,
  LiveMatchEventComponent,
  LiveMatchLegendComponent,
  LiveMatchHeaderComponent,
};
