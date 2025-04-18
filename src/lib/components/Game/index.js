import React from "react";
import classNames from "classnames";
import "./index.scss";

// Separate component files
const EuropeanOdd = ({ factor, isActive, isDisabled }) => {
  const oddClassName = classNames({
    dg_odd: true,
    dg_odd_state_active: isActive,
    dg_odd_state_disabled: isDisabled,
  });
  return <div className={oddClassName}>{factor}</div>;
};

const AfricanOdd = ({ factor, isActive, isDisabled }) => {
  const oddClassName = classNames({
    dg_odd_afr: true,
    dg_odd_afr_state_active: isActive,
    dg_odd_afr_state_disabled: isDisabled,
  });
  return <div className={oddClassName}>{factor}</div>;
};

const AsianOdd = ({ factor, isActive, isDisabled }) => {
  const oddClassName = classNames({
    dg_odd_as: true,
    dg_odd_as_state_active: isActive,
    dg_odd_as_state_disabled: isDisabled,
  });
  return <div className={oddClassName}>{factor}</div>;
};

const EsportOdd = ({ factor, isActive, isDisabled, variant }) => {
  const oddClassName = classNames({
    dg_odd_es: true,
    dg_odd_es_state_active: isActive,
    dg_odd_es_state_disabled: isDisabled,
    esn_odd_variant_result_p1: variant === "result_p1",
    esn_odd_variant_result_x: variant === "result_x",
    esn_odd_variant_result_p2: variant === "result_p2",
  });
  return (
    <div className={oddClassName}>
      <div className="esn_odd_inner">
        <div className="dg_odd_es_market">{"market name"}</div>
        <div className="dg_odd_es_factor">{factor}</div>
      </div>
    </div>
  );
};

// etc.

// Main component
const OddsComponent = ({ region, factor, isActive, isDisabled, variant }) => {
  const Component =
    {
      european: EuropeanOdd,
      african: AfricanOdd,
      asian: AsianOdd,
      esport: EsportOdd,
      // Add other components as needed
    }[region] || EuropeanOdd;

  return (
    <Component
      factor={factor}
      isActive={isActive}
      isDisabled={isDisabled}
      variant={variant}
    />
  );
};

export default OddsComponent;
