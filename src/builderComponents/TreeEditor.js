import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTree,
  selectSelectedPath,
  selectHoverPath,
  selectVisualHelpers,
  selectExport,
  setSelectedPath,
  setHoverPath,
  toggleVisualHelpers,
  insertAfter,
  insertAsChild,
  removeAtPath,
  swapSiblings,
  editStyle,
  setEssence,
  applyEssenceTextRole,
  editClass,
  setGenerated,
  openCodeModal,
  closeCodeModal,
} from "./features/treeSlice";

/* palette (same as yours) */
const elementLibrary = [
  { name: "flag", el: "div", cn: "cHFlag", children: null },
  { name: "icon", el: "i", cn: "dg_icon_", children: null },
  { name: "text", el: "span", cn: "dg_text_", children: "text default" },
  { name: "action", el: "button", cn: "dg_btn", children: "btn default" },
  { name: "input", el: "input", cn: "dg_input", children: null },
  {
    name: "layout",
    type: "layout",
    el: "div",
    cn: "dg_layout",
    styles: { display: "flex", gap: "8px", minWidth: "40px", minHeight: "40px" },
    children: [],
  },
];
const essenceOptions = ["body", "accent", "dominant", "event"];
const essenceTextOptions = ["Txt", "Txt2", "Txt3", "Accent", "AccentTxt"];

/* local helpers kept from your component */
const isRoot = (p) => p.length === 0;
const getNodeAtPath = (node, path) =>
  path.length === 0 ? node : getNodeAtPath(node.children[path[0]], path.slice(1));
const isLayoutNode = (n) => n?.type === "layout";
const pathEq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

/* idx helper for export */
const idxSuffix = (node, index, isRootFlag) => {
  if (isRootFlag) return "";
  const hasUserIdx = (node.cn || "").split(" ").some((t) => /^idx_\d+$/.test(t));
  return hasUserIdx ? "" : ` idx_${index}`;
};
const skify = (cls) =>
  cls
    .trim()
    .split(/\s+/)
    .map((t) => `.sk_${t}`)
    .join("");
const camelToKebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const stylesToCssText = (obj) =>
  Object.entries(obj)
    .filter(([_, v]) => v !== "" && v != null)
    .map(([k, v]) => `${camelToKebab(k)}: ${v};`)
    .join("\n  ");

/* export builders (unchanged behavior) */
function generateHtml(node, indent = 0, index = 1, isRootFlag = true) {
  if (!node) return "";
  const tab = "  ".repeat(indent);
  const tag = node.el || "div";
  const idxCls = idxSuffix(node, index, isRootFlag);
  const classAttr = node.cn || idxCls.trim() ? ` class="sk_${(node.cn || "").trim()}${idxCls}"` : "";
  const children =
    Array.isArray(node.children) && node.children.length
      ? "\n" + node.children.map((c, i) => generateHtml(c, indent + 1, i + 1, false)).join("") + tab
      : node.children || "";
  return `${tab}<${tag}${classAttr}>${children}</${tag}>\n`;
}
function generateCss(node, map = {}, parentSel = "", index = 1, isRootFlag = true) {
  if (!node) return map;
  if (node.cn) {
    const idxCls = idxSuffix(node, index, isRootFlag).trim();
    const thisSel = (parentSel ? parentSel + " > " : "") + skify(node.cn) + (idxCls ? `.${idxCls}` : "");
    if (node.styles) {
      map[thisSel] = { ...(map[thisSel] || {}), ...node.styles };
    }
    parentSel = thisSel;
  }
  if (Array.isArray(node.children) && node.children.length) {
    node.children.forEach((c, i) => generateCss(c, map, parentSel, i + 1, false));
  }
  return map;
}

