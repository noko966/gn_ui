import React, { useMemo, useEffect } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDispatch, useSelector } from "react-redux";
import ReactClipboard from 'react-clipboardjs-copy';
import {
  selectTree,
  selectSelectedPath,
  selectHoverPath,
  selectVisualHelpers,
  selectExport,
  setSelectedPath,
  selectActiveNode,
  setHoverPath,
  toggleVisualHelpers,
  insertAfter,
  insertAsChild,
  removeAtPath,
  swapSiblings,
  editStyle,
  setEssence,
  setEssenceTxtVariant,
  editClass,
  setGenerated,
  openCodeModal,
  closeCodeModal,
  setUIState,
  selectUIStates,
  STATE_MAP,
} from "./features/treeSlice";
import { Inspector } from "./Inspector"; // ← NEW

/* palette etc… keep as-is */
const elementLibrary = [
  { name: "flag", type: "flag", styles: { '--flagSize': "24px" }, el: "div", cn: "cHFlag", children: null },
  { name: "icon", type: "icon", styles: { '--icoSize': "24px" }, el: "i", cn: "dg_icon_", children: null },
  { name: "text", type: "text", styles: { '--fontSize': "13px" }, el: "span", cn: "dg_text_", textContent: "lorem ipsum", children: null },
  { name: "action", type: "button", el: "button", cn: "dg_btn", children: null, textContent: "btn default" },
  { name: "input", type: "input", el: "input", cn: "dg_input", children: null },
  {
    name: "layout",
    type: "layout",
    el: "div",
    cn: "dg_layout",
    styles: { display: "flex", gap: "8px", minWidth: "20px", minHeight: "20px" },
    children: [],
  },
  {
    name: "layoutEqual",
    type: "layout_equal",
    el: "div",
    cn: "dg_layout_equal",
    // parent defaults (you can tweak)
    styles: {
      display: "flex",
      flexWrap: "wrap",
      columnGap: "var(--sk_el_custom_gap)",
      rowGap: "var(--sk_el_custom_gap)",
      minHeight: "20px",
      minWidth: "20px",
    },
    // seed children count (used at insert time)
    equalCount: 4
  }

];



const isRoot = (p) => p.length === 0;
const getNodeAtPath = (node, path) =>
  path.length === 0 ? node : getNodeAtPath(node.children[path[0]], path.slice(1));
const isLayoutNode = (n) => n?.type === "layout";
const pathEq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

const idxSuffix = (node, index, isRootFlag) => {
  if (isRootFlag) return "";
  const hasUserIdx = (node.cn || "").split(" ").some((t) => /^idx_\d+$/.test(t));
  return hasUserIdx ? "" : ` idx_${index}`;
};
const skify = (cls) =>
  cls
    .trim()
    .split(/\s+/)
    // .map((t) => `.sk_${t}`)
    .map((t) => `.${t}`)
    .join("");
const camelToKebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const stylesToCssText = (obj) =>
  Object.entries(obj)
    .filter(([_, v]) => v !== "" && v != null)
    .map(([k, v]) => `${camelToKebab(k)}: ${v};`)
    .join("\n  ");


function generateHtml(node, indent = 0, index = 1, isRootFlag = true) {
  if (!node) return "";
  const tab = "  ".repeat(indent);
  const tag = node.el || "div";
  const isInput = tag.toLowerCase() === "input";

  const idxCls = idxSuffix(node, index, isRootFlag);
  const classAttr =
    node.cn || idxCls.trim() ? ` class="${(node.cn || "").trim()}${idxCls}"` : "";

  if (isInput) {
    const attrs = [
      classAttr.trim(),
      `placeholder="${node.textContent}"`,
    ].join("");
    return `${tab}<input${attrs ? " " + attrs.trim() : ""} />\n`;
  }

  const children =
    Array.isArray(node.children) && node.children.length
      ? "\n" + node.children.map((c, i) => generateHtml(c, indent + 1, i + 1, false)).join("") + tab
      : (node.textContent ?? "");

  return `${tab}<${tag}${classAttr}>${children}</${tag}>\n`;
}


