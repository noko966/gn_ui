// inspector.js — variables-first Inspector + essence picker (no state logic)

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { editStyle, setLayoutType, setEssence, setEssenceTxtVariant, selectTree, selectSelectedPath } from "./features/treeSlice";

/* ---- options ---- */
const essenceOptions = ["body", "accent", "dominant", "event"];
const essenceTextOptions = ["Txt", "Txt2", "Txt3", "Accent", "AccentTxt"];

/* ---- helpers ---- */
const ensurePx = (v) =>
  v === "" || v == null ? "" : /^\d+$/.test(String(v)) ? `${v}px` : String(v);
const getNum = (v) => (v ? String(v).replace(/px$/, "") : "");

/* locate parent essence from tree/path */
const getNodeAtPath = (node, path) => {
  let n = node;
  for (let i = 0; i < path.length; i++) {
    if (!n.children || !n.children[path[i]]) return null;
    n = n.children[path[i]];
  }
  return n;
};


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
  const curRadius = readVar("--sk_el_custom_radius"); // px
  const selectedEssence = selectedNode?.essence || "";
  const selectedLayoutType = selectedNode?.layoutType || "hug";


  const curTxtRole = selectedNode?.textRole || "";

  // unique radio grouping per node
  const uniq = selectedPath?.length ? selectedPath.join("_") : "root";


  const st = selectedNode.styles || {};

  const setStyle = (key, value) => dispatch(editStyle({ key, value }));
  const initialWidth =
    (selectedNode?.styles?.width || selectedNode?.styles?.["--sk_width"] || "")
      .toString()
      .replace(/px$/, "");

  const [w, setW] = React.useState(st.width || "");
  React.useEffect(() => {
    const nw = (selectedNode?.styles?.width || selectedNode?.styles?.["--sk_width"] || "")
      .toString()
      .replace(/px$/, "");
    setW(nw);
  }, [selectedNode]);

  const commitWidth = () => {
    if (selectedLayoutType !== "fixed") return;
    // dispatch with width; the reducer will normalize to px if needed
    const widthVal = w === "" ? undefined : Number.isNaN(+w) ? w : +w;
    dispatch(setLayoutType({ type: "fixed", width: widthVal }));
  };

  return (
    <>
      {/* ============================ ESSENCE ========================== */}
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">node essence</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          {essenceOptions.map((ess) => (
            <label key={`ess_${ess}_${uniq}`} className="sk_bd_input_radio">
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
          <label className="sk_bd_input_radio">
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

        <div className="dg_bd_layout_edit_tool_label">text color</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          {essenceTextOptions.map((role) => (
            <label key={`txt_${role}_${uniq}`} className="sk_bd_input_radio">
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

          <label key={`txt_none_${uniq}`} className="sk_bd_input_radio">
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

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">size</div>
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

          <input
            className="sk_bd_input"
            type="number"
            value={w}
            onChange={(e) => setW(e.target.value)}
            onBlur={commitWidth}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitWidth();
            }}
            disabled={selectedLayoutType !== "fixed"}

          />
        </div>


      </div>

      {/* ============================ LAYOUT =========================== */}
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">
          direction
        </div>


        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <label className="sk_bd_input_radio">
            <input
              type="radio"
              name={`dir_${uniq}`}
              checked={curDir === "row"}
              onChange={() => setVarAndProp("--sk_el_custom_dir", "row")}
            />
            <i className="sk_bd_input_radio_imitator"></i>
            <span className="sk_bd_input_radio_lbl">row</span>
          </label>
          <label className="sk_bd_input_radio">
            <input
              type="radio"
              name={`dir_${uniq}`}
              checked={curDir === "column"}
              onChange={() => setVarAndProp("--sk_el_custom_dir", "column")}
            />
            <i className="sk_bd_input_radio_imitator"></i>
            <span className="sk_bd_input_radio_lbl">column</span>
          </label>
        </div>
      </div>


      {/* gap → --sk_el_custom_gap */}
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">
          spacing
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <NumberPx value={curGap} onChange={(v) => setVarAndProp("--sk_el_custom_gap", v)} />
          <button
            className="sk_bd_btn_small"
            onClick={() => setVarAndProp("--sk_el_custom_gap", "")}
          >
            clear
          </button>
        </div>
      </div>

      {/* padding(all) → --sk_el_custom_p */}
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">
          padding
        </div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <NumberPx value={curPad} onChange={(v) => setVarAndProp("--sk_el_custom_p", v)} />
          <button
            className="sk_bd_btn_small"
            onClick={() => setVarAndProp("--sk_el_custom_p", "")}
          >
            clear
          </button>
        </div>
      </div>

      {/* ============================ FORM ============================= */}
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">
          corner radius
        </div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <NumberPx
            value={curRadius}
            onChange={(v) => setVarAndProp("--sk_el_custom_radius", v)}
          />
          <button
            className="sk_bd_btn_small"
            onClick={() => setVarAndProp("--sk_el_custom_radius", "")}
          >
            clear
          </button>
        </div>
      </div>
    </>
  );
});
