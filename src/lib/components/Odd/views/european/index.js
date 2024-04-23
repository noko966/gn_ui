import React from "react";
import cn from "classnames";
import "./index.scss";

const Odd = ({ isActive, isDisabled, factor, up, down }) => {
  const componentCn = cn({
    european_view_home_odd: true,
    state_active: isActive,
    state_disabled: isDisabled,
    sub_state_up: up,
    sub_state_down: down,
  });
  return (
    <div>
      <div className={componentCn}>{factor}</div>
    </div>

  )
}

const OddFull = ({ isActive, isDisabled, factor, up, down, market, layout = "row" }) => {
  const layoutMapping = {
    row: "of_layout_row",
    col: "of_layout_col",
  }
  const layoutClassName = layoutMapping[layout];
  const rootCn = cn({
    european_view_odd_full_wrapper: true,
    [layoutClassName]: true,
  });
  const componentCn = cn({
    european_view_odd: true,
    state_active: isActive,
    state_disabled: isDisabled,
    sub_state_up: up,
    sub_state_down: down,
  });
  return (
    <div className={rootCn}>
      <span className="of_name">{market}</span>
      <div className={componentCn}>{factor}</div>
    </div>

  )
}


const OddVariant = ({
  isActive, isDisabled, factor, up, down, market, layout, variant,
}) => {
  const Component =
    {
      compact: Odd,
      full: OddFull,
    }[variant] || Odd;

  return (
    <Component
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



export default OddVariant;
