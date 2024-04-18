import React from "react";
import cn from "classnames";
import "./index.scss";
import Odd from "../../../Odd/index";
import Text from "../../../Text/index";
import Symbol from "../../../Symbol/index";



const HomeEventRow = ({ HTN, ATN, HTSc, ATSc, HasLI, HasLC, Time, MoreCount }) => {
  const componentCn = cn({
    european_view_home_event_row: true,
  });
  return (
    <div className={componentCn}>
      <div className="team_container">
        <Text customClassName={"ev_score h"} text={HTSc} />
        <Text
          customClassName={"ev_team h"}
          text={HTN}
        />
        <Text customClassName={"ev_score a"} text={ATSc} />
        <Text
          customClassName={"ev_team a"}
          text={ATN}
        />
      </div>
      <div className="icons_container">
        {HasLI && <Symbol sportId={"stream"} />}
        {HasLC && <Symbol sportId={"info"} />}
        <Symbol sportId={"stream"} />
      </div>
      <div className="time_container">
        <Text text={Time} />
      </div>
      <div className="odds_container">
        <Odd view='european' factor={1.88} />
        <Odd view='european' factor={0.12} />
        <Odd view='european' factor={3.55} />
      </div>
      <div className="rest_container">
        <div className="european_view_home_rest">{`+${MoreCount}`}</div>
      </div>
    </div>
  )
}


const HomeEventRowExpert = ({ HTN, ATN, Bet, Time }) => {
  const componentCn = cn({
    "european_view_home_event_row variant_expert_home_event_row": true,
  });
  return (

    <div className={componentCn}>
      <div className="team_container">
        <Text
          customClassName={"ev_team h"}
          text={HTN}
        />
        <Text
          customClassName={"ev_team a"}
          text={ATN}
        />
      </div>
      <div className="time_container">
        <Text text={Time} />
      </div>
      <div className="bet_container">
        <Text
          customClassName={"ev_team a"}
          text={Bet}
        />
      </div>
      <div className="odd_container">
        <Odd view='european' factor={3.55} />
      </div>
    </div>
  )
}


const HomeEventWidgetRowVariant = ({ variant, HTN,ATN,HTSc,ATSc, HasLI, HasLC, Time, MoreCount, Bet   }) => {
  const Component =
    {
      default: HomeEventRow,
      expert: HomeEventRowExpert,
    }[variant] || HomeEventRow;

  return (
    <Component
      variant={variant}
      HTN={HTN}
      ATN={ATN}
      HTSc={HTSc}
      ATSc={ATSc}
      HasLI={HasLI}
      HasLC={HasLC}
      Time={Time}
      Bet={Bet}
      MoreCount={MoreCount}
    />
  );
};


export default HomeEventWidgetRowVariant