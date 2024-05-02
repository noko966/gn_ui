import React, { useRef, useEffect, createContext, useContext } from "react";
import classNames from "classnames";
import "./index.scss";

const TooltipContext = createContext();

const useTooltip = () => useContext(TooltipContext);

const Tooltip = ({ children, text }) => {
  const ref = useRef(null);
  const timeoutRef = useRef();
  const { setTooltip } = useTooltip();

  const handleMouseOver = () => {
    if (ref.current) {
      const { x, y, width, height } = ref.current.getBoundingClientRect();

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const space = 8;
      const tooltipSize = 100;
      const centerX = vw / 2;
      const centerY = vh / 2;

      let t = y + height + space;
      let r = vw - x - width;
      let b = vh - y + space;
      let l = x;

      let horizontalPosition = '';
      if (x + width / 2 < tooltipSize) {
        horizontalPosition = 'left';
      } else if (x + width / 2 > vw - tooltipSize) {
        horizontalPosition = 'right';
      } else {
        horizontalPosition = 'center';
        l = x + width / 2;
      }

      let verticalPosition = '';
      if (y + height / 2 < centerY) {
        verticalPosition = 'top';
      }else{
        verticalPosition = 'bottom';
      }

      // Determine vertical position

      
      
      

      setTooltip({
        text,
        visible: true,
        bounds: { l, r, t, b },
        positionClass: `${verticalPosition}-${horizontalPosition}`
      });
    }
  };

  const handleMouseOut = () => {
    // Delay the update of tooltip position to allow CSS transitions
    setTooltip((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <span ref={ref} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {children}
    </span>
  );
};

const TooltipRoot = ({ tooltip }) => {
  const rootClassName = classNames({
    dg_tooltip_root: true,
    [tooltip.positionClass]: tooltip.positionClass || "bc",
    visible: tooltip.visible,
    hidden: !tooltip.visible,
    [tooltip.positionClass]: tooltip.positionClass
  });

  const style = {
    // "--tooltop_bounds_x": `${tooltip.bounds.x}px`,
    // "--tooltop_bounds_y": `${tooltip.bounds.y}px`,
    // "--tooltop_bounds_w": `${tooltip.bounds.width}px`,
    // "--tooltop_bounds_h": `${tooltip.bounds.height}px`,

    "--tooltip_left": `${tooltip.bounds.l}px`,
    "--tooltip_right": `${tooltip.bounds.r}px`,
    "--tooltip_top": `${tooltip.bounds.t}px`,
    "--tooltip_bot": `${tooltip.bounds.b}px`,

  };

  return (
    <div className={rootClassName} style={style}>
      <div className="dg_tooltip">{tooltip.text}</div>
    </div>
  );
};

export { Tooltip, TooltipRoot, TooltipContext, useTooltip };
