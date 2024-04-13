import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";

const Text = ({ text, customClassName, isTrimmed }) => {
  const TextCN = classNames({
    dg_text: true,
    [`${customClassName}`]: customClassName,
    dg_text_trimmed: isTrimmed,
  });
  return <span className={TextCN}>{text}</span>;
};

Text.propTypes = {
  text: PropTypes.string,
};

export default Text;