function getEqualChildInline(parentNode, childIdx) {
  if (!parentNode || parentNode.type !== "layout_equal") return null;

  const count =
    parentNode.equalCount ||
    (Array.isArray(parentNode.children) ? parentNode.children.length : 1) ||
    1;

  // uses your design gap variable; if it's not present, fall back to 0px
  const gapVar = "--sk_el_custom_gap";
  const basis = `calc(100% / ${count} - (var(${gapVar}, 0px) / ${count} * ${count - 1}))`;

  // Add a subtle outline so you can “see” widths in the canvas
  return {
    flexBasis: basis,
    flexGrow: 0,
    flexShrink: 0,
    // purely visual hints; won’t be exported
    outline: "1px dashed rgba(0,0,0,.2)",
    minHeight: "40px",
  };
}

// function generateCss(
//   node,
//   map = {},
//   parentSel = "",
//   index = 1,
//   isRootFlag = true,
//   // ctx kept for signature compatibility but not used for essence/states anymore
//   ctx = { rootSel: "", currentEssence: null }
// ) {
//   if (!node) return map;

//   // selector for this node
//   let thisSel = parentSel;
//   if (node.cn) {
//     const idxCls = idxSuffix(node, index, isRootFlag).trim(); // e.g. "idx_2" or ""
//     const currentSel = skify(node.cn) + (idxCls ? `.${idxCls}` : "");
//     thisSel = parentSel ? parentSel + " > " + currentSel : currentSel;
//     if (isRootFlag && !ctx.rootSel) ctx.rootSel = thisSel;
//   }

//   // merge explicit styles from state
//   if (node.styles && thisSel) {
//     map[thisSel] = { ...(map[thisSel] || {}), ...node.styles };
//   }

//   // merge additional tokens (skip background/color here – those come from styles now)
//   if (thisSel && node.cssTokens) {
//     const { background, color, ...restTokens } = node.cssTokens; // omit bg/color
//     if (Object.keys(restTokens).length) {
//       map[thisSel] = { ...(map[thisSel] || {}), ...restTokens };
//     }
//   }

//   // recurse
//   if (Array.isArray(node.children) && node.children.length) {
//     node.children.forEach((c, i) =>
//       generateCss(c, map, thisSel, i + 1, false, ctx)
//     );
//   }

//   return map;
// }


function generateCss(node, map = {}, parentSel = "", index = 1, isRootFlag = true) {
  if (!node) return map;

  // build a selector for this node
  let thisSel = parentSel;
  if (node.cn) {
    const idxCls = idxSuffix(node, index, isRootFlag).trim();
    const currentSel = skify(node.cn) + (idxCls ? `.${idxCls}` : "");
    thisSel = parentSel ? parentSel + " > " + currentSel : currentSel;
  }

  // plain styles for this node
  if (node.styles && thisSel) {
    map[thisSel] = { ...(map[thisSel] || {}), ...node.styles };
  }

  // SPECIAL: equal columns rule (parent-only target)
  if (node.type === "layout_equal" && thisSel) {
    // use equalCount if set; else count layout children
    const n =
      node.equalCount ||
      (Array.isArray(node.children)
        ? node.children.filter((ch) => ch && ch.type === "layout").length
        : 0) || 1;

    const ruleSel = `${thisSel} > *`; // target all direct children (you can restrict if needed)
    const basis = `calc(100% / ${n} - (var(--sk_el_custom_gap) / ${n} * ${n - 1}))`;

    map[ruleSel] = {
      ...(map[ruleSel] || {}),
      flexBasis: basis,
      flexGrow: 0,
      flexShrink: 0,
    };
  }

  // recurse
  if (Array.isArray(node.children) && node.children.length) {
    node.children.forEach((c, i) => generateCss(c, map, thisSel, i + 1, false));
  }

  return map;
}




