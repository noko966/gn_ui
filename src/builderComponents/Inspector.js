import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  editStyle,
  setEssence,
  applyEssenceTextRole,
  editClass,
  selectTree,
  selectSelectedPath,
} from "./features/treeSlice";

/* ---- local constants (mirror your parent) ---- */
const essenceOptions = ["body", "accent", "dominant", "event"];
const essenceTextOptions = ["Txt", "Txt2", "Txt3", "Accent", "AccentTxt"];

/* ---- tiny helpers (same behavior as in parent) ---- */
const isLayoutNode = (n) => n?.type === "layout";
const ensurePx = (v) => (v === "" || v == null ? "" : /^\d+$/.test(String(v)) ? `${v}px` : v);
const getNum = (v) => (v ? String(v).replace(/px$/, "") : "");

/* Find node by path */
const getNodeAtPath = (node, path) => {
  let n = node;
  for (let i = 0; i < path.length; i++) {
    if (!n.children || !n.children[path[i]]) return null;
    n = n.children[path[i]];
  }
  return n;
};

/* Closest essence lookup */
const closestEssenceName = (root, path) => {
  let p = [...path];
  while (p.length >= 0) {
    const n = p.length ? getNodeAtPath(root, p) : root;
    if (n && n.essence) return n.essence;
    if (p.length === 0) break;
    p = p.slice(0, -1);
  }
  return "";
};

/* --- UI atoms --- */
const Radio = React.memo(function Radio({ name, value, checked, label, onChange }) {
  return (
    <label className="sk_bd_input_radio">
      <input type="radio" name={name} value={value} checked={checked} onChange={(e) => onChange(e.target.value)} />
      <i className="sk_bd_input_radio_imitator"></i>
      <span className="sk_bd_input_radio_lbl">{label}</span>
    </label>
  );
});

const NumberPx = React.memo(function NumberPx({ value, onChange, width = 64 }) {
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

/* --- Class input with local buffer so focus/caret are stable --- */
const ClassField = React.memo(function ClassField({ valueFromStore }) {
  const dispatch = useDispatch();
  const [val, setVal] = React.useState(valueFromStore || "");

  React.useEffect(() => {
    setVal(valueFromStore || "");
  }, [valueFromStore]);

  const commit = React.useCallback(() => {
    dispatch(editClass(val));
  }, [dispatch, val]);

  return (
    <input
      className="sk_bd_input"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur(); // triggers onBlur → commit
      }}
      style={{ width: "100%" }}
    />
  );
});

