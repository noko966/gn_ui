// TreeEditor.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { saveAs } from "file-saver";
import JSZip from "jszip";
import ReactClipboard from "react-clipboardjs-copy";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { LayersPanel } from "../components";
import {
    closeCodeModal,
    insertAfter,
    insertAsChild,
    openCodeModal,
    removeAtPath,
    selectActiveNode,
    selectExport,
    selectHoverPath,
    selectSelectedPath,
    selectTree,
    selectUIStates,
    selectVisualHelpers,
    setGenerated,
    setHoverPath,
    setSelectedPath,
    swapSiblings,
    toggleVisualHelpers,
    unlayoutSelected,
    wrapSelectedInLayout,
} from "../store/treeSlice";
import {
    classesToSelector,
    elementLibrary,
    getEffectiveClass,
    getNodeAtPath,
    isLayoutNode,
    isRoot,
    pathEq,
} from "../utils";
import { FONT_FILES, STYLES_FILES } from "../utils/constants";
import { Inspector } from "./Inspector";

/** stable key for style object */
const stableStyleKey = (styleObj = {}) => {
    const keys = Object.keys(styleObj).sort();
    return JSON.stringify(keys.reduce((acc, k) => ((acc[k] = styleObj[k]), acc), {}));
};

/** group equal style objects under a single rule with comma-joined selectors */
function generateCssBuckets(node, buckets = {}, parentSel = "") {
    if (!node) return buckets;

    let thisSel = parentSel;
    const cls = getEffectiveClass(node);
    if (cls) {
        const currentSel = classesToSelector(cls);
        thisSel = parentSel ? `${parentSel} > ${currentSel}` : currentSel;
    }

    if (node.styles && thisSel) {
        const key = stableStyleKey(node.styles);
        if (!buckets[key]) buckets[key] = { styles: node.styles, selectors: new Set() };
        buckets[key].selectors.add(thisSel);
    }

    if (Array.isArray(node.children) && node.children.length) {
        node.children.forEach((c) => generateCssBuckets(c, buckets, thisSel));
    }
    return buckets;
}

// ------ tiny fetch helpers ------
async function fetchTextOrNull(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) return null;
        const result = await res.text();
        console.log(result);
        return result;
    } catch {
        return null;
    }
}

async function fetchBinaryOrNull(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) return null;
        return await res.arrayBuffer();
    } catch {
        return null;
    }
}

// ------ build a full HTML doc around your generated body ------
function buildHtmlDocument(bodyHtml) {
    // Feel free to tweak <head> as you like. We link external CSS
    // and also generated.css that we place into /styles in the zip.
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>UI Export</title>
  <link rel="stylesheet" href="styles/global.css">
  <link rel="stylesheet" href="styles/fonts.css">
  <link rel="stylesheet" href="styles/variables.css">
  <link rel="stylesheet" href="styles/flags.css">
  <link rel="stylesheet" href="styles/generated.css">
</head>
<body>
  <div id="app">
${bodyHtml.trimEnd()}
  </div>
</body>
</html>`;
}

function stringifyCssBuckets(buckets) {
    const blocks = [];
    for (const { styles, selectors } of Object.values(buckets)) {
        const selectorList = Array.from(selectors).join(",\n");
        const body = Object.entries(styles)
            .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${v};`)
            .join("\n  ");
        blocks.push(`${selectorList} {\n  ${body}\n}`);
    }
    return blocks.join("\n\n");
}

async function downloadZip(tree, generateHtml, generateCssBuckets) {
    // 1) create HTML from your tree
    const bodyHtml = generateHtml(tree); // <- your function
    const fullHtml = buildHtmlDocument(bodyHtml);

    // 2) build CSS from your buckets
    const buckets = generateCssBuckets(tree); // <- your function
    const generatedCss = stringifyCssBuckets(buckets);

    // 3) prepare zip
    const zip = new JSZip();
    zip.file("index.html", fullHtml);
    zip.file("styles/generated.css", generatedCss);

    // 4) add external CSS files (from public/styles)
    for (const path of STYLES_FILES) {
        const text = await fetchTextOrNull(path);
        if (text != null) {
            const fileName = path.split("/").pop();
            zip.file(`styles/${fileName}`, text);
        }
    }

    // 5) add fonts (from public/fonts)
    for (const path of FONT_FILES) {
        const bin = await fetchBinaryOrNull(path);
        if (bin != null) {
            const fileName = path.split("/").pop();
            zip.file(`fonts/400/${fileName}`, bin); // ArrayBuffer is fine
        }
    }

    // 6) generate and save
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "ui-export.zip");
}

