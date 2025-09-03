import React, {useEffect, useRef} from "react";

export const HScrollRow = ({ className = "", children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e) => {
      const mainlyVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);

      if (mainlyVertical) {
        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth;

        el.scrollLeft += e.deltaY * 0.5;

        // prevent parent scroll if we actually moved
        if (!(atStart && e.deltaY < 0) && !(atEnd && e.deltaY > 0)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    // IMPORTANT: passive: false lets preventDefault() work
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`dg_bd_layout_edit_tool_wrapper_variants variant_row ${className}`}
    >
      {children}
    </div>
  );
};

