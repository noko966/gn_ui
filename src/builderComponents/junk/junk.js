{/* Justify Content */ }
<div className="dg_bd_layout_edit_tool_wrapper">
    <div className="sk_bd_input_section_lbl">justify</div>
    <div className="dg_bd_layout_edit_tool_wrapper_variants">
        {["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"].map((val) => (
            <label key={val} className="sk_bd_input_radio">
                <input
                    type="radio"
                    name="justify"
                    checked={justify === val}
                    onChange={() => setStyle("justifyContent", val)}
                />
                <i className="sk_bd_input_radio_imitator"></i>
                <span className="sk_bd_input_radio_lbl">{val}</span>
            </label>
        ))}
    </div>
</div>

{/* Align Items */ }
<div className="dg_bd_layout_edit_tool_wrapper">
    <div className="sk_bd_input_section_lbl">align</div>
    <div className="dg_bd_layout_edit_tool_wrapper_variants">
        {["stretch", "flex-start", "center", "flex-end", "baseline"].map((val) => (
            <label key={val} className="sk_bd_input_radio">
                <input
                    type="radio"
                    name="align"
                    checked={align === val}
                    onChange={() => setStyle("alignItems", val)}
                />
                <i className="sk_bd_input_radio_imitator"></i>
                <span className="sk_bd_input_radio_lbl">{val}</span>
            </label>
        ))}
    </div>
</div>


<div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">
              spacing
            </div>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">

              <div className="dg_bd_layout_edit_control">
                <span className="sk_bd_input_lbl">column gap</span>
                <PxDragInput
                  className="sk_bd_input"
                  value={parseInt(gapCol) || 0}
                  onChange={(v) => setStyle("columnGap", v)}
                  name={"columnGap"}
                  cssProp={"columnGap"}

                />
              </div>

              <div className="dg_bd_layout_edit_control">
                <span className="sk_bd_input_lbl">row gap</span>
                <PxDragInput
                  className="sk_bd_input"
                  value={parseInt(gapRow) || 0}
                  onChange={(v) => setStyle("rowGap", v)}
                  name={"rowGap"}
                  cssProp={"rowGap"}
                />
              </div>

            </div>

          </div>