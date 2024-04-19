import React from "react";
import classNames from "classnames";
import "./index.scss";

import EuropeanView from "./views/european/index"

const AfricanView = ({ factor, isActive, isDisabled }) => {
  const oddClassName = classNames({
    dg_odd_afr: true,
    dg_odd_afr_state_active: isActive,
    dg_odd_afr_state_disabled: isDisabled,
  });
  return <div className={oddClassName}>{factor}</div>;
};

const AsianView = ({ factor, isActive, isDisabled }) => {
  const oddClassName = classNames({
    dg_odd_as: true,
    dg_odd_as_state_active: isActive,
    dg_odd_as_state_disabled: isDisabled,
  });
  return <div className={oddClassName}>{factor}</div>;
};

const EsportView = ({ factor, isActive, isDisabled, variant }) => {
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
const OddsComponent = ({ view, isActive, isDisabled, factor, up, down, market, layout, variant, }) => {
  const Component =
    {
      european: EuropeanView,
      african: AfricanView,
      asian: AsianView,
      esport: EsportView,
      // Add other components as needed
    }[view] || EuropeanView;

  return (
    <Component
      view={view}
      variant={variant}
      isActive={isActive}
      isDisabled={isDisabled}
      factor={factor}
      up={up}
      down={down}
      market={market}
      layout={layout}
    />
  );
};

export default OddsComponent;
