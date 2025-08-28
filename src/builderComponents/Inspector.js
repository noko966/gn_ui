// inspector.js — variables-first Inspector + essence picker (no state logic)

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { editStyle, setLayoutType, setScrollType, setEssence, setEssenceTxtVariant, editClass, editTextContent, selectTree, selectSelectedPath, setEqualChildrenCount, setIconClass, setFlagClass } from "./features/treeSlice";
import { PositionControl } from "./components/position";
import { PxDragInput } from "./components/DragInput";
import { FLAGS_DATA, ICONS_DATA } from './features/data'

/* ---- options ---- */
const essenceOptions = ["body", "accent", "button", "buttonSecondary", "navbar", "slider", "subHeader", "dominant", "event", "eventHeader", "eventLive",
  "odd", "oddActive", "showMore", "marketHeader", "collapse", "tab", "tabActive", "menu_1", "menu_2", "menu_3"
];
const essenceTextOptions = ["Txt", "Txt2", "Txt3", "Accent", "AccentTxt"];

/* ---- helpers ---- */
const ensurePx = (v) =>
  v === "" || v == null ? "" : /^\d+$/.test(String(v)) ? `${v}px` : String(v);
const getNum = (v) => (v ? String(v).replace(/px$/, "") : "");

/* ---- small UI atoms ---- */
const NumberPx = React.memo(function NumberPx({ value, onChange, width = 80 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <input
        className="sk_bd_input"
        type="number"
        value={getNum(value)}
        onChange={(e) => onChange(ensurePx(e.target.value))}
        style={{ width }}
      />
      px
    </span>
  );
});

/* map var → css property name (React style keys) */
const VAR_TO_PROP = {
  "--sk_el_custom_bg": "background",
  "--sk_el_custom_txt": "color",
  "--sk_el_custom_dir": "flexDirection",
  "--sk_el_custom_gap": "gap",
  "--sk_el_custom_p": "padding",
  "--sk_el_custom_radius": "borderRadius",
  "--fontSize": "fontSize",
  "--sk_el_custom_width": "width",
};

/* ================================================================== */
/*                         I N S P E C T O R                          */
/* ================================================================== */

