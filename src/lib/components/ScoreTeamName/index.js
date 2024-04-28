import React from "react";
import classNames from "classnames";
import Text from "../Text";
import "./index.scss";

const ScoreTeamComponent = ({ sc, tn, srv }) => {
  const rootClassName = classNames({
    score_team_root: true,
    state_srv: srv,
  });
  return (
    <div className={rootClassName}>
      <Text customClassName="score_team_score" text={sc} />
      <Text customClassName="score_team_team" text={tn} />
    </div>
  );
};

export default ScoreTeamComponent;