/* --------- Inspector (memoized) --------- */
export const Inspector = React.memo(function Inspector({ selectedNode }) {
  const dispatch = useDispatch();
  const tree = useSelector(selectTree);
  const selectedPath = useSelector(selectSelectedPath, shallowEqual);

  if (!selectedNode) return <em>Select a node</em>;

  // text role derivation (same logic you had)
  const selectedTextRole = React.useMemo(() => {
    const node = selectedNode;
    if (!node) return "";
    if (node.textRole) return node.textRole;
    const essence = closestEssenceName(tree, selectedPath);
    const color = node.styles?.color;
    if (!essence || !color) return "";
    for (const role of essenceTextOptions) {
      if (color === `var(--${essence}${role})`) return role;
    }
    return "";
  }, [selectedNode, tree, selectedPath]);

  const applyTxtRole = (role) => dispatch(applyEssenceTextRole(role));
  const handleEssenceChange = (name) => dispatch(setEssence(name));
  const setStyles = (patch) => {
    Object.entries(patch).forEach(([k, v]) => dispatch(editStyle({ key: k, value: v })));
  };

  if (!isLayoutNode(selectedNode)) {
    return (
      <>
        <h4>Element</h4>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>class</div>
          <ClassField valueFromStore={selectedNode.cn || ""} />
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">text color</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            {essenceTextOptions.map((role) => (
              <Radio
                key={role}
                name="txtColorRole"
                value={role}
                label={role}
                checked={selectedTextRole === role}
                onChange={(val) => applyTxtRole(val)}
              />
            ))}
            <Radio
              name="txtColorRole"
              value=""
              label="none"
              checked={selectedTextRole === ""}
              onChange={() => applyTxtRole("")}
            />
          </div>
        </div>
      </>
    );
  }

  const st = selectedNode.styles || {};
  const direction = st.flexDirection || "row";
  const wrap = st.flexWrap || "nowrap";
  const size = st.flexGrow === 1 ? "fill" : st.flexShrink === 0 ? "hug" : "fixed";

  const setSize = (v) => {
    if (v === "fill") {
      setStyles({ flexGrow: 1, minWidth: "1px" });
      setStyles({ flexShrink: undefined });
    } else if (v === "hug") {
      setStyles({ flexShrink: 0 });
      setStyles({ flexGrow: undefined, minWidth: undefined });
    } else {
      setStyles({ flexGrow: undefined, flexShrink: undefined, minWidth: undefined });
    }
  };
  const setPaddingAll = (v) => setStyles({ paddingTop: v, paddingRight: v, paddingBottom: v, paddingLeft: v });
  const setPaddingX = (v) => setStyles({ paddingLeft: v, paddingRight: v });
  const setPaddingY = (v) => setStyles({ paddingTop: v, paddingBottom: v });
  const setRadiusAll = (v) =>
    setStyles({
      borderTopLeftRadius: v,
      borderTopRightRadius: v,
      borderBottomRightRadius: v,
      borderBottomLeftRadius: v,
    });

  const selectedEssence = selectedNode?.essence || "";

  return (
    <>
      <h4>Layout</h4>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">class</div>
        <ClassField valueFromStore={selectedNode.cn || ""} />
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper ">
        <div className="dg_bd_layout_edit_tool_label">size</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <Radio name="size" value="fill" checked={size === "fill"} label="fill" onChange={setSize} />
          <Radio name="size" value="hug" checked={size === "hug"} label="hug" onChange={setSize} />
          <Radio name="size" value="fixed" checked={size === "fixed"} label="fixed" onChange={setSize} />
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">direction</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <Radio name="dir" value="row" label="row" checked={direction === "row"} onChange={(v) => setStyles({ flexDirection: v })} />
          <Radio name="dir" value="column" label="column" checked={direction === "column"} onChange={(v) => setStyles({ flexDirection: v })} />
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">wrap</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <Radio name="wrap" value="nowrap" label="no-wrap" checked={wrap === "nowrap"} onChange={(v) => setStyles({ flexWrap: v })} />
          <Radio name="wrap" value="wrap" label="wrap" checked={wrap === "wrap"} onChange={(v) => setStyles({ flexWrap: v })} />
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">align-items</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          {["stretch", "flex-start", "center", "flex-end", "baseline"].map((opt) => (
            <Radio key={opt} name="alignItems" value={opt} label={opt} checked={(st.alignItems || "stretch") === opt} onChange={(v) => setStyles({ alignItems: v })} />
          ))}
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">justify-content</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          {["flex-start", "center", "flex-end"].map((opt) => (
            <Radio key={opt} name="justifyContent" value={opt} label={opt} checked={(st.justifyContent || "flex-start") === opt} onChange={(v) => setStyles({ justifyContent: v })} />
          ))}
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">h-gap</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <NumberPx
            value={(direction === "row" ? st.columnGap : st.rowGap) || ""}
            onChange={(v) => (direction === "row" ? setStyles({ columnGap: v }) : setStyles({ rowGap: v }))}
          />
        </div>

        <div className="dg_bd_layout_edit_tool_label">v-gap</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <NumberPx
            value={(direction === "row" ? st.rowGap : st.columnGap) || ""}
            onChange={(v) => (direction === "row" ? setStyles({ rowGap: v }) : setStyles({ columnGap: v }))}
          />
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">padding</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <label>
            All&nbsp;
            <NumberPx
              value={st.paddingTop === st.paddingRight && st.paddingTop === st.paddingBottom && st.paddingTop === st.paddingLeft ? st.paddingTop : ""}
              onChange={setPaddingAll}
            />
          </label>
          <label>Horiz (X)&nbsp;<NumberPx value={st.paddingLeft === st.paddingRight ? st.paddingLeft : ""} onChange={setPaddingX} /></label>
          <label>Vert (Y)&nbsp;<NumberPx value={st.paddingTop === st.paddingBottom ? st.paddingTop : ""} onChange={setPaddingY} /></label>
        </div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <label>Top&nbsp;<NumberPx value={st.paddingTop || ""} onChange={(v) => setStyles({ paddingTop: v })} /></label>
          <label>Right&nbsp;<NumberPx value={st.paddingRight || ""} onChange={(v) => setStyles({ paddingRight: v })} /></label>
          <label>Bottom&nbsp;<NumberPx value={st.paddingBottom || ""} onChange={(v) => setStyles({ paddingBottom: v })} /></label>
          <label>Left&nbsp;<NumberPx value={st.paddingLeft || ""} onChange={(v) => setStyles({ paddingLeft: v })} /></label>
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">border-radius</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <label>
            All&nbsp;
            <NumberPx
              value={
                st.borderTopLeftRadius === st.borderTopRightRadius &&
                st.borderTopLeftRadius === st.borderBottomRightRadius &&
                st.borderTopLeftRadius === st.borderBottomLeftRadius
                  ? st.borderTopLeftRadius
                  : ""
              }
              onChange={setRadiusAll}
            />
          </label>
        </div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          <label>TL&nbsp;<NumberPx value={st.borderTopLeftRadius || ""} onChange={(v) => setStyles({ borderTopLeftRadius: v })} /></label>
          <label>TR&nbsp;<NumberPx value={st.borderTopRightRadius || ""} onChange={(v) => setStyles({ borderTopRightRadius: v })} /></label>
          <label>BR&nbsp;<NumberPx value={st.borderBottomRightRadius || ""} onChange={(v) => setStyles({ borderBottomRightRadius: v })} /></label>
          <label>BL&nbsp;<NumberPx value={st.borderBottomLeftRadius || ""} onChange={(v) => setStyles({ borderBottomLeftRadius: v })} /></label>
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">essence</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          {essenceOptions.map((n) => (
            <Radio key={n} name="essence" value={n} label={n} checked={selectedEssence === n} onChange={(val) => handleEssenceChange(val)} />
          ))}
          <Radio name="essence" value="" label="none" checked={!selectedEssence} onChange={() => handleEssenceChange("")} />
        </div>
      </div>

      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">text color</div>
        <div className="dg_bd_layout_edit_tool_wrapper_variants">
          {essenceTextOptions.map((role) => (
            <Radio key={role} name="txtColorRole" value={role} label={role} checked={selectedTextRole === role} onChange={(val) => applyTxtRole(val)} />
          ))}
          <Radio name="txtColorRole" value="" label="none" checked={selectedTextRole === ""} onChange={() => applyTxtRole("")} />
        </div>
      </div>
    </>
  );
});