export function TreeEditor() {
  const dispatch = useDispatch();

  const tree = useSelector(selectTree);
  const selectedPath = useSelector(selectSelectedPath);
  const hoverPath = useSelector(selectHoverPath);
  const visualHelpers = useSelector(selectVisualHelpers);
  const exportState = useSelector(selectExport);

  const selectedNode = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);

  /* keyboard traversal (same logic, dispatch actions) */
  useEffect(() => {
    const onKey = (e) => {
      const isMinus = e.key === "-" || e.key === "Subtract";
      const isPlus = e.key === "+" || (e.key === "=" && e.shiftKey) || e.key === "Add";
      if (!isMinus && !isPlus) return;

      const pathIsLayout = (path) => {
        const n = getNodeAtPath(tree, path);
        return !!n && isLayoutNode(n);
      };
      const ancestorLayoutPath = (path) => {
        let p = path.slice(0, -1);
        while (p.length >= 0) {
          const n = p.length ? getNodeAtPath(tree, p) : tree;
          if (n && isLayoutNode(n)) return p;
          if (p.length === 0) break;
          p = p.slice(0, -1);
        }
        return null;
      };
      const firstChildLayoutPath = (path) => {
        const n = path.length ? getNodeAtPath(tree, path) : tree;
        if (!n || !Array.isArray(n.children)) return null;
        for (let i = 0; i < n.children.length; i++) {
          if (isLayoutNode(n.children[i])) return [...path, i];
        }
        return null;
      };

      let basePath = (hoverPath && pathIsLayout(hoverPath)) ? hoverPath : (isLayoutNode(selectedNode) ? selectedPath : []);

      if (isMinus) {
        const up = ancestorLayoutPath(basePath);
        if (up) {
          dispatch(setHoverPath(up));
          dispatch(setSelectedPath(up));
        }
        return;
      }
      if (isPlus) {
        const down = firstChildLayoutPath(basePath);
        if (down) {
          dispatch(setHoverPath(down));
          dispatch(setSelectedPath(down));
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch, hoverPath, selectedPath, selectedNode, tree]);

  useEffect(() => {
    const n = getNodeAtPath(tree, hoverPath) || tree;
    if (!isLayoutNode(n)) dispatch(setHoverPath([])); // default to root (layout)
  }, [dispatch]); // one-time like your code

  /* actions used by UI */
  const handlePaletteClick = (tpl, inside = false) => {
    const node = { ...tpl, children: tpl.children }; // same as your latest
    if (inside && isLayoutNode(selectedNode)) {
      dispatch(insertAsChild({ path: selectedPath, newNode: node }));
    } else {
      dispatch(insertAfter({ path: selectedPath, newNode: node }));
    }
  };
  const handleRemove = () => {
    if (isRoot(selectedPath)) return;
    dispatch(removeAtPath(selectedPath));
  };
  const moveNode = (dir) => {
    if (isRoot(selectedPath)) return;
    dispatch(swapSiblings({ path: selectedPath, dir }));
  };
  const handleEssenceChange = (name) => dispatch(setEssence(name));
  const applyTxtRole = (role) => dispatch(applyEssenceTextRole(role));
  const handleEditStyle = (k, v) => dispatch(editStyle({ key: k, value: v }));
  const handleEditClass = (cls) => dispatch(editClass(cls));

  function exportHTMLCSS() {
    const html = generateHtml(tree);
    const cssMap = generateCss(tree);
    const css = Object.entries(cssMap)
      .map(([cls, st]) => `${cls} {\n  ${stylesToCssText(st)}\n}`)
      .join("\n\n");
    dispatch(setGenerated({ html, css }));
    dispatch(openCodeModal());
  }

  /* derived */
  const selectedEssence = useMemo(() => selectedNode?.essence || "", [selectedNode]);
  const closestEssenceName = (path) => {
    let p = [...path];
    while (p.length >= 0) {
      const n = p.length ? getNodeAtPath(tree, p) : tree;
      if (n && n.essence) return n.essence;
      if (p.length === 0) break;
      p = p.slice(0, -1);
    }
    return "";
  };
  const selectedTextRole = useMemo(() => {
    const node = selectedNode;
    if (!node) return "";
    if (node.textRole) return node.textRole;
    const essence = closestEssenceName(selectedPath);
    const color = node.styles?.color;
    if (!essence || !color) return "";
    for (const role of essenceTextOptions) {
      if (color === `var(--${essence}${role})`) return role;
    }
    return "";
  }, [selectedNode, selectedPath, tree]);

  /* render */
  const renderNode = (node, path = []) => {
    const Tag = node.el || "div";
    const isLayout = isLayoutNode(node);
    const sel = pathEq(path, selectedPath);
    const rootSel = sel && isRoot(path);
    const hov = pathEq(path, hoverPath) && isLayout;
    const children =
      Array.isArray(node.children) && node.children.length
        ? node.children.map((c, i) => renderNode(c, [...path, i]))
        : node.children;

    return (
      <Tag
        key={path.join("-")}
        style={node.styles}
        className={
          (node.cn || "") +
          (visualHelpers && isLayout ? " state_helpers_on" : "") +
          (sel ? " state_selected_node" : "") +
          (rootSel ? " state_selected_root" : "") +
          (isLayout ? " variant_layout is_layout_clickable" : "") +
          (hov ? " state_hover_layout" : "")
        }
        onMouseEnter={(e) => {
          e.stopPropagation();
          if (isLayout) dispatch(setHoverPath(path));
        }}
        onClick={(e) => {
          e.stopPropagation();
          const hp = hoverPath;
          const n = getNodeAtPath(tree, hp);
          if (!hp || !n || !isLayoutNode(n)) return;
          dispatch(setSelectedPath(hp));
        }}
      >
        {children}
      </Tag>
    );
  };

  /* small UI bits used by Inspector */
  const ensurePx = (v) => (v === "" || v == null ? "" : /^\d+$/.test(String(v)) ? `${v}px` : v);
  const getNum = (v) => (v ? String(v).replace(/px$/, "") : "");
  const Radio = ({ name, value, checked, label, onChange }) => (
    <label className="sk_bd_input_radio">
      <input type="radio" name={name} value={value} checked={checked} onChange={(e) => onChange(e.target.value)} />
      <i className="sk_bd_input_radio_imitator"></i>
      <span className="sk_bd_input_radio_lbl">{label}</span>
    </label>
  );
  const NumberPx = ({ value, onChange, width = 64 }) => (
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

  const Inspector = () => {
    if (!selectedNode) return <em>Select a node</em>;
    if (!isLayoutNode(selectedNode)) {
      return (
        <>
          <h4>Element</h4>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>class</div>
            <input
              className="sk_bd_input"
              value={selectedNode.cn || ""}
              onChange={(e) => handleEditClass(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          {/* text color radios for non-layout nodes too */}
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
    const setStyles = (patch) => {
      Object.entries(patch).forEach(([k, v]) => dispatch(editStyle({ key: k, value: v })));
    };
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

    return (
      <>
        <h4>Layout</h4>

        <div className="dg_bd_layout_edit_tool_wrapper">
          <div className="dg_bd_layout_edit_tool_label">class</div>
          <input
            className="sk_bd_input"
            value={selectedNode.cn || ""}
            onChange={(e) => handleEditClass(e.target.value)}
            style={{ width: "100%" }}
          />
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
  };

  const PaletteItem = ({ tpl }) => {
    const Tag = tpl.el || "div";
    const selectedNode = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);
    const canHaveChildren = isLayoutNode(selectedNode);
    return (
      <div className="sk_bd_tool_item" onClick={() => handlePaletteClick(tpl, !!selectedNode && canHaveChildren)}>
        <Tag className={tpl.cn}>{tpl.children}</Tag>
      </div>
    );
  };

  const closeModal = () => dispatch(closeCodeModal());

  return (
    <div className="sk_bd_root">
      <div className="sk_bd_start_wrapper">
        <div className="sk_bd_start_wrapper_inner">
          <div className="sk_bd_tools_root">
            {elementLibrary.map((tpl) => (
              <PaletteItem key={tpl.name} tpl={tpl} />
            ))}
          </div>

          <div className="sk_bd_layout_mid">
            <div className="sk_bd_canvas_root">
              <div className="sk_bd_canvas_elements_wrapper">{renderNode(tree)}</div>
            </div>
            <div className="sk_bd_tools">
              <div className="sk_bd_tool_wrapper">
                <button className="sk_bd_btn_default" onClick={handleRemove} disabled={isRoot(selectedPath)}>
                  <i className="dg_icon_close"></i>
                </button>
              </div>
              <div className="sk_bd_tool_wrapper">
                <button className="sk_bd_btn_default" onClick={() => moveNode(-1)}>
                  <i className="dg_icon_angle_left"></i>
                </button>
              </div>
              <div className="sk_bd_tool_wrapper">
                <button className="sk_bd_btn_default" onClick={() => moveNode(1)}>
                  <i className="dg_icon_angle_right"></i>
                </button>
              </div>
              <div className="sk_bd_tool_wrapper">
                <button className="sk_bd_btn_default" onClick={() => dispatch(toggleVisualHelpers())}>
                  <i className="dg_icon_info"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sk_bd_canvas_controls">
        <div className="sk_bd_scroller">
          <Inspector />
        </div>
        <div className="sk_bd_canvas_controls_export_wrapper">
          <button className="sk_bd_btn" onClick={exportHTMLCSS}>
            Generate Code
          </button>
        </div>
      </div>

      {exportState.isOpen && (
        <div className="sk_bd_code_modal_backdrop" onClick={closeModal}>
          <div className="sk_bd_code_root" onClick={(e) => e.stopPropagation()}>
            <div className="sk_bd_code_modal_header">
              <span>export</span>
              <button className="sk_bd_code_close" onClick={closeModal}>
                ✕
              </button>
            </div>
            <pre className="sk_bd_code_wrapper">
              <div>{exportState.html}</div>
              {"\n\n"}
              <div>{exportState.css}</div>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
