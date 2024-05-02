import React, { useRef, useEffect, useState  } from "react";
import classNames from "classnames";
import "./index.scss";

const EuropeanView = ({ children, fullHeight, isHorizontal }) => {
  const ref = useRef(null);
  const [showShadowStart, setShowShadowStart] = useState(false);
  const [showShadowEnd, setShowShadowEnd] = useState(false);

  useEffect(() => {
    const componentRef = ref.current;

    const updateShadows = () => {
      if (!componentRef) return;

      const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = componentRef;

      if (isHorizontal) {
        setShowShadowStart(scrollLeft > 0);
        setShowShadowEnd(scrollLeft < scrollWidth - clientWidth);
      } else {
        setShowShadowStart(scrollTop > 0);
        setShowShadowEnd(scrollTop < scrollHeight - clientHeight);
      }
    };
    
    const handleWheel = (event) => {
      if (!isHorizontal) return;

      if (event.deltaY === 0) return; // No vertical scrolling detected

      // Prevent vertical scrolling
      event.preventDefault();
      // Convert vertical scroll to horizontal
      ref.current.scrollLeft += event.deltaY + event.deltaX;
    };

    if (componentRef) {
      componentRef.addEventListener('wheel', handleWheel, { passive: false });
      componentRef.addEventListener('scroll', updateShadows);
      updateShadows(); // Initial shadow check
    }

    return () => {
      if (componentRef) {
        componentRef.removeEventListener('wheel', handleWheel);
        componentRef.removeEventListener('scroll', updateShadows);
      }
    };
  }, [isHorizontal]); // Re-run effect if isHorizontal changes
  const ViewClassName = classNames({
    "view_european_scroll": true,
    [`view_european_scroll_${isHorizontal ? "x" : "y"}`]: true,
    view_european_scroll_y_full_height: fullHeight,
    'state_shadow_start': showShadowStart,
    'state_shadow_end': showShadowEnd,
  });
  return <div ref={ref} className={ViewClassName}>{children}</div>;
};

export default EuropeanView;
