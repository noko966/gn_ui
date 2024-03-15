import React from "react";
import PropTypes from "prop-types";
import "./Event.scss";

const Event = ({ children }) => {
  return (
    <div className="dg_event">
      <i className="sport_front_icon-3"></i>
      <div className="dg_event_typography">
        <span>Basketball </span>
        <span>(325)</span>
      </div>

      <i className="sport_front_icon-3"></i>
    </div>
  );
};

Event.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Event;
