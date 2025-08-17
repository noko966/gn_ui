// inspector.js — variables-first Inspector + essence picker (no state logic)

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { editStyle, setEssence, setEssenceTxtVariant, selectTree, selectSelectedPath } from "./features/treeSlice";

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


  const curTxtRole = selectedNode?.textRole || "";

  // unique radio grouping per node
  const uniq = selectedPath?.length ? selectedPath.join("_") : "root";


  const st = selectedNode.styles || {};

  const currentSize =
    st.flexGrow === 1
      ? "fill"
      : st.flexShrink === 0 && !st.width
        ? "hug"
        : "fixed";

  const setStyle = (key, value) => dispatch(editStyle({ key, value }));

  const setSize = (mode) => {
    if (mode === "fill") {
      // fill → flex-grow:1; min-width:1px; clear others
      setStyle("flexGrow", 1);
      setStyle("minWidth", "1px");
      setStyle("flexShrink", undefined);
      setStyle("width", undefined);
    } else if (mode === "hug") {
      // hug → flex-shrink:0; clear grow/minWidth/width
      setStyle("flexShrink", 0);
      setStyle("flexGrow", undefined);
      setStyle("minWidth", undefined);
      setStyle("width", undefined);
    } else {
      // fixed → flex-grow:0; flex-shrink:0; keep width (set via input)
      setStyle("flexGrow", 0);
      setStyle("flexShrink", 0);
      setStyle("minWidth", undefined);
    }
  };

  const [w, setW] = React.useState(st.width || "");
  React.useEffect(() => setW(st.width || ""), [st.width]);

  const commitWidth = () => {
    let v = (w || "").trim();
    if (v === "") {
      setStyle("width", undefined);
      return;
    }
    // allow plain number → px, or %/px strings
    if (/^\d+$/.test(v)) v = `${v}px`;
    if (!/^\d+(\.\d+)?(px|%)$/.test(v)) return; // ignore invalid input
    setSize("fixed");            // ensure fixed mode when width is set
    setStyle("width", v);        // apply width
    setW(v);                     // normalize input
  };

  return (
    <>
      {/* ============================ ESSENCE ========================== */}
      <h4>Essence</h4>
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



        {/* text → --sk_el_custom_txt (based on nearest parent essence) */}
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
        <div className="dg_bd_layout_edit_tool_wrapper_variants" style={{ gap: 8 }}>
          <label className="sk_bd_input_radio">
            <input
              type="radio"
              name="size_mode"
              checked={currentSize === "fill"}
              onChange={() => setSize("fill")}
            />
            <i className="sk_bd_input_radio_imitator"></i>
            <span className="sk_bd_input_radio_lbl">fill</span>
          </label>

          <label className="sk_bd_input_radio">
            <input
              type="radio"
              name="size_mode"
              checked={currentSize === "hug"}
              onChange={() => setSize("hug")}
            />
            <i className="sk_bd_input_radio_imitator"></i>
            <span className="sk_bd_input_radio_lbl">hug</span>
          </label>

          <label className="sk_bd_input_radio">
            <input
              type="radio"
              name="size_mode"
              checked={currentSize === "fixed"}
              onChange={() => setSize("fixed")}
            />
            <i className="sk_bd_input_radio_imitator"></i>
            <span className="sk_bd_input_radio_lbl">fixed</span>
          </label>

          {/* fixed width input */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 10 }}>
            <input
              className="sk_bd_input"
              type="text"
              value={w}
              onChange={(e) => setW(e.target.value)}
              onBlur={commitWidth}
              onKeyDown={(e) => { if (e.key === "Enter") commitWidth(); }}
              style={{ width: 120 }}
              disabled={currentSize !== "fixed"}
            />
          </span>
        </div>

        <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>
          fill → flex-grow: 1; min-width: 1px • hug → flex-shrink: 0 • fixed → width (px or %), flex-grow: 0; flex-shrink: 0
        </div>
      </div>

      {/* ============================ LAYOUT =========================== */}
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label" style={{ marginTop: 12, marginBottom: 6 }}>
          layout
        </div>

        {/* dir → --sk_el_custom_dir */}
        <div className="dg_bd_layout_edit_tool_label" style={{ fontSize: 12, opacity: 0.8 }}>
          direction → <code>--sk_el_custom_dir</code> (assigns <code>flexDirection</code>)
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
          <label className="sk_bd_input_radio">
            <input
              type="radio"
              name={`dir_${uniq}`}
              checked={curDir !== "row" && curDir !== "column"}
              onChange={() => setVarAndProp("--sk_el_custom_dir", "")}
            />
            <i className="sk_bd_input_radio_imitator"></i>
            <span className="sk_bd_input_radio_lbl">none</span>
          </label>
        </div>

        {/* gap → --sk_el_custom_gap */}
        <div className="dg_bd_layout_edit_tool_label" style={{ fontSize: 12, opacity: 0.8 }}>
          gap → <code>--sk_el_custom_gap</code> (assigns <code>gap</code>)
        </div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <NumberPx value={curGap} onChange={(v) => setVarAndProp("--sk_el_custom_gap", v)} />
          <button
            className="sk_bd_btn_small"
            onClick={() => setVarAndProp("--sk_el_custom_gap", "")}
            style={{ marginLeft: 6 }}
          >
            clear
          </button>
        </div>

        {/* padding(all) → --sk_el_custom_p */}
        <div className="dg_bd_layout_edit_tool_label" style={{ fontSize: 12, opacity: 0.8 }}>
          padding (all) → <code>--sk_el_custom_p</code> (assigns <code>padding</code>)
        </div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <NumberPx value={curPad} onChange={(v) => setVarAndProp("--sk_el_custom_p", v)} />
          <button
            className="sk_bd_btn_small"
            onClick={() => setVarAndProp("--sk_el_custom_p", "")}
            style={{ marginLeft: 6 }}
          >
            clear
          </button>
        </div>
      </div>

      {/* ============================ FORM ============================= */}
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label" style={{ marginTop: 12, marginBottom: 6 }}>
          form
        </div>

        {/* border-radius → --sk_el_custom_radius */}
        <div className="dg_bd_layout_edit_tool_label" style={{ fontSize: 12, opacity: 0.8 }}>
          border-radius → <code>--sk_el_custom_radius</code> (assigns <code>borderRadius</code>)
        </div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <NumberPx
            value={curRadius}
            onChange={(v) => setVarAndProp("--sk_el_custom_radius", v)}
          />
          <button
            className="sk_bd_btn_small"
            onClick={() => setVarAndProp("--sk_el_custom_radius", "")}
            style={{ marginLeft: 6 }}
          >
            clear
          </button>
        </div>
      </div>
    </>
  );
});
