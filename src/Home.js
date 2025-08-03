import React, { useRef, useEffect } from "react";
import {
  Symbol,
  Text,
  Odd,
  OddsWrapper,
  HomeEventWidgetRow,
  Button,
  Collapse,
  HomeEventWidgetLegend,
  Tooltip,
  EventComponent,
  eventHomeComponentFakeData,
  eventFakeData,
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

const eventFilterData = [
  {
    N: "live betting",
    filters: [{ N: "now" }, { N: "coming up" }],
  },
  {
    N: "upcoming betting",
    filters: [{ N: 2 }, { N: 3 }, { N: 6 }, { N: 7 }],
  },
  {
    N: "top matches",
    filters: [{ N: 1 }, { N: 2 }, { N: 3 }, { N: 5 }, { N: 6 }, { N: 7 }],
  },
];

const translationsFakeData = {
  event: "event",
  more: "more",
  time: "time",
};

const Slider = ({ data }) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let isPaused = false;
    let cloneFirst;

    const startSliding = () => {
      if (slider && slider.children.length > 0) {
        slider.style.transition = "transform 0.5s linear";
        slider.style.transform = `translateX(-100%)`;

        cloneFirst = slider.children[0].cloneNode(true);
        slider.appendChild(cloneFirst);

        slider.addEventListener("transitionend", handleTransitionEnd);
      }
    };

    const handleTransitionEnd = () => {
      if (!isPaused) {
        slider.style.transition = "none";
        slider.style.transform = "translateX(0)";
        slider.removeChild(slider.children[0]);
        slider.removeEventListener("transitionend", handleTransitionEnd);
      }
    };

    const interval = setInterval(() => {
      if (!isPaused) {
        startSliding();
      }
    }, 2000);

    slider.addEventListener("mouseover", () => (isPaused = true));
    slider.addEventListener("mouseout", () => (isPaused = false));

    return () => {
      clearInterval(interval);
      if (slider) {
        slider.removeEventListener("transitionend", handleTransitionEnd);
      }
    };
  }, [data]);

  return (
    <div className="slider-container">
      <div className="slider" ref={sliderRef}>
        {data.map((d, index) => (
          <div className="slide" key={index}>
            <span>{`Slide ${index}`}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const sliderData = [{}, {}, {}, {}, {}, {}];

const HomePage = () => {
  return (
    <div className="home_page_widgets_wrapper">
      <Slider data={sliderData} />
      <div className="european_view_home_events_widgets_list">
        <div className="european_view_home_events_widget_root">
          <EventComponent variant="filter" data={eventFilterData[0]} />

          <Collapse
            toggler={
              <EventComponent
                variant="header"
                data={eventHomeComponentFakeData}
              />
            }
          >
            <EventComponent
              variant="thead"
              data={eventFakeData.Stakes}
              translations={translationsFakeData}
            />

            <EventComponent variant="event" data={eventFakeData} />
            <EventComponent variant="event" data={eventFakeData} />
            <EventComponent variant="event" data={eventFakeData} />
            <EventComponent variant="event" data={eventFakeData} />
            <EventComponent variant="event" data={eventFakeData} />

            <div className="european_view_home_events_widget_more">
              <Symbol
                customClassName="state_indicator"
                sportId={"angle_down"}
              />
            </div>
          </Collapse>
        </div>

        <div className="european_view_home_events_widget_root">
          <Tooltip text="this is very very extraordinary qaq">
            <EventComponent variant="filter" data={eventFilterData[1]} />
          </Tooltip>
          <Collapse
            toggler={
              <EventComponent
                variant="header"
                data={eventHomeComponentFakeData}
              />
            }
          >
            <EventComponent
              variant="thead"
              data={eventFakeData.Stakes}
              translations={translationsFakeData}
            />

            <EventComponent variant="event" data={eventFakeData} />
            <EventComponent variant="event" data={eventFakeData} />
            <EventComponent variant="event" data={eventFakeData} />

            <div className="european_view_home_events_widget_more">
              <Symbol
                customClassName="state_indicator"
                sportId={"angle_down"}
              />
            </div>
          </Collapse>
        </div>
      </div>
      <div className="european_view_home_events_widgets_list">
        <div className="european_view_home_events_widget_root">
          <EventComponent variant="filter" data={eventFilterData[2]} />
          <Collapse
            toggler={
              <EventComponent
                variant="header"
                data={eventHomeComponentFakeData}
              />
            }
          >
            <EventComponent
              variant="thead"
              data={eventFakeData.Stakes}
              translations={translationsFakeData}
            />

            <EventComponent variant="event" data={eventFakeData} />
            <EventComponent variant="event" data={eventFakeData} />
            <EventComponent variant="event" data={eventFakeData} />

            <div className="european_view_home_events_widget_more">
              <Symbol
                customClassName="state_indicator"
                sportId={"angle_down"}
              />
            </div>
          </Collapse>
        </div>
        <div className="european_view_home_events_widget_root">
          <div className="european_view_home_event_filter">
            <span className="widget_name">{"Toto expert"}</span>
            <div className="european_view_home_event_tabs_row">
              {Array.from({ length: 3 }, (_, index) => (
                <button key={index} className="european_view_home_event_tab">
                  <Symbol sportId={index} />
                </button>
              ))}
            </div>
          </div>

          <div className="european_view_home_event_expert_legend">
            <div className="legend_item_start">{"event"}</div>
            <div className="legend_item_center">{"time"}</div>
            <div className="legend_item_start">{"bet"}</div>
            <div className="legend_item_center">{"odds"}</div>
          </div>

          {EVENTS_DATA.map((d, i) => {
            return (
              <HomeEventWidgetRow
                variant={"expert"}
                key={i}
                HTN={d.HTN}
                ATN={d.ATN}
                Bet={d.Bet}
                Time={d.Time}
              >
                <div className="odds_layout">
                  <Odd factor={"1.01"} market={"p1"} />
                </div>
              </HomeEventWidgetRow>
            );
          })}
          <div className="european_view_home_events_widget_more">
            <Symbol customClassName="state_indicator" sportId={"angle_down"} />
          </div>
        </div>

        <div className="european_view_home_events_widget_root">
          <div className="european_view_home_event_filter">
            <span className="widget_name">{"Multi bet of the day"}</span>
          </div>
          <div className="view_european_multi_bet_widget_controls">
            <div className="mbw_controls">
              <button className="mbw_control_p">
                <Symbol sportId={"angle_left"} />
              </button>
              <button className="mbw_control_p">
                <Symbol sportId={"angle_right"} />
              </button>
            </div>
            <div className="mbw_name">
              <Text text={"N1"} />
            </div>
          </div>

          {EVENTS_DATA.map((d, i) => {
            return (
              <HomeEventWidgetRow
                variant={"nultiBet"}
                key={i}
                HTN={"Team name home"}
                ATN={"Team name away"}
                Bet={"Res: win 1"}
                Date={"20-04"}
                Time={"19-00"}
                Arg={"5.21"}
                EID={"12355"}
                LN={"League name"}
                sportId={1}
              />
            );
          })}
          <div className="view_european_multi_bet_widget_footer">
            <div>
              <Text text={""} />
            </div>
            <div>
              <Text text={"5.54"} />
            </div>
            <div>
              <Button
                variant="accent"
                icon={<Symbol sportId={"boost"} />}
                text={"8.45"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