export function TreeEditor() {
  const dispatch = useDispatch();

  const tree = useSelector(selectTree);
  const selectedPath = useSelector(selectSelectedPath);
  const activeNode = useSelector(selectActiveNode);
  const hoverPath = useSelector(selectHoverPath);
  const visualHelpers = useSelector(selectVisualHelpers);
  const exportState = useSelector(selectExport);
  const uiStates = useSelector(selectUIStates);
  console.log({ activeNode });


  const getRenderStyles = (node) => {
    // база
    let out = { ...(node.styles || {}) };

    // мержим оверрайды отмеченных состояний в фиксированном порядке:
    // inactive -> loading -> active -> hover (hover последним, чтобы побеждал)
    const order = ['state_inactive', 'state_loading', 'state_active', 'state_hover'];
    for (const sk of order) {
      const isChecked =
        (sk === 'state_active' && uiStates.active) ||
        (sk === 'state_hover' && uiStates.hover) ||
        (sk === 'state_inactive' && uiStates.inactive) ||
        (sk === 'state_loading' && uiStates.loading);

      if (isChecked && node.stateStyles?.[sk]) {
        out = { ...out, ...node.stateStyles[sk] };
      }
    }
    return out;
  };
  const selectedNode = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);



  useEffect(() => {
    const goUp = (path) => {
      let p = path.slice(0, -1);
      while (p.length >= 0) {
        const n = p.length ? getNodeAtPath(tree, p) : tree;
        if (n && isLayoutNode(n)) return p;
        if (p.length === 0) break;
        p = p.slice(0, -1);
      }
      return null;
    };

    const goDownFirstChild = (path) => {
      const n = path.length ? getNodeAtPath(tree, path) : tree;
      if (!n || !Array.isArray(n.children) || n.children.length === 0) return null;
      return [...path, 0];
    };

    const basePath = () =>
      Array.isArray(hoverPath) && hoverPath.length ? hoverPath
        : Array.isArray(selectedPath) ? selectedPath
          : [];

    const handlePlus = () => {
      const down = goDownFirstChild(basePath());
      if (down) {
        dispatch(setHoverPath(down));
        dispatch(setSelectedPath(down));
      }
    };

    const handleMinus = () => {
      const up = goUp(basePath());
      if (up) {
        dispatch(setHoverPath(up));
        dispatch(setSelectedPath(up));
      }
    };

    const onKey = (e) => {
      const isMinus = e.key === "-" || e.key === "Subtract";
      const isPlus = e.key === "+" || (e.key === "=" && e.shiftKey) || e.key === "Add";
      if (isMinus) handleMinus();
      if (isPlus) handlePlus();
    };

    const canvasRoot = document.querySelector(".sk_bd_canvas_root");
    if (!canvasRoot) return;

    const onWheel = (e) => {
      if (e.deltaY < 0) {
        // scroll up
        handleMinus();
      } else if (e.deltaY > 0) {
        // scroll down
        handlePlus();
      }
    };

    window.addEventListener("keydown", onKey);
    canvasRoot.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKey);
      canvasRoot.removeEventListener("wheel", onWheel);
    };
  }, [dispatch, hoverPath, selectedPath, tree]);


  // useEffect(() => {
  //   const n = getNodeAtPath(tree, hoverPath) || tree;
  //   if (!isLayoutNode(n)) dispatch(setHoverPath([]));
  // }, [dispatch]); 

  const handlePaletteClick = (tpl, inside = false) => {
    let node = { ...tpl };

    // special case: layout_equal → generate N child layout nodes
    if (tpl.type === "layout_equal") {
      const n = tpl.equalCount || 4;
      node = {
        ...tpl,
        children: Array.from({ length: n }, () => ({
          name: "layout",
          type: "layout",
          el: "div",
          cn: "dg_token_wrapper",
          styles: { padding: "10px" },
          children: []
        }))
      };
    } else {
      node.children = tpl.children;
    }

    const current = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);
    if (inside && current?.type === "layout") {
      dispatch(insertAsChild({ path: selectedPath, newNode: node }));
    } else {
      dispatch(insertAfter({ path: selectedPath, newNode: node }));
    }
  };

  // const handlePaletteClick = (tpl, inside = false) => {
  //   const node = { ...tpl, children: tpl.children };
  //   const current = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);
  //   if (inside && isLayoutNode(current)) {
  //     dispatch(insertAsChild({ path: selectedPath, newNode: node }));
  //   } else {
  //     dispatch(insertAfter({ path: selectedPath, newNode: node }));
  //   }
  // };
  const handleRemove = () => {
    if (isRoot(selectedPath)) return;
    dispatch(removeAtPath(selectedPath));
  };
  const moveNode = (dir) => {
    if (isRoot(selectedPath)) return;
    dispatch(swapSiblings({ path: selectedPath, dir }));
  };

  // simple deep clone for our plain node objects
  const deepClone = (node) => JSON.parse(JSON.stringify(node));

  const duplicateSelected = () => {
    if (isRoot(selectedPath)) return; // skip duplicating root

    const node = getNodeAtPath(tree, selectedPath);
    if (!node) return;

    const parentPath = selectedPath.slice(0, -1);
    const idx = selectedPath[selectedPath.length - 1];

    // insert a cloned node right after the selected node
    dispatch(insertAfter({ path: selectedPath, newNode: deepClone(node) }));

    // move selection/hover to the newly inserted copy
    const newPath = [...parentPath, idx + 1];
    dispatch(setSelectedPath(newPath));
    dispatch(setHoverPath(newPath));
  };


  function exportHTMLCSS() {
    const html = generateHtml(tree);
    const cssMap = generateCss(tree);
    const css = Object.entries(cssMap)
      .map(([cls, st]) => `${cls} {\n  ${stylesToCssText(st)}\n}`)
      .join("\n\n");
    dispatch(setGenerated({ html, css }));
    dispatch(openCodeModal());
  }

  const PaletteItem = ({ tpl }) => {
    const Tag = tpl.el || "div";
    const current = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);
    const canHaveChildren = isLayoutNode(current);

    // textual fallback (used for non-void tags)
    const fallbackText =
      Array.isArray(tpl.children)
        ? tpl.children
        : (tpl.children ?? tpl.textContent ?? "");

    return (
      <div
        className="sk_bd_tool_item"
        onClick={() => handlePaletteClick(tpl, !!current && canHaveChildren)}
      >
        {Tag === "input" ? (
          <input className={tpl.cn} placeholder={typeof fallbackText === "string" ? fallbackText : ""} readOnly />
        ) : (
          <Tag className={tpl.cn}>{fallbackText}</Tag>
        )}
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
            <div className="sk_bd_canvas_root sk_canvas_grid">
              <div className="sk_bd_canvas_elements_wrapper">
                {(() => {
                  const renderNode = (node, path = []) => {
                    const Tag = node.el || "div";
                    const isLayout = isLayoutNode(node);
                    const sel = pathEq(path, selectedPath);
                    const rootSel = sel && isRoot(path);
                    const hov = pathEq(path, hoverPath); // hover allowed for any node

                    const children =
                      Array.isArray(node.children) && node.children.length
                        ? node.children.map((c, i) => renderNode(c, [...path, i]))
                        : (node.children !== null && node.children !== undefined
                          ? node.children
                          : (node.textContent || null));

                    const parent =
                      path.length > 0 ? getNodeAtPath(tree, path.slice(0, -1)) : null;
                    const inlineEqualPreview = parent
                      ? getEqualChildInline(parent, path[path.length - 1])
                      : null;

                    return (
                      <Tag
                        key={path.join("-")}
                        // style={node.styles}
                        // style={getRenderStyles(node)}
                        style={{
                          ...(node.styles || {}),
                          ...(inlineEqualPreview || {}), // ← merged inline preview
                        }}
                        className={
                          (node.cn || "") +
                          (visualHelpers && isLayout ? " state_helpers_on" : "") +
                          // selection styles (distinct for layout vs element)
                          (sel ? (isLayout ? " state_selected_layout" : " state_selected_element") : "") +
                          (rootSel ? " state_selected_root" : "") +
                          // layout type badge (kept)
                          (isLayout ? " variant_layout is_layout_clickable" : "") +
                          // hover styles (distinct for layout vs element)
                          (hov ? (isLayout ? " state_hover_layout" : " state_hover_element") : "") +
                          (path.length === 0 && uiStates.active ? " state_active" : "") +
                          (path.length === 0 && uiStates.inactive ? " state_inactive" : "") +
                          (path.length === 0 && uiStates.loading ? " state_loading" : "") +
                          (path.length === 0 && uiStates.hover ? " state_hover" : "")
                        }
                        onMouseEnter={(e) => {
                          e.stopPropagation();
                          // allow hover on ANY node
                          dispatch(setHoverPath(path));
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // select whatever is hovered (layout or not)
                          const hp = hoverPath ?? path;
                          const n = getNodeAtPath(tree, hp) || getNodeAtPath(tree, path);
                          if (!n) return;
                          dispatch(setSelectedPath(hp || path));
                        }}
                      >
                        {children}
                      </Tag>
                    );
                  };
                  return renderNode(tree, []);
                })()}

              </div>
            </div>

            <div className="sk_bd_tools">


              <div className="sk_bd_tool_wrapper">
                <button
                  className="sk_bd_btn_default"
                  onClick={duplicateSelected}
                  disabled={isRoot(selectedPath)}
                  title="Duplicate selected"
                >
                  <i className="dg_icon_copy"></i>
                </button>
              </div>

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

              <div className="sk_bd_state_wrapper">
                <label className={`sk_bd_state_checkbox ${uiStates.hover ? "state_checked" : ""}`} htmlFor="chb_state_hover">
                  <input
                    id="chb_state_hover"
                    type="checkbox"
                    checked={uiStates.hover}
                    onChange={(e) => dispatch(setUIState({ name: "hover", value: e.target.checked }))}
                  />
                  <i className="sk_bd_state_checkbox_imitator"></i>
                  <span className="sk_bd_state_checkbox_lbl">{"hover"}</span>
                </label>

                <label className={`sk_bd_state_checkbox ${uiStates.active ? "state_checked" : ""}`} htmlFor="chb_state_active">
                  <input
                    id="chb_state_active"
                    type="checkbox"
                    checked={uiStates.active}
                    onChange={(e) => dispatch(setUIState({ name: "active", value: e.target.checked }))}
                  />
                  <i className="sk_bd_state_checkbox_imitator"></i>
                  <span className="sk_bd_state_checkbox_lbl">{"active"}</span>
                </label>

                <label className={`sk_bd_state_checkbox ${uiStates.inactive ? "state_checked" : ""}`} htmlFor="chb_state_inactive">
                  <input
                    id="chb_state_inactive"
                    type="checkbox"
                    checked={uiStates.inactive}
                    onChange={(e) => dispatch(setUIState({ name: "inactive", value: e.target.checked }))}
                  />
                  <i className="sk_bd_state_checkbox_imitator"></i>
                  <span className="sk_bd_state_checkbox_lbl">{"inactive"}</span>
                </label>

                <label className={`sk_bd_state_checkbox ${uiStates.loading ? "state_checked" : ""}`} htmlFor="chb_state_loading">
                  <input
                    id="chb_state_loading"

                    type="checkbox"
                    checked={uiStates.loading}
                    onChange={(e) => dispatch(setUIState({ name: "loading", value: e.target.checked }))}
                  />
                  <i className="sk_bd_state_checkbox_imitator"></i>
                  <span className="sk_bd_state_checkbox_lbl">{"loading"}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sk_bd_canvas_controls">
        <div className="sk_bd_scroller">
          <Inspector selectedNode={selectedNode} />
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
              <div className="sk_bd_code_copy_block">
                <SyntaxHighlighter language="javascript" style={a11yDark}>
                  {exportState.html}
                </SyntaxHighlighter >
                <ReactClipboard action="copy" text={exportState.html} onSuccess={() => { }} onError={() => { }}>
                  <button className="sk_bd_code_copy_btn">copy</button>
                </ReactClipboard>
              </div>

              <div className="sk_bd_code_copy_block">

                <SyntaxHighlighter language="css" style={a11yDark}>
                  {exportState.css}
                </SyntaxHighlighter >
                <ReactClipboard action="copy" text={exportState.css} onSuccess={() => { }} onError={() => { }}>
                  <button className="sk_bd_code_copy_btn">copy</button>
                </ReactClipboard>
              </div>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
