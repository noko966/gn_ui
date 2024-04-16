import React from "react";
import cn from "classnames";
import "./index.scss";

const Odd = ({isActive, isDisabled, factor, up, down }) => {
    const componentCn = cn({
      european_view_home_odd: true,
      state_active: isActive,
      state_disabled: isDisabled,
      sub_state_up: up,
      sub_state_down: down,
    });
    return (
      <div className={componentCn}>{factor}</div>
    )
  }
  

  export default Odd