/* ───────────────────────── export helpers (HTML) ──────────────────────── */
function generateHtml(node, indent = 0) {
    if (!node) return "";
    const tab = "  ".repeat(indent);
    const tag = node.el || "div";
    const isInput = (tag + "").toLowerCase() === "input";

    const cls = getEffectiveClass(node);
    const classAttr = cls ? ` class="${cls}"` : "";

    if (isInput) {
        const attrs = [classAttr.trim(), node.textContent ? `placeholder="${node.textContent}"` : ""]
            .filter(Boolean)
            .join(" ");
        return `${tab}<input${attrs ? " " + attrs.trim() : ""} />\n`;
    }

    const children =
        Array.isArray(node.children) && node.children.length
            ? "\n" + node.children.map((c) => generateHtml(c, indent + 1)).join("") + tab
            : node.textContent ?? "";

    return `${tab}<${tag}${classAttr}>${children}</${tag}>\n`;
}

/* ─────────────────────────────── component ───────────────────────────── */
export function TreeEditor() {
    const dispatch = useDispatch();

    const tree = useSelector(selectTree);
    const selectedPath = useSelector(selectSelectedPath);
    const activeNode = useSelector(selectActiveNode);
    const hoverPath = useSelector(selectHoverPath);
    const visualHelpers = useSelector(selectVisualHelpers);
    const exportState = useSelector(selectExport);
    const uiStates = useSelector(selectUIStates);

    const selectedNode = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);

    // (Optional) live preview merging of "stateStyles" buckets into inline styles
    const getRenderStyles = (node) => {
        let out = { ...(node.styles || {}) };
        const order = ["state_inactive", "state_loading", "state_active", "state_hover"];
        for (const sk of order) {
            const isChecked =
                (sk === "state_active" && uiStates.active) ||
                (sk === "state_hover" && uiStates.hover) ||
                (sk === "state_inactive" && uiStates.inactive) ||
                (sk === "state_loading" && uiStates.loading);
            if (isChecked && node.stateStyles?.[sk]) {
                out = { ...out, ...node.stateStyles[sk] };
            }
        }
        return out;
    };

    /* plus/minus navigation (keyboard & canvas-only wheel) */
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
            Array.isArray(hoverPath) && hoverPath.length ? hoverPath : Array.isArray(selectedPath) ? selectedPath : [];

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

        const handleDeleteSelected = () => {
            if (!isRoot(selectedPath)) {
                dispatch(removeAtPath(selectedPath));
            }
        };

        const handleMove = (dir) => {
            if (!isRoot(selectedPath)) {
                dispatch(swapSiblings({ path: selectedPath, dir }));
            }
        };

        const handleWrap = () => {
            if (!isRoot(selectedPath)) {
                dispatch(wrapSelectedInLayout());
            }
        };

        const handleUnWrap = () => {
            if (!isRoot(selectedPath)) {
                dispatch(unlayoutSelected());
            }
        };

        const isTypingTarget = (el) => {
            if (!el) return false;
            const tag = (el.tagName || "").toLowerCase();
            const editable = el.isContentEditable;
            return editable || tag === "input" || tag === "textarea" || tag === "select";
        };

        const onKey = (e) => {
            // Don’t hijack keys while the user is typing in a field
            if (isTypingTarget(e.target)) return;

            const key = (e.key || "").toLowerCase();

            // +/- navigation
            if (key === "-" || key === "subtract") {
                e.preventDefault();
                handleMinus();
                return;
            }
            if (key === "+" || (key === "=" && e.shiftKey) || key === "add") {
                e.preventDefault();
                handlePlus();
                return;
            }

            // Delete node
            if (key === "delete" || key === "backspace") {
                e.preventDefault();
                handleDeleteSelected();
                return;
            }

            // Move node with arrows
            if (key === "arrowleft") {
                e.preventDefault();
                handleMove(-1);
                return;
            }
            if (key === "arrowright") {
                e.preventDefault();
                handleMove(1);
                return;
            }

            // Wrap into layout: Shift + A
            if (key === "a" && e.shiftKey) {
                e.preventDefault();
                handleWrap();
                return;
            }

            // Wrap into layout: Shift + A
            if (key === "g" && e.shiftKey) {
                e.preventDefault();
                handleUnWrap();
                return;
            }

            if (e.key.toLowerCase() === "c" && e.shiftKey) {
                duplicateSelected();
            }
        };

        const canvasRoot = document.querySelector(".sk_bd_canvas_root");
        if (!canvasRoot) return;

        const onWheel = (e) => {
            if (e.deltaY < 0) handleMinus();
            else if (e.deltaY > 0) handlePlus();
        };

        window.addEventListener("keydown", onKey);
        canvasRoot.addEventListener("wheel", onWheel, { passive: true });

        return () => {
            window.removeEventListener("keydown", onKey);
            canvasRoot.removeEventListener("wheel", onWheel);
        };
    }, [dispatch, hoverPath, selectedPath, tree]);

    /* palette -> insert node (store baseCn + cnUser) */
    const handlePaletteClick = (tpl, inside = false) => {
        // tpl.preview is a React function/JSX used only for the palette UI.
        // Do NOT copy it into the new node that goes into Redux state —
        // that creates non-serializable values in the store and breaks
        // redux-toolkit's serializable-state invariant middleware.
        const { preview, ...tplNoPreview } = tpl;
        const newNode = {
            ...tplNoPreview,
            baseCn: tpl.cn || "", // immutable base from library
            cnUser: "", // user-editable class
            children: tpl.children,
        };

        const current = selectedPath.length === 0 ? tree : getNodeAtPath(tree, selectedPath);
        if (inside && current?.type === "layout") {
            dispatch(insertAsChild({ path: selectedPath, newNode }));
        } else {
            dispatch(insertAfter({ path: selectedPath, newNode }));
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

    const deepClone = (node) => JSON.parse(JSON.stringify(node));

    const duplicateSelected = () => {
        if (isRoot(selectedPath)) return;
        const node = getNodeAtPath(tree, selectedPath);
        if (!node) return;
        const parentPath = selectedPath.slice(0, -1);
        const idx = selectedPath[selectedPath.length - 1];
        dispatch(insertAfter({ path: selectedPath, newNode: deepClone(node) }));
        const newPath = [...parentPath, idx + 1];
        dispatch(setSelectedPath(newPath));
        dispatch(setHoverPath(newPath));
    };

    /* export -> html + merged css */
    function exportHTMLCSS() {
        const html = generateHtml(tree);
        const buckets = generateCssBuckets(tree);
        const css = stringifyCssBuckets(buckets);
        dispatch(setGenerated({ html, css }));
        dispatch(openCodeModal());
    }

    /* palette item */
    const PaletteItem = ({ tpl }) => (
        <div className="sk_bd_tool_item" onClick={() => handlePaletteClick(tpl, true)}>
            <span className="sk_bd_tool_item_name">{tpl.name}</span>
            {tpl.preview && <span className="sk_bd_tool_preview">{tpl.preview()}</span>}
        </div>
    );

    const closeModal = () => dispatch(closeCodeModal());
    const themes = ["default", "dark"];
    const [theme, setTheme] = useState("dark");

    const rootClassName = `sk_bd_root state_${theme}`;

    /* ─────────────────────────────── render ─────────────────────────────── */
    return (
        <div className={rootClassName}>
            <div className="sk_bd_start_wrapper">
                <div className="sk_bd_start_wrapper_inner">
                    <div className="sk_bd_tools_root">
                        <div className="sk_bd_tool_elements sk_bd_panel">
                            <div className="sk_bd_header">{"components"}</div>
                            <div className="sk_bd_tool_elements_layout sk_bd_scroller">
                                {elementLibrary.map((tpl) => (
                                    <PaletteItem key={tpl.name} tpl={tpl} />
                                ))}
                            </div>
                        </div>

                        <div className="sk_bd_tool_layers sk_bd_panel">
                            <LayersPanel />
                        </div>
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
                                        const hov = pathEq(path, hoverPath);

                                        const className = getEffectiveClass(node);

                                        const children =
                                            Array.isArray(node.children) && node.children.length
                                                ? node.children.map((c, i) => renderNode(c, [...path, i]))
                                                : node.children != null
                                                ? node.children
                                                : node.textContent || null;

                                        return (
                                            <Tag
                                                key={path.join("-")}
                                                style={getRenderStyles(node)}
                                                className={
                                                    className +
                                                    (visualHelpers && isLayout ? " state_helpers_on" : "") +
                                                    (sel
                                                        ? isLayout
                                                            ? " state_selected_layout"
                                                            : " state_selected_element"
                                                        : "") +
                                                    (rootSel ? " state_selected_root" : "") +
                                                    (isLayout ? " variant_layout is_layout_clickable" : "") +
                                                    (hov
                                                        ? isLayout
                                                            ? " state_hover_layout"
                                                            : " state_hover_element"
                                                        : "")
                                                }
                                                onMouseEnter={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(setHoverPath(path));
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const hp = hoverPath ?? path;
                                                    const n = getNodeAtPath(tree, hp) || getNodeAtPath(tree, path);
                                                    if (!n) return;
                                                    dispatch(setSelectedPath(hp || path));
                                                }}>
                                                {children}
                                            </Tag>
                                        );
                                    };
                                    return renderNode(tree, []);
                                })()}
                            </div>
                        </div>

                        <div className="sk_bd_tools sk_bd_panel">
                            <div className="sk_bd_header">main</div>

                            <div className="sk_bd_actions_row variant_node">
                                <div className="sk_bd_tool_wrapper">
                                    <button
                                        className="sk_bd_btn_default"
                                        onClick={duplicateSelected}
                                        disabled={isRoot(selectedPath)}
                                        title="Duplicate selected">
                                        <i className="dg_icon_copy"></i>
                                    </button>
                                </div>

                                <div className="sk_bd_tool_wrapper">
                                    <button
                                        className="sk_bd_btn_default"
                                        onClick={handleRemove}
                                        disabled={isRoot(selectedPath)}>
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
                                    <button
                                        className="sk_bd_btn_default"
                                        onClick={() => dispatch(wrapSelectedInLayout())}>
                                        <i className="dg_icon_un_dock"></i>
                                    </button>
                                </div>

                                <div className="sk_bd_tool_wrapper">
                                    <button className="sk_bd_btn_default" onClick={() => dispatch(unlayoutSelected())}>
                                        <i className="dg_icon_un_dock"></i>
                                    </button>
                                </div>

                                <div className="sk_bd_tool_wrapper">
                                    <button
                                        className="sk_bd_btn_default"
                                        onClick={() => dispatch(toggleVisualHelpers())}>
                                        <i className="dg_icon_info"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="sk_bd_themes_wrapper">
                                {themes.map((t) => (
                                    <label key={t} className={`sk_bd_theme_control variant_${t}`}>
                                        <input
                                            type="radio"
                                            name="theme"
                                            value={t}
                                            checked={theme === t}
                                            onChange={() => setTheme(t)}
                                        />
                                        <div className="sk_bd_theme_control_imit">
                                            <i></i>
                                            {/* <span>{t}</span> */}
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="sk_bd_actions_row">
                                <div className="sk_bd_canvas_controls_export_wrapper">
                                    <button className="sk_bd_btn" onClick={exportHTMLCSS}>
                                        Generate Code
                                    </button>
                                </div>
                                <div className="sk_bd_canvas_controls_export_wrapper">
                                    <button
                                        className="sk_bd_btn"
                                        onClick={() => downloadZip(tree, generateHtml, generateCssBuckets)}>
                                        Export ZIP
                                    </button>
                                </div>
                            </div>

                            {/* Radio buttons */}
                        </div>
                    </div>
                </div>
            </div>

            <div className="sk_bd_canvas_controls_root">
                <div className="sk_bd_canvas_controls sk_bd_panel">
                    <div className="sk_bd_header">main</div>
                    <div className="sk_bd_scroller">
                        <div className="sk_bd_canvas_controls_list">
                            <Inspector selectedNode={selectedNode} />
                        </div>
                    </div>
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
                        <div className="sk_bd_code_wrapper">
                            <div className="sk_bd_code_copy_block">
                                <div className="sk_bd_code_scroller">
                                    <SyntaxHighlighter language="javascript" style={a11yDark}>
                                        {exportState.html}
                                    </SyntaxHighlighter>
                                </div>
                                <div className="sk_bd_code_footer">
                                    <ReactClipboard
                                        action="copy"
                                        text={exportState.html}
                                        onSuccess={() => {}}
                                        onError={() => {}}>
                                        <button className="sk_bd_code_copy_btn">copy</button>
                                    </ReactClipboard>
                                </div>
                            </div>

                            <div className="sk_bd_code_copy_block">
                                <div className="sk_bd_code_scroller">
                                    <SyntaxHighlighter language="css" style={a11yDark}>
                                        {exportState.css}
                                    </SyntaxHighlighter>
                                </div>
                                <div className="sk_bd_code_footer">
                                    <ReactClipboard
                                        action="copy"
                                        text={exportState.css}
                                        onSuccess={() => {}}
                                        onError={() => {}}>
                                        <button className="sk_bd_code_copy_btn">copy</button>
                                    </ReactClipboard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
