// inspector.js — variables-first Inspector + essence picker (no state logic)

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { editStyle, setLayoutType, setEssence, setEssenceTxtVariant, editClass, selectTree, selectSelectedPath } from "./features/treeSlice";
import { PositionControl } from "./components/position";
import { PxDragInput } from "./components/DragInput";
import { setClassName } from "./features/treeSlice";
import { FLAGS_DATA, ICONS_DATA } from './features/data'

/* ---- options ---- */
const essenceOptions = ["body", "accent", "button",  "buttonSecondary",  "navbar",  "slider",  "subHeader", "dominant", "event", "eventHeader", "eventLive",
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
    const widthVal = w === "" ? undefined : Number.isNaN(+w) ? w : +w;
    dispatch(setLayoutType({ type: "fixed", width: widthVal }));
  };

  return (
    <>

<div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">className</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <input
              className="sk_bd_input"
              value={selectedNode.cn || ""}
              onChange={(e) => dispatch(editClass(e.target.value))}
            />
        </div>
        </div>

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

      {selectedNode.type === "flag" && (
        <>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <label className="dg_bd_layout_edit_tool_label">Flag Type</label>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <select
                className="sk_bd_input"
                value={selectedNode.cn || ""}
                onChange={(e) =>
                  dispatch(setClassName({ path: selectedNode, cn: e.target.value }))
                }
              >
                {
                  FLAGS_DATA.map(id => {
                    const cn = `cHFlag f${id}`;
                    return (
                      <option value={cn}>{id}</option>

                    )
                  })
                }
              </select>
            </div>
          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="dg_bd_layout_edit_tool_label">
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
            <label className="dg_bd_layout_edit_tool_label">Icon Type</label>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <select
                className="sk_bd_input"

                value={selectedNode.cn || ""}
                onChange={(e) =>
                  dispatch(setClassName({ path: selectedNode, cn: e.target.value }))
                }
              >
                {
                  ICONS_DATA.map(id => {
                    const cn = `${id}`;
                    return (
                      <option value={cn}>{id}</option>
                    )
                  })
                }
              </select>
            </div>

          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="dg_bd_layout_edit_tool_label">
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

      {selectedNode.type === "layout" && (
        <>
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

              <PxDragInput
                    value={curWidth}
                    onChange={(v) => setVarAndProp("--sk_el_custom_width", v)}
                    min={0}
                    max={1000}
                  />

            </div>

          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="dg_bd_layout_edit_tool_label">
              orientation
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
          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="dg_bd_layout_edit_tool_label">
              spacing
            </div>
            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <PxDragInput
                value={curGap}
                onChange={(v) => setVarAndProp("--sk_el_custom_gap", v)}
                min={0}
                max={64}
              />
            </div>
          </div>

          <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="dg_bd_layout_edit_tool_label">
              padding
            </div>

            <div className="dg_bd_layout_edit_tool_wrapper_variants">
              <PxDragInput
                value={curPad}
                onChange={(v) => setVarAndProp("--sk_el_custom_p", v)}
                min={0}
                max={64}
              />
            </div>
          </div>
        </>

      )}






      {/* gap → --sk_el_custom_gap */}


      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">
          radius
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <PxDragInput
            value={curRadius}
            onChange={(v) => setVarAndProp("--sk_el_custom_radius", v)}
            min={0}
            max={64}
          />
        </div>
      </div>

      <PositionControl selectedNode={selectedNode} />




    </>

  );
});
