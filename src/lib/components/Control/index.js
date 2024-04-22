import React, { useState, useRef } from "react";

import classNames from "classnames";
import Text from "../Text/index";
import "./index.scss";

const controlVariantMapping = {
  normal: "variant_normal",
  accent: "variant_2",
};
const Control = ({ isDisabled, className, variant = "normal" }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const sliderEl = useRef(null);
  const handleSliderChange = (event) => {
    const tempSliderValue = event.target.value;
    setSliderValue(tempSliderValue);

    const progress = (tempSliderValue / event.target.max) * 100;
    sliderEl.current.style.background = `linear-gradient(to right, var(--accentBg) ${progress}%, var(--dominantBg) ${progress}%)`;
  };

  const variantClassName = controlVariantMapping[variant];

  const ControlClassName = classNames({
    european_view_range_slider_root: true,
    state_disabled: isDisabled,
    [variantClassName]: true,
    [className]: className,
  });

  return (
    <div className={ControlClassName}>
      <div className="rs_layout">
        <div className="rs_layout_text">
          <Text customClassName="rs_val" text={sliderValue} />
          <Text customClassName="rs_txt" text={"games"} />
        </div>
        <div className="european_view_range_slider_wrapper">
          <input
            type="range"
            value={sliderValue}
            onChange={handleSliderChange}
            style={{ width: "100%" }}
            ref={sliderEl}
            min="0"
            max="7"
          />
          <div class="rs_sliderticks">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Control };
