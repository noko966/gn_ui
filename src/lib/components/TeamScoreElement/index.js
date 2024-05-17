import React from "react";
import classNames from "classnames";
import Text from "../Text";
import "./index.scss";

const TeamScoreElement = ({ data }) => {
  const rootClassName = classNames({
    score_team_root: true,
    state_srv: data.srv,
  });
  return (
    <div className={rootClassName}>
      <Text customClassName="score_team_score" text={data.sc} />
      <Text customClassName="score_team_team" text={data.tn} />
    </div>
  );
};

export default TeamScoreElement;
