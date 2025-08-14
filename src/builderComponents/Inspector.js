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

  // Shared helpers
  const setStyles = (patch) => {
    Object.entries(patch).forEach(([k, v]) => dispatch(editStyle({ key: k, value: v })));
  };
  const selectedEssence = selectedNode?.essence || "";

  // Derive current text role (no regex; exact match against closest essence)
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

  /* ─────────────────────────────
   * ICON NODE
   * ───────────────────────────── */
  if (selectedNode.type === "icon") {
    const iconOptions = [

      "sport_front_icon-1",
      "sport_front_icon-2",
      "sport_front_icon-3",
      "sport_front_icon-4",
      "sport_front_icon-5",
      "sport_front_icon-6",
      "sport_front_icon-7",
      "sport_front_icon-8",
      "sport_front_icon-9",
      "sport_front_icon-10",
      "sport_front_icon-11",
      "sport_front_icon-12",
      "sport_front_icon-13",
      "sport_front_icon-14",
      "sport_front_icon-15",
      "sport_front_icon-16",
      "sport_front_icon-17",
      "sport_front_icon-18",
      "sport_front_icon-19",
      "sport_front_icon-20",
      "sport_front_icon-21",
      "sport_front_icon-22",
      "sport_front_icon-23",
      "sport_front_icon-24",
      "sport_front_icon-25",
      "sport_front_icon-26",
      "sport_front_icon-27",
      "sport_front_icon-28",
      "sport_front_icon-29",
      "sport_front_icon-30",
      "sport_front_icon-31",
      "sport_front_icon-32",
      "sport_front_icon-33",
      "sport_front_icon-34",
      "sport_front_icon-35",
      "sport_front_icon-36",
      "sport_front_icon-37",
      "sport_front_icon-38",
      "sport_front_icon-39",
      "sport_front_icon-40",
      "sport_front_icon-41",
      "sport_front_icon-42",
      "sport_front_icon-43",
      "sport_front_icon-44",
      "sport_front_icon-45",
      "sport_front_icon-46",
      "sport_front_icon-47",
      "sport_front_icon-48",
      "sport_front_icon-49",
      "sport_front_icon-50",
      "sport_front_icon-51",
      "sport_front_icon-52",
      "sport_front_icon-53",
      "sport_front_icon-54",
      "sport_front_icon-55",
      "sport_front_icon-56",
      "sport_front_icon-57",
      "sport_front_icon-58",
      "sport_front_icon-59",
      "sport_front_icon-60",
      "sport_front_icon-61",
      "sport_front_icon-62",
      "sport_front_icon-63",
      "sport_front_icon-64",
      "sport_front_icon-65",
      "sport_front_icon-66",
      "sport_front_icon-67",
      "sport_front_icon-68",
      "sport_front_icon-69",
      "sport_front_icon-70",
      "sport_front_icon-71",
      "sport_front_icon-72",
      "sport_front_icon-73",
      "sport_front_icon-74",
      "sport_front_icon-75",
      "sport_front_icon-76",
      "sport_front_icon-77",
      "sport_front_icon-78",
      "sport_front_icon-79",
      "sport_front_icon-80",
      "sport_front_icon-81",
      "sport_front_icon-82",
      "sport_front_icon-83",
      "sport_front_icon-84",
      "sport_front_icon-85",
      "sport_front_icon-86",
      "sport_front_icon-87",
      "sport_front_icon-88",
      "sport_front_icon-89",
      "sport_front_icon-90",
      "sport_front_icon-91",
      "sport_front_icon-92",
      "sport_front_icon-93",
      "sport_front_icon-94",
      "sport_front_icon-95",
      "sport_front_icon-96",
      "sport_front_icon-97",
      "sport_front_icon-98",
      "sport_front_icon-99",
      "sport_front_icon-100",
      "sport_front_icon-101",
      "sport_front_icon-102",
      "sport_front_icon-103",
      "sport_front_icon-104",
      "sport_front_icon-105",
      "sport_front_icon-106",
      "sport_front_icon-107",
      "sport_front_icon-108",
      "sport_front_icon-109",
      "sport_front_icon-110",
      "sport_front_icon-111",
      "sport_front_icon-112",
      "sport_front_icon-113",
      "sport_front_icon-114",
      "sport_front_icon-115",
      "sport_front_icon-116",
      "sport_front_icon-117",
      "sport_front_icon-118",
      "sport_front_icon-119",
      "sport_front_icon-120",
      "sport_front_icon-121",
      "sport_front_icon-123",
      "sport_front_icon-124",
      "sport_front_icon-125",
      "sport_front_icon-arrow-down",
      "sport_front_icon-arrow-up",
      "sport_front_icon-arrow-left",
      "sport_front_icon-arrow-right",
      "sport_front_icon-star-empty",
      "sport_front_icon-star-filled",
      "sport_front_icon-check",
      "sport_front_icon-search",
      "sport_front_icon-wallet",
      "sport_front_icon-tournament",
      "sport_front_icon-sack",
      "sport_front_icon-bonus",
      "sport_front_icon-lock",



    ];

    return (
      <>
        <h4>Icon</h4>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">icon class</div>
          <select
            className="sk_bd_input"
            value={selectedNode.cn || ""}
            onChange={(e) => dispatch(editClass(e.target.value))}
          >
            {iconOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* Optional: text color via essence if your icons are font icons */}
        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">color</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            {essenceTextOptions.map((role) => (
              <Radio
                key={role}
                name="iconColorRole"
                value={role}
                label={role}
                checked={selectedTextRole === role}
                onChange={(val) => applyTxtRole(val)}
              />
            ))}
            <Radio
              name="iconColorRole"
              value=""
              label="none"
              checked={selectedTextRole === ""}
              onChange={() => applyTxtRole("")}
            />
          </div>
          {!closestEssenceName(tree, selectedPath) && (
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
              No parent essence found — set an essence on a parent layout to enable themed colors.
            </div>
          )}
        </div>
      </>
    );
  }

  /* ─────────────────────────────
   * BUTTON NODE
   * ───────────────────────────── */
  if (selectedNode.type === "button") {
    const buttonOptions = [
      "dg_btn_primary",
      "dg_btn_secondary",
      "dg_btn_outline",
      "dg_btn_text",
    ];

    return (
      <>
        <h4>Button</h4>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">button style</div>
          <select
            className="sk_bd_input"
            value={selectedNode.cn || ""}
            onChange={(e) => dispatch(editClass(e.target.value))}
          >
            {buttonOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        {/* You can keep essence-based text color if the button uses text color token */}
        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">text color</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            {essenceTextOptions.map((role) => (
              <Radio
                key={role}
                name="btnTxtColorRole"
                value={role}
                label={role}
                checked={selectedTextRole === role}
                onChange={(val) => applyTxtRole(val)}
              />
            ))}
            <Radio
              name="btnTxtColorRole"
              value=""
              label="none"
              checked={selectedTextRole === ""}
              onChange={() => applyTxtRole("")}
            />
          </div>
          {!closestEssenceName(tree, selectedPath) && (
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
              No parent essence found — set an essence on a parent layout to enable themed colors.
            </div>
          )}
        </div>
      </>
    );
  }

  /* ─────────────────────────────
   * TEXT NODE
   * ───────────────────────────── */
  if (selectedNode.type === "text") {
    const st = selectedNode.styles || {};
    const weights = ["normal", "bold", "300", "400", "500", "600", "700", "800"];
    const currentWeight = (st.fontWeight ?? "normal").toString();

    return (
      <>
        <h4>Text</h4>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">class</div>
          <ClassField valueFromStore={selectedNode.cn || ""} />
        </div>

        {/* font-size */}
        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">font-size</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            <NumberPx value={st.fontSize || ""} onChange={(v) => setStyles({ fontSize: v })} />
          </div>
        </div>

        {/* font-weight */}
        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">font-weight</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            {weights.map((w) => (
              <Radio
                key={w}
                name="fontWeight"
                value={w}
                label={w}
                checked={currentWeight === w}
                onChange={(val) => setStyles({ fontWeight: isNaN(val) ? val : Number(val) })}
              />
            ))}
          </div>
        </div>

        {/* text color by essence */}
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
                onChange={(val) => dispatch(applyEssenceTextRole(val))}
              />
            ))}
            <Radio
              name="txtColorRole"
              value=""
              label="none"
              checked={selectedTextRole === ""}
              onChange={() => dispatch(applyEssenceTextRole(""))}
            />
          </div>
          {!closestEssenceName(tree, selectedPath) && (
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
              No parent essence found — set an essence on a parent layout to enable themed colors.
            </div>
          )}
        </div>
      </>
    );
  }

  /* ─────────────────────────────
   * LAYOUT NODE (kept as before)
   * ───────────────────────────── */
  if (isLayoutNode(selectedNode)) {
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

    const setPaddingAll = (v) =>
      setStyles({ paddingTop: v, paddingRight: v, paddingBottom: v, paddingLeft: v });
    const setPaddingX = (v) => setStyles({ paddingLeft: v, paddingRight: v });
    const setPaddingY = (v) => setStyles({ paddingTop: v, paddingBottom: v });
    const setRadiusAll = (v) =>
      setStyles({
        borderTopLeftRadius: v,
        borderTopRightRadius: v,
        borderBottomRightRadius: v,
        borderBottomLeftRadius: v,
      });

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
            <Radio
              name="dir"
              value="row"
              label="row"
              checked={direction === "row"}
              onChange={(v) => setStyles({ flexDirection: v })}
            />
            <Radio
              name="dir"
              value="column"
              label="column"
              checked={direction === "column"}
              onChange={(v) => setStyles({ flexDirection: v })}
            />
          </div>
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">wrap</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            <Radio
              name="wrap"
              value="nowrap"
              label="no-wrap"
              checked={wrap === "nowrap"}
              onChange={(v) => setStyles({ flexWrap: v })}
            />
            <Radio
              name="wrap"
              value="wrap"
              label="wrap"
              checked={wrap === "wrap"}
              onChange={(v) => setStyles({ flexWrap: v })}
            />
          </div>
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">align-items</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            {["stretch", "flex-start", "center", "flex-end", "baseline"].map((opt) => (
              <Radio
                key={opt}
                name="alignItems"
                value={opt}
                label={opt}
                checked={(st.alignItems || "stretch") === opt}
                onChange={(v) => setStyles({ alignItems: v })}
              />
            ))}
          </div>
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">justify-content</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            {["flex-start", "center", "flex-end"].map((opt) => (
              <Radio
                key={opt}
                name="justifyContent"
                value={opt}
                label={opt}
                checked={(st.justifyContent || "flex-start") === opt}
                onChange={(v) => setStyles({ justifyContent: v })}
              />
            ))}
          </div>
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">h-gap</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            <NumberPx
              value={(direction === "row" ? st.columnGap : st.rowGap) || ""}
              onChange={(v) =>
                direction === "row" ? setStyles({ columnGap: v }) : setStyles({ rowGap: v })
              }
            />
          </div>

          <div className="dg_bd_layout_edit_tool_label">v-gap</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            <NumberPx
              value={(direction === "row" ? st.rowGap : st.columnGap) || ""}
              onChange={(v) =>
                direction === "row" ? setStyles({ rowGap: v }) : setStyles({ columnGap: v })
              }
            />
          </div>
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">padding</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            <label>
              All&nbsp;
              <NumberPx
                value={
                  st.paddingTop === st.paddingRight &&
                    st.paddingTop === st.paddingBottom &&
                    st.paddingTop === st.paddingLeft
                    ? st.paddingTop
                    : ""
                }
                onChange={(v) =>
                  setStyles({
                    paddingTop: v,
                    paddingRight: v,
                    paddingBottom: v,
                    paddingLeft: v,
                  })
                }
              />
            </label>
            <label>
              Horiz (X)&nbsp;
              <NumberPx
                value={st.paddingLeft === st.paddingRight ? st.paddingLeft : ""}
                onChange={(v) => setStyles({ paddingLeft: v, paddingRight: v })}
              />
            </label>
            <label>
              Vert (Y)&nbsp;
              <NumberPx
                value={st.paddingTop === st.paddingBottom ? st.paddingTop : ""}
                onChange={(v) => setStyles({ paddingTop: v, paddingBottom: v })}
              />
            </label>
          </div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            <label>
              Top&nbsp;
              <NumberPx
                value={st.paddingTop || ""}
                onChange={(v) => setStyles({ paddingTop: v })}
              />
            </label>
            <label>
              Right&nbsp;
              <NumberPx
                value={st.paddingRight || ""}
                onChange={(v) => setStyles({ paddingRight: v })}
              />
            </label>
            <label>
              Bottom&nbsp;
              <NumberPx
                value={st.paddingBottom || ""}
                onChange={(v) => setStyles({ paddingBottom: v })}
              />
            </label>
            <label>
              Left&nbsp;
              <NumberPx
                value={st.paddingLeft || ""}
                onChange={(v) => setStyles({ paddingLeft: v })}
              />
            </label>
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
                onChange={(v) =>
                  setStyles({
                    borderTopLeftRadius: v,
                    borderTopRightRadius: v,
                    borderBottomRightRadius: v,
                    borderBottomLeftRadius: v,
                  })
                }
              />
            </label>
          </div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            <label>
              TL&nbsp;
              <NumberPx
                value={st.borderTopLeftRadius || ""}
                onChange={(v) => setStyles({ borderTopLeftRadius: v })}
              />
            </label>
            <label>
              TR&nbsp;
              <NumberPx
                value={st.borderTopRightRadius || ""}
                onChange={(v) => setStyles({ borderTopRightRadius: v })}
              />
            </label>
            <label>
              BR&nbsp;
              <NumberPx
                value={st.borderBottomRightRadius || ""}
                onChange={(v) => setStyles({ borderBottomRightRadius: v })}
              />
            </label>
            <label>
              BL&nbsp;
              <NumberPx
                value={st.borderBottomLeftRadius || ""}
                onChange={(v) => setStyles({ borderBottomLeftRadius: v })}
              />
            </label>
          </div>
        </div>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">essence</div>
          <div className="dg_bd_layout_edit_tool_wrapper_variants">
            {essenceOptions.map((n) => (
              <Radio
                key={n}
                name="essence"
                value={n}
                label={n}
                checked={selectedEssence === n}
                onChange={(val) => handleEssenceChange(val)}
              />
            ))}
            <Radio
              name="essence"
              value=""
              label="none"
              checked={!selectedEssence}
              onChange={() => handleEssenceChange("")}
            />
          </div>
        </div>

        {/* Text color radios for layout *content* if desired */}
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
                onChange={(val) => dispatch(applyEssenceTextRole(val))}
              />
            ))}
            <Radio
              name="txtColorRole"
              value=""
              label="none"
              checked={selectedTextRole === ""}
              onChange={() => dispatch(applyEssenceTextRole(""))}
            />
          </div>
        </div>
      </>
    );
  }

  // Fallback (unknown type)
  return (
    <>
      <h4>Element</h4>
      <div className="dg_bd_layout_edit_tool_wrapper">
        <div className="dg_bd_layout_edit_tool_label">class</div>
        <ClassField valueFromStore={selectedNode.cn || ""} />
      </div>
    </>
  );
});
