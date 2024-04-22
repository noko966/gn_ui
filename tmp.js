<div className={rangeContainerCn}>
  <input
    defaultValue={-timeFilter}
    className="dg_range"
    type="range"
    step="1"
    onChange={onSliderChange}
    min={-rangeSliderSteps}
    max={0}
    onInput={(e) => setRangeSliderPosition(Math.abs(e.target.value))}
  />
  <div className={rangeContainerInnerCn}>
    {new Array(rangeSliderSteps)
      .fill("")
      .map((_, index) => {
        const activeCn = cn({
          disabled: rangeSliderPosition >= index + 1,
        });
        return <div key={index} className={activeCn}></div>;
      })
      .reverse()}
  </div>
</div>;

// .dg_range_wrapper {
//     position: relative;
//     flex-grow: 1;
//     max-width: calc(100% - 60px);
//     height: 24px;
//     display: flex;
//     align-items: center;
//     isolation: isolate;
//   }

//   .dg_range_wrapper,
//   .dg_range_wrapper * {
//     user-select: none;
//   }

//   .dg_range_wrapper_steps {
//     position: absolute;
//     top: 50%;
//     left: 0;
//     display: flex;
//     justify-content: stretch;
//     align-items: center;
//     width: 100%;
//     column-gap: 1px;
//     transform: translateY(-50%);
//     z-index: -1;
//   }

//   .dg_range_wrapper_steps > div {
//     flex: 1;
//     height: 2px;
//     background: var(--dominantTxt2);
//   }

//   .dg_range_wrapper_steps > div.disabled {
//     background: transparent;
//   }

//   .dg_range {
//     -webkit-appearance: none;
//     width: 100%;
//     height: 5px;
//     border-radius: 5px;
//     /*background-image: linear-gradient(90deg, var(--dominantTxt2), var(--dominantTxt2));*/
//     /*background-repeat: no-repeat;*/
//   }

//   .dg_range::-webkit-slider-thumb {
//     -webkit-appearance: none;
//     height: 17px;
//     width: 17px;
//     border-radius: 50%;
//     background: var(--dominantTxt);
//     cursor: ew-resize;
//     box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
//     transition: background 0.3s ease-in-out;
//   }

//   .dg_range::-webkit-slider-thumb:hover {
//     background: var(--accentBg);
//   }

//   .dg_range::-webkit-slider-runnable-track {
//     -webkit-appearance: none;
//     box-shadow: none;
//     border: none;
//     background: transparent;
//   }
