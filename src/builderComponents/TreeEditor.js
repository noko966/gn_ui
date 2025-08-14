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
import { Inspector } from "./Inspector"; // ← NEW

/* palette etc… keep as-is */
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
    .map((t) => `.sk_${t}`)
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
  const idxCls = idxSuffix(node, index, isRootFlag);
  const classAttr = node.cn || idxCls.trim() ? ` className="sk_${(node.cn || "").trim()}${idxCls}"` : "";
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
    if (!isLayoutNode(n)) dispatch(setHoverPath([]));
  }, [dispatch]); // intentional one-time

  const handlePaletteClick = (tpl, inside = false) => {
    const node = { ...tpl, children: tpl.children };
    const current = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);
    if (inside && isLayoutNode(current)) {
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
    return (
      <div className="sk_bd_tool_item" onClick={() => handlePaletteClick(tpl, !!current && canHaveChildren)}>
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
              <div className="sk_bd_canvas_elements_wrapper">
                {/* canvas */}
                {(() => {
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
                  return renderNode(tree);
                })()}
              </div>
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
                <SyntaxHighlighter  language="javascript" style={a11yDark}>
                  {exportState.html}
                </SyntaxHighlighter >
                <ReactClipboard action="copy" text={exportState.html} onSuccess={() => {}} onError={() => {}}>
                <button className="sk_bd_code_copy_btn">copy</button>
          </ReactClipboard>
              </div>
 
              <div className="sk_bd_code_copy_block">
                
                <SyntaxHighlighter  language="css" style={a11yDark}>
                  {exportState.css}
                </SyntaxHighlighter >
                <ReactClipboard action="copy" text={exportState.css} onSuccess={() => {}} onError={() => {}}>
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
