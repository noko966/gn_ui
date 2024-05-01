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
      setTooltip({ text, visible: true, bounds: { x, y, width, height } });
    }
  };

  const handleMouseOut = () => {
    // Delay the update of tooltip position to allow CSS transitions
    setTooltip((prev) => ({
      ...prev,
      visible: false,
    }));

    // setTimeout(() => {
    //   setTooltip({
    //     text: "",
    //     visible: false,
    //     bounds: { x: 0, y: 0, width: 0, height: 0 },
    //   });
    // }, 200); // Adjust the delay to match your CSS transition duration
  };

  // useEffect(() => {
  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, []);

  return (
    <span ref={ref} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {children}
    </span>
  );
};

const TooltipRoot = ({ tooltip }) => {
  const rootClassName = classNames({
    dg_tooltip_root: true,
    visible: tooltip.visible,
    hidden: !tooltip.visible,
  });

  const style = {
    "--tooltop_bounds_x": `${tooltip.bounds.x}px`,
    "--tooltop_bounds_y": `${tooltip.bounds.y}px`,
    "--tooltop_bounds_w": `${tooltip.bounds.width}px`,
    "--tooltop_bounds_h": `${tooltip.bounds.height}px`,
  };

  return (
    <div className={rootClassName} style={style}>
      <div className="dg_tooltip">{tooltip.text}</div>
    </div>
  );
};

export { Tooltip, TooltipRoot, TooltipContext, useTooltip };