export const Inspector = React.memo(function Inspector({ selectedNode }) {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const selectedPath = useSelector(selectSelectedPath);

  if (!selectedNode) return <em>Select a node</em>;


  // read any CSS var from the selected node (base styles only here)
  const readVar = (name) => selectedNode?.styles?.[name] ?? "";

  // write var AND assign css key to use that var(); clear key when var is empty
  const setVarAndProp = (name, value) => {
    const prop = VAR_TO_PROP[name];
    // set variable itself
    dispatch(editStyle({ key: name, value }));
    // mirror to concrete prop
    if (prop) {
      const propVal = value ? `var(${name})` : "";
      dispatch(editStyle({ key: prop, value: propVal }));
    }
  };



  // current values
  const curBgVar = readVar("--sk_el_custom_bg"); // var(--<ess>Bg)
  const curTxtVar = readVar("--sk_el_custom_txt"); // var(--<parentEss><Role>)
  const curDir = readVar("--sk_el_custom_dir"); // row|column
  const curGap = readVar("--sk_el_custom_gap"); // px
  const curPad = readVar("--sk_el_custom_p"); // px
  const curWidth = readVar("--sk_el_custom_width"); // px
  const curFlag = readVar("--flagSize"); // px
  const curIcon = readVar("--icoSize"); // px
  const curFontSize = readVar("--fontSize"); // px
  const curRadius = readVar("--sk_el_custom_radius"); // px
  const selectedEssence = selectedNode?.essence || "";
  const selectedLayoutType = selectedNode?.layoutType || "hug";
  const selectedScrollType = selectedNode?.scrollType || "";



  const curTxtRole = selectedNode?.textRole || "";

  // unique radio grouping per node
  const uniq = selectedPath?.length ? selectedPath.join("_") : "root";


  const st = selectedNode.styles || {};
  const currentDirection = st.flexDirection || "row";
  const setDirection = (value) => {
    // make sure it's flex layout (optional safety)
    if (selectedNode.styles?.display !== "flex") {
      dispatch(editStyle({ key: "display", value: "flex" }));
    }
    dispatch(editStyle({ key: "flexDirection", value }));
  };


  const direction = selectedNode.styles?.flexDirection || "row";
  const justify = selectedNode.styles?.justifyContent || "flex-start";
  const align = selectedNode.styles?.alignItems || "stretch";
  const padTop = selectedNode.styles?.paddingTop || "";
  const padRight = selectedNode.styles?.paddingRight || "";
  const padBottom = selectedNode.styles?.paddingBottom || "";
  const padLeft = selectedNode.styles?.paddingLeft || "";
  const gapRow = selectedNode.styles?.rowGap || "";
  const gapCol = selectedNode.styles?.columnGap || "";
  const width = selectedNode.styles?.width || "";
  const height = selectedNode.styles?.height || "";


  const radTL = selectedNode.styles?.borderTopLeftRadius || "";
  const radTR = selectedNode.styles?.borderTopRightRadius || "";
  const radBL = selectedNode.styles?.borderBottomLeftRadius || "";
  const radBR = selectedNode.styles?.borderBottomRightRadius || "";
  const fontSize = selectedNode.styles?.fontSize || "";
  const fontWeight = selectedNode.styles?.fontWeight || "400";

  const setStyle = (key, value) => {
    if (selectedNode.styles?.display !== "flex") {
      dispatch(editStyle({ key: "display", value: "flex" }));
    }
    dispatch(editStyle({ key, value }));
  };


  return (
    <>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">custom class</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <input
            className="sk_bd_input"
            value={selectedNode.cnUser ?? selectedNode.cn ?? ""} // shows user class or legacy cn
            onChange={(e) => dispatch(editClass(e.target.value))} // or setUserClass(...)
            placeholder="optional class"
          />
        </div>

      </div>

      {/* ============================ ESSENCE ========================== */}
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="sk_bd_input_section_lbl">node essence</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants variant_row">
          {essenceOptions.map((ess) => (
            <label key={`ess_${ess}_${uniq}`} className="sk_bd_input_radio variant_essence" style={{ "--bge": `var(--${ess}Bg)`, "--txte": `var(--${ess}Txt)` }}>
              <input
                type="radio"
                name={`ess_${uniq}`}
                checked={selectedEssence === ess}
                onChange={() => dispatch(setEssence(ess))}
              />
              <i className="sk_bd_input_radio_imitator"></i>
              <span className="sk_bd_input_radio_lbl">{ess}</span>
            </label>
          ))}
          <label className="sk_bd_input_radio variant_essence">
            <input
              type="radio"
              name={`ess_${uniq}`}
              checked={!selectedEssence}
              onChange={() => dispatch(setEssence(""))}
            />
            <i className="sk_bd_input_radio_imitator"></i>
            <span className="sk_bd_input_radio_lbl">none</span>
          </label>
        </div>
      </div>

      {/* ============================ PAINT ============================ */}
      <div className="dg_bd_layout_edit_tool_wrapper">

        <div className="sk_bd_input_section_lbl">text color</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants variant_row">
          {essenceTextOptions.map((role) => (
            <label key={`txt_${role}_${uniq}`} className="sk_bd_input_radio variant_essence" style={{ "--bge": `var(--${selectedEssence}Bg)`, "--txte": `var(--${selectedEssence}${role})` }}>
              <input
                type="radio"
                name={`paintTxt_${uniq}`}
                checked={curTxtRole === role}
                onChange={() => dispatch(setEssenceTxtVariant(role))}
              />
              <i className="sk_bd_input_radio_imitator"></i>
              <span className="sk_bd_input_radio_lbl">{role}</span>
            </label>
          ))}

          <label key={`txt_none_${uniq}`} className="sk_bd_input_radio variant_essence">
            <input
              type="radio"
              name={`paintTxt_${uniq}`}
              checked={!curTxtRole}
              onChange={() => dispatch(setEssenceTxtVariant(""))}
            />
            <i className="sk_bd_input_radio_imitator"></i>
            <span className="sk_bd_input_radio_lbl">none</span>
          </label>
        </div>
      </div>


      {selectedNode.type === "flag" && (
        <>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <label className="sk_bd_input_section_lbl">Flag Type</label>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <select
                className="sk_bd_input"
                value={selectedNode.baseCn || ""}
                onChange={(e) =>
                  dispatch(setFlagClass({ path: selectedPath, flag: e.target.value }))
                }
              >
                {
                  FLAGS_DATA.map(id => {
                    const cn = `cHFlag f${id}`;
                    return (
                      <option key={id} value={cn}>{id}</option>

                    )
                  })
                }

              </select>
            </div>
          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">
              flag size
            </div>

            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <PxDragInput
                value={curFlag}
                onChange={(v) => setVarAndProp("--flagSize", v)}
                min={0}
                max={64}
              />
            </div>
          </div>
        </>
      )}


      {selectedNode.type === "icon" && (
        <>
          <div className="dg_bd_layout_edit_tool_wrapper">
            <label className="sk_bd_input_section_lbl">Icon Type</label>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <select
                className="sk_bd_input"
                value={selectedNode.baseCn || ""}   // <- current icon class
                onChange={(e) =>
                  dispatch(setIconClass({ path: selectedPath, icon: e.target.value }))
                }
              >
                {ICONS_DATA.map(id => {
                  // const value = id.startsWith("dg_icon_") ? id : `dg_icon_${id}`;
                  const value = id;
                  const label = id.replace(/^dg_icon_/, "");
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">
              icon size
            </div>

            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <PxDragInput
                value={curIcon}
                onChange={(v) => setVarAndProp("--icoSize", v)}
                min={0}
                max={64}
              />
            </div>
          </div>
        </>
      )}


      {selectedNode.textContent && (
        <>
          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">inner text</div>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <input
                className="sk_bd_input"
                value={selectedNode.textContent || ""}
                onChange={(e) => dispatch(editTextContent(e.target.value))}
              />
            </div>
          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">
              font size
            </div>

            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <PxDragInput
                className="sk_bd_input"
                value={parseInt(fontSize) || 0}
                onChange={(v) => setStyle("fontSize", v)}
              />
            </div>
          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">
              font weight
            </div>

            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              {["400", "500", "700"].map((val) => (
                <label key={val} className="sk_bd_input_radio">
                  <input
                    type="radio"
                    name="dir"
                    checked={fontWeight === val}
                    onChange={() => setStyle("fontWeight", val)}
                  />
                  <i className="sk_bd_input_radio_imitator"></i>
                  <span className="sk_bd_input_radio_lbl">{val}</span>
                </label>
              ))}
            </div>
          </div>



        </>
      )}


      {selectedNode.type === "layout" && (
        <>
          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">size</div>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">

              <label className="sk_bd_input_radio">
                <input
                  type="radio"
                  name="size_mode"
                  checked={selectedLayoutType === "fill"}
                  onChange={() => dispatch(setLayoutType("fill"))}
                />
                <i className="sk_bd_input_radio_imitator"></i>
                <span className="sk_bd_input_radio_lbl">fill</span>
              </label>

              <label className="sk_bd_input_radio">
                <input
                  type="radio"
                  name="size_mode"
                  checked={selectedLayoutType === "hug"}
                  onChange={() => dispatch(setLayoutType("hug"))}
                />
                <i className="sk_bd_input_radio_imitator"></i>
                <span className="sk_bd_input_radio_lbl">hug</span>
              </label>

              <label className="sk_bd_input_radio">
                <input
                  type="radio"
                  name="size_mode"
                  checked={selectedLayoutType === "fixed"}
                  onChange={() => dispatch(setLayoutType("fixed"))}
                />
                <i className="sk_bd_input_radio_imitator"></i>
                <span className="sk_bd_input_radio_lbl">fixed</span>
              </label>

              <div className="dg_bd_layout_edit_control">
                <PxDragInput
                  value={parseInt(width) || 0}
                  onChange={(v) => setStyle("width", v)}
                  name={"width"}
                  cssProp={"width"}
                  min={0}
                  max={1000}
                  customQuickValues={["100px", "200px", "400px", "800px"]}
                />
              </div>
              <div className="dg_bd_layout_edit_control">
                <PxDragInput
                  value={parseInt(height) || 0}
                  onChange={(v) => setStyle("height", v)}
                  name={"height"}
                  cssProp={"height"}
                  min={0}
                  max={1000}
                  customQuickValues={["100px", "200px", "400px", "800px"]}
                />

              </div>
            </div>
          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">
              orientation
            </div>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              {["row", "column"].map((val) => (
                <label key={val} className="sk_bd_input_radio">
                  <input
                    type="radio"
                    name="dir"
                    checked={direction === val}
                    onChange={() => setStyle("flexDirection", val)}
                  />
                  <i className="sk_bd_input_radio_imitator"></i>
                  <span className="sk_bd_input_radio_lbl">{val}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Justify Content */}
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

          {/* Align Items */}
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

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">
              scroll
            </div>

            <div className="dg_bd_layout_edit_tool_wrapper_variants">

              <label className="sk_bd_input_radio">
                <input
                  type="radio"
                  name="scroll_mode"
                  checked={selectedScrollType === "horizontal"}
                  onChange={() => dispatch(setScrollType("horizontal"))}
                />
                <i className="sk_bd_input_radio_imitator"></i>
                <span className="sk_bd_input_radio_lbl">{"horizontal"}</span>
              </label>

              <label className="sk_bd_input_radio">
                <input
                  type="radio"
                  name="scroll_mode"
                  checked={selectedScrollType === "vertical"}
                  onChange={() => dispatch(setScrollType("vertical"))}
                />
                <i className="sk_bd_input_radio_imitator"></i>
                <span className="sk_bd_input_radio_lbl">{"vertical"}</span>
              </label>

              <label className="sk_bd_input_radio">
                <input
                  type="radio"
                  name="scroll_mode"
                  checked={selectedScrollType === ""}
                  onChange={() => dispatch(setScrollType(""))}
                />
                <i className="sk_bd_input_radio_imitator"></i>
                <span className="sk_bd_input_radio_lbl">{"none"}</span>
              </label>


            </div>
          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="sk_bd_input_section_lbl">padding</div>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">

              <div className="dg_bd_layout_edit_control">

                <span className="sk_bd_input_lbl">Top</span>
                <PxDragInput
                  className="sk_bd_input"
                  value={parseInt(padTop) || 0}
                  onChange={(v) => setStyle("paddingTop", v)}
                  name={"paddingTop"}
                />
              </div>

              <div className="dg_bd_layout_edit_control">

                <span className="sk_bd_input_lbl">Right</span>
                <PxDragInput
                  className="sk_bd_input"
                  value={parseInt(padRight) || 0}
                  onChange={(v) => setStyle("paddingRight", v)}
                  name={"paddingRight"}
                />
              </div>


              <div className="dg_bd_layout_edit_control">

                <span className="sk_bd_input_lbl">Bottom</span>
                <PxDragInput
                  className="sk_bd_input"
                  value={parseInt(padBottom) || 0}
                  onChange={(v) => setStyle("paddingBottom", v)}
                  name={"paddingBottom"}
                />
              </div>

              <div className="dg_bd_layout_edit_control">

                <span className="sk_bd_input_lbl">Left</span>
                <PxDragInput
                  className="sk_bd_input"
                  value={parseInt(padLeft) || 0}
                  onChange={(v) => setStyle("paddingLeft", v)}
                  name={"paddingLeft"}
                />
              </div>
            </div>
          </div>

        </>

      )}



      {/* gap → --sk_el_custom_gap */}


      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="sk_bd_input_section_lbl">radius</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">

          <div className="dg_bd_layout_edit_control">
            <span className="sk_bd_input_lbl">Top left</span>
            <PxDragInput
              className="sk_bd_input"
              value={parseInt(radTL) || 0}
              onChange={(v) => setStyle("borderTopLeftRadius", v)}
            />
          </div>

          <div className="dg_bd_layout_edit_control">
            <span className="sk_bd_input_lbl">Top right</span>
            <PxDragInput
              className="sk_bd_input"
              value={parseInt(radTR) || 0}
              onChange={(v) => setStyle("borderTopRightRadius", v)}
            />
          </div>

          <div className="dg_bd_layout_edit_control">
            <span className="sk_bd_input_lbl">Bottom left</span>
            <PxDragInput
              className="sk_bd_input"
              value={parseInt(radBL) || 0}
              onChange={(v) => setStyle("borderBottomLeftRadius", v)}
            />
          </div>

          <div className="dg_bd_layout_edit_control">
            <span className="sk_bd_input_lbl">Bottom right</span>
            <PxDragInput
              className="sk_bd_input"
              value={parseInt(radBR) || 0}
              onChange={(v) => setStyle("borderBottomRightRadius", v)}
            />
          </div>
        </div>
      </div>

      {/* <PositionControl selectedNode={selectedNode} /> */}

    </>

  );
});
