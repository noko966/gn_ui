/**
 * TreeEditor.jsx  –  complete source
 *
 * Changes:
 * • Root layout now has default essence "event" (background/colour set)
 * • Essence is stored on the node (`node.essence`) when changed
 * • Essence dropdown reflects the selected node’s current essence
 * • stylesToCssText skips empty values (no `color: ;`)
 */

import React, { useState, useMemo, useEffect } from "react";

/* ───────────────────────── sample tree ────────────────────────── */

const initialTree = {
    name: "layout", // ← root counts as layout
    el: "div",
    cn: "container",
    type: "layout",
    essence: "event", // default essence on root
    styles: {
        display: "flex",
        alignItems: "center",
        padding: "10px",
        background: "var(--eventBg)",
        color: "var(--eventTxt)",
    },
    children: [
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_token_wrapper",
            children: [{ el: "i", cn: "icon_4 dg_icon_", children: null }]
        },
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_text_wrapper",
            styles: { display: "flex", flexDirection: "column", gap: "4px" },
            children: [

                {
                    name: "layout",
                    type: "layout",
                    el: "div",
                    cn: "dg_token_wrapper",
                    children: [{ el: "span", cn: "dg_text", children: "text piece 1" }]
                },
                {
                    name: "layout",
                    type: "layout",
                    el: "div",
                    cn: "dg_token_wrapper",
                    children: [{ el: "span", cn: "dg_text", children: "text piece 2" }]
                },
            ],
        },
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_token_wrapper",
            children: [{ el: "i", cn: "dg_icon_arrow_down", children: null }]
        },

        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_token_wrapper",
            children: [{ name: "action", el: "button", cn: "dg_btn", children: "btn default" },]
        },
    ]
}

/* ─────────── palette ─────────── */

const elementLibrary = [
    { name: "flag", el: "div", cn: "cHFlag", children: null },
    { name: "icon", el: "i", cn: "dg_icon_", children: null },
    { name: "text", el: "span", cn: "dg_text_", children: "text default" },
    { name: "action", el: "button", cn: "dg_btn", children: "btn default" },
    { name: "input", el: "input", cn: "dg_input", children: null },
    // layout template
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

/* ───────────────────────── component ─────────────────────────── */

export default function TreeEditor() {
    /* STATE ------------------------------------------------------- */
    const [treeState, setTreeState] = useState(initialTree);
    const [selectedPath, setSelectedPath] = useState([]);
    const [hoverPath, setHoverPath] = useState([]); // layout hover (defaults to root layout)
    const [selectedElemTpl, setSelectedElemTpl] = useState(elementLibrary[0]);
    const [customText, setCustomText] = useState("");

    const [newClassInput, setNewClassInput] = useState("");
    const [visualHelpers, setVisualHelpers] = useState(true);

    const [generatedHtml, setGeneratedHtml] = useState("");
    const [generatedCss, setGeneratedCss] = useState("");
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

    useEffect(() => {
        const onKey = (e) => {
            const isMinus = e.key === "-" || e.key === "Subtract";
            const isPlus = e.key === "+" || (e.key === "=" && e.shiftKey) || e.key === "Add";
            if (!isMinus && !isPlus) return;

            // Base path: prefer current hover if valid; else selected layout; else root
            let basePath =
                (hoverPath && pathIsLayout(hoverPath)) ? hoverPath :
                    (isLayoutNode(selectedNode) ? selectedPath : []);

            if (isMinus) {
                const up = ancestorLayoutPath(basePath);
                if (up) {
                    setHoverPath(up);
                    setSelectedPath(up); // keep selection in sync
                }
                return;
            }

            if (isPlus) {
                const down = firstChildLayoutPath(basePath);
                if (down) {
                    setHoverPath(down);
                    setSelectedPath(down); // “selects first one”
                }
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hoverPath, selectedPath, selectedNode, treeState]);

    useEffect(() => {
        if (!pathIsLayout(hoverPath)) setHoverPath([]); // root is a layout in your initial tree
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    /* HELPERS ------------------------------------------------------ */
    const isRoot = (p) => p.length === 0;

    const getNodeAtPath = (node, path) =>
        path.length === 0 ? node : getNodeAtPath(node.children[path[0]], path.slice(1));

    const selectedNode =
        selectedPath.length === 0 ? treeState : getNodeAtPath(treeState, selectedPath);

    const isLayoutNode = (n) =>
        n?.type === "layout"

    const canHaveChildren = (n) => isLayoutNode(n);

    const updateNodeAtPath = (tree, path, updater) => {
        if (path.length === 0) return updater(tree);
        const [head, ...rest] = path;
        return {
            ...tree,
            children: tree.children.map((c, i) =>
                i === head ? updateNodeAtPath(c, rest, updater) : c
            ),
        };
    };

    const pathEq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

    const pathIsLayout = (path) => {
        const n = getNodeAtPath(treeState, path);
        return !!n && isLayoutNode(n);
    };

    const ancestorLayoutPath = (path) => {
        // nearest ancestor that is a layout (excluding self)
        let p = path.slice(0, -1);
        while (p.length >= 0) {
            const n = p.length ? getNodeAtPath(treeState, p) : treeState;
            if (n && isLayoutNode(n)) return p;
            if (p.length === 0) break;
            p = p.slice(0, -1);
        }
        return null;
    };

    const firstChildLayoutPath = (path) => {
        const n = path.length ? getNodeAtPath(treeState, path) : treeState;
        if (!n || !Array.isArray(n.children)) return null;
        for (let i = 0; i < n.children.length; i++) {
            if (isLayoutNode(n.children[i])) return [...path, i];
        }
        return null;
    };


    /* INSERT / REMOVE / MOVE -------------------------------------- */
    const insertAfter = (path, newNode) =>
        updateNodeAtPath(treeState, path.slice(0, -1), (parent) => ({
            ...parent,
            children: [
                ...parent.children.slice(0, path[path.length - 1] + 1),
                newNode,
                ...parent.children.slice(path[path.length - 1] + 1),
            ],
        }));

    const insertAsChild = (path, newNode) =>
        updateNodeAtPath(treeState, path, (parent) =>
            !canHaveChildren(parent)
                ? parent
                : { ...parent, children: [newNode, ...(parent.children || [])] }
        );

    const removeAtPath = (path) =>
        updateNodeAtPath(treeState, path.slice(0, -1), (parent) => ({
            ...parent,
            children: parent.children.filter((_, i) => i !== path[path.length - 1]),
        }));

    const swapSiblings = (path, dir) => {
        const parentPath = path.slice(0, -1);
        const idx = path[path.length - 1];
        const parent = getNodeAtPath(treeState, parentPath);
        if (!parent.children) return treeState;
        const tgt = idx + dir;
        if (tgt < 0 || tgt >= parent.children.length) return treeState;
        const newKids = [...parent.children];
        [newKids[idx], newKids[tgt]] = [newKids[tgt], newKids[idx]];
        return updateNodeAtPath(treeState, parentPath, (p) => ({ ...p, children: newKids }));
    };

    /* HANDLERS ----------------------------------------------------- */
    const handlePaletteClick = (tpl, inside = false) => {
        setSelectedElemTpl(tpl);
        const node = {
            ...tpl,
            children: tpl.children === "text default" ? customText : tpl.children,
        };
        if (inside && canHaveChildren(selectedNode)) setTreeState(insertAsChild(selectedPath, node));
        else setTreeState(insertAfter(selectedPath, node));
    };

    const handleRemove = () => {
        if (isRoot(selectedPath)) return;
        setTreeState(removeAtPath(selectedPath));
        setSelectedPath([]);
    };

    const moveNode = (dir) => {
        if (isRoot(selectedPath)) return;
        const parent = getNodeAtPath(treeState, selectedPath.slice(0, -1));
        const idx = selectedPath[selectedPath.length - 1];
        const tgt = idx + dir;
        if (tgt < 0 || tgt >= parent.children.length) return;
        setTreeState(swapSiblings(selectedPath, dir));
        setSelectedPath([...selectedPath.slice(0, -1), tgt]);
    };

    const editStyle = (k, v) =>
        setTreeState(
            updateNodeAtPath(treeState, selectedPath, (n) => ({
                ...n,
                styles: { ...n.styles, [k]: v },
            }))
        );

    function handleEssenceChange(name) {
        setTreeState(
            updateNodeAtPath(treeState, selectedPath, (node) => ({
                ...node,
                essence: name || undefined,
                styles: {
                    ...node.styles,
                    background: name ? `var(--${name}Bg)` : "",
                    color: name ? `var(--${name}Txt)` : "",
                },
            }))
        );
    }

    const editClass = (cls) =>
        setTreeState(updateNodeAtPath(treeState, selectedPath, (n) => ({ ...n, cn: cls })));

    const editRootClass = (cls) => setTreeState({ ...treeState, cn: cls });

    /* EXPORT ------------------------------------------------------- */
    const camelToKebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

    const stylesToCssText = (obj) =>
        Object.entries(obj)
            .filter(([_, v]) => v !== "" && v != null) // skip empty/cleared values
            .map(([k, v]) => `${camelToKebab(k)}: ${v};`)
            .join("\n  ");

    /* helper: return ".idx_N" or ""  (root never gets one) */
    const idxSuffix = (node, index, isRoot) => {
        if (isRoot) return ""; // root always one
        const hasUserIdx = (node.cn || "").split(" ").some((t) => /^idx_\d+$/.test(t));
        return hasUserIdx ? "" : ` idx_${index}`; // prepend space for HTML
    };

    /* ───────────────────── generateHtml ───────────────────── */
    function generateHtml(node, indent = 0, index = 1, isRoot = true) {
        if (!node) return "";
        const tab = "  ".repeat(indent);
        const tag = node.el || "div";

        const idxCls = idxSuffix(node, index, isRoot); // " idx_3" or ""
        const classAttr =
            node.cn || idxCls.trim() ? ` class="sk_${(node.cn || "").trim()}${idxCls}"` : "";

        const children =
            Array.isArray(node.children) && node.children.length
                ? "\n" +
                node.children
                    .map((c, i) => generateHtml(c, indent + 1, i + 1, false))
                    .join("") +
                tab
                : node.children || "";

        return `${tab}<${tag}${classAttr}>${children}</${tag}>\n`;
    }

    /* helper: convert spaces to dot-chains ".sk_a.b.c" */
    const skify = (cls) =>
        cls
            .trim()
            .split(/\s+/)
            .map((t) => `.sk_${t}`)
            .join("");

    /* ───────────────────── generateCss ───────────────────── */
    function generateCss(node, map = {}, parentSel = "", index = 1, isRoot = true) {
        if (!node) return map;

        /* 1. selector for this node */
        if (node.cn) {
            const idxCls = idxSuffix(node, index, isRoot).trim(); // "idx_5" or ""
            const thisSel = (parentSel ? parentSel + " > " : "") + skify(node.cn) + (idxCls ? `.${idxCls}` : "");

            if (node.styles) {
                map[thisSel] = { ...(map[thisSel] || {}), ...node.styles };
            }
            parentSel = thisSel; // for children
        }

        /* 2. recurse */
        if (Array.isArray(node.children) && node.children.length) {
            node.children.forEach((c, i) => generateCss(c, map, parentSel, i + 1, false));
        }

        console.log(map);

        return map;
    }

    function exportHTMLCSS() {
        const html = generateHtml(treeState);
        const cssMap = generateCss(treeState);
        const css = Object.entries(cssMap)
            .map(([cls, st]) => `${cls} {\n  ${stylesToCssText(st)}\n}`)
            .join("\n\n");
        setGeneratedHtml(html);
        setGeneratedCss(css);
        setIsCodeModalOpen(true);
    }

    /* Essence of selected node (derived from styles or explicit field) */
    const selectedEssence = useMemo(() => {
        const node = selectedNode;
        if (!node) return "";
        if (node.essence) return node.essence;
        const bg = node.styles?.background || "";
        const txt = node.styles?.color || "";
        const mBg = bg.match(/^var\(--([a-zA-Z0-9_-]+)Bg\)$/);
        const mTxt = txt.match(/^var\(--([a-zA-Z0-9_-]+)Txt\)$/);
        if (mBg && mTxt && mBg[1] === mTxt[1]) return mBg[1];
        return "";
    }, [selectedNode]);

    /* RENDER ------------------------------------------------------- */

    const renderNode = (node, path = []) => {
        const Tag = node.el || "div";
        const isLayout = isLayoutNode(node);

        const sel = JSON.stringify(path) === JSON.stringify(selectedPath);
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
                    if (isLayout) setHoverPath(path);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!hoverPath || !isLayoutNode(getNodeAtPath(treeState, hoverPath))) return;
                    setSelectedPath(hoverPath);
                }}
            >
                {children}
            </Tag>
        );
    };

    /* inspector ---------------------------------------------------- */
    /* ===== Helpers for Inspector ===== */
    const ensurePx = (v) => (v === "" || v == null ? "" : /^\d+$/.test(String(v)) ? `${v}px` : v);
    const getNum = (v) => (v ? String(v).replace(/px$/, "") : "");

    const Radio = ({ name, value, checked, label, onChange }) => (
        <label style={{ marginRight: 10, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
            />
            {label}
        </label>
    );

    const NumberPx = ({ value, onChange, width = 64 }) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input
                type="number"
                value={getNum(value)}
                onChange={(e) => onChange(ensurePx(e.target.value))}
                style={{ width }}
            />
            px
        </span>
    );

    /* ===== Drop-in replacement ===== */
    const Inspector = () => {
        if (!selectedNode) return <em>Select a node</em>;

        // generic (non-layout) node
        if (!isLayoutNode(selectedNode)) {
            return (
                <>
                    <h4>Element</h4>
                    <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>class</div>
                        <input
                            value={selectedNode.cn || ""}
                            onChange={(e) => editClass(e.target.value)}
                            style={{ width: "100%" }}
                        />
                    </div>
                </>
            );
        }

        // layout node inspector
        const st = selectedNode.styles || {};
        const direction = st.flexDirection || "row";
        const wrap = st.flexWrap || "nowrap";

        // size: fill / hug / fixed
        const size =
            st.flexGrow === 1 ? "fill" : st.flexShrink === 0 ? "hug" : "fixed";

        const setStyles = (patch) =>
            setTreeState(updateNodeAtPath(treeState, selectedPath, (n) => ({
                ...n,
                styles: { ...(n.styles || {}), ...patch }
            })));

        const setSize = (v) => {
            setTreeState(updateNodeAtPath(treeState, selectedPath, (n) => {
                const next = { ...(n.styles || {}) };
                if (v === "fill") {
                    next.flexGrow = 1;
                    next.minWidth = "1px";
                    delete next.flexShrink;
                } else if (v === "hug") {
                    next.flexShrink = 0;
                    delete next.flexGrow;
                    delete next.minWidth;
                } else {
                    // fixed
                    delete next.flexGrow;
                    delete next.flexShrink;
                    delete next.minWidth;
                }
                return { ...n, styles: next };
            }));
        };

        // padding helpers
        const setPaddingAll = (v) =>
            setStyles({
                paddingTop: v, paddingRight: v, paddingBottom: v, paddingLeft: v,
                padding: undefined
            });
        const setPaddingX = (v) => setStyles({ paddingLeft: v, paddingRight: v, padding: undefined });
        const setPaddingY = (v) => setStyles({ paddingTop: v, paddingBottom: v, padding: undefined });

        // radius helpers
        const setRadiusAll = (v) =>
            setStyles({
                borderTopLeftRadius: v, borderTopRightRadius: v,
                borderBottomRightRadius: v, borderBottomLeftRadius: v,
                borderRadius: undefined
            });

        return (
            <>
                <h4>Layout</h4>

                {/* class */}
                <div className="dg_bd_layout_edit_tool_wrapper">
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>class</div>
                    <input
                        value={selectedNode.cn || ""}
                        onChange={(e) => editClass(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </div>

                {/* size radios */}
                <div className="dg_bd_layout_edit_tool_wrapper ">
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>size</div>
                    <div className="dg_bd_layout_edit_tool_wrapper_variants">
                        <Radio name="size" value="fill" checked={size === "fill"} label="fill" onChange={setSize} />
                        <Radio name="size" value="hug" checked={size === "hug"} label="hug" onChange={setSize} />
                        <Radio name="size" value="fixed" checked={size === "fixed"} label="fixed" onChange={setSize} />
                    </div>

                </div>

                {/* direction radios */}
                <div className="dg_bd_layout_edit_tool_wrapper">
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>direction</div>
                    <div className="dg_bd_layout_edit_tool_wrapper_variants"><Radio
                        name="dir" value="row" label="row" checked={direction === "row"}
                        onChange={(v) => setStyles({ flexDirection: v })}
                    />
                        <Radio
                            name="dir" value="column" label="column" checked={direction === "column"}
                            onChange={(v) => setStyles({ flexDirection: v })}
                        /></div>

                </div>

                {/* wrap radios */}
                <div className="dg_bd_layout_edit_tool_wrapper">
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>wrap</div>
                    <div className="dg_bd_layout_edit_tool_wrapper_variants">
                        <Radio
                            name="wrap" value="nowrap" label="no-wrap" checked={wrap === "nowrap"}
                            onChange={(v) => setStyles({ flexWrap: v })}
                        />
                        <Radio
                            name="wrap" value="wrap" label="wrap" checked={wrap === "wrap"}
                            onChange={(v) => setStyles({ flexWrap: v })}
                        />
                    </div>
                </div>

                {/* align-items radios */}
                <div className="dg_bd_layout_edit_tool_wrapper">
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>align-items</div>
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

                {/* justify-content */}
                <div className="dg_bd_layout_edit_tool_wrapper">
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>justify-content</div>
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

                {/* gap (kept as number inputs) */}
                <div className="dg_bd_layout_edit_tool_wrapper">

                    <div className="dg_bd_layout_edit_tool_wrapper_variants">
                        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>h-gap</div>
                        <NumberPx
                            value={(direction === "row" ? st.columnGap : st.rowGap) || ""}
                            onChange={(v) =>
                                direction === "row" ? setStyles({ columnGap: v }) : setStyles({ rowGap: v })
                            }
                        />
                        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>v-gap</div>
                        <NumberPx
                            value={(direction === "row" ? st.rowGap : st.columnGap) || ""}
                            onChange={(v) =>
                                direction === "row" ? setStyles({ rowGap: v }) : setStyles({ columnGap: v })
                            }
                        />
                    </div>

                </div>

                {/* padding */}
                <div className="dg_bd_layout_edit_tool_wrapper">

                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>padding</div>
                    <div className="dg_bd_layout_edit_tool_wrapper_variants">
                        <label>All&nbsp;<NumberPx value={st.paddingTop === st.paddingRight &&
                            st.paddingTop === st.paddingBottom &&
                            st.paddingTop === st.paddingLeft
                            ? st.paddingTop : ""} onChange={setPaddingAll} /></label>
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


                {/* border radius */}
                < div className="dg_bd_layout_edit_tool_wrapper" >

                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>border-radius</div>
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
                </div >

                {/* essence (kept as select of tokens → radio was not requested here; keeping as-is) */}
                < div className="dg_bd_layout_edit_tool_wrapper" >

                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>essence</div>
                    <div className="dg_bd_layout_edit_tool_wrapper_variants">

                        {
                            essenceOptions.map((n) => (
                                <Radio
                                    key={n}
                                    name="essence"
                                    value={n}
                                    label={n}
                                    checked={selectedEssence === n}
                                    onChange={(val) => handleEssenceChange(val)}
                                />
                            ))
                        }
                        <Radio
                            name="essence"
                            value=""
                            label="none"
                            checked={!selectedEssence}
                            onChange={() => handleEssenceChange("")}
                        />
                    </div >
                </div >
            </>
        );
    };


    /* palette item */
    const PaletteItem = ({ tpl }) => {
        const Tag = tpl.el || "div";
        return (
            <div
                className="sk_bd_tool_item"
                onClick={() =>
                    handlePaletteClick(tpl, !!selectedNode && canHaveChildren(selectedNode))
                }
            >
                <Tag className={tpl.cn}>{tpl.children}</Tag>
            </div>
        );
    };

    /* close modal */
    const closeModal = () => setIsCodeModalOpen(false);

    /* jsx ---------------------------------------------------------- */
    return (
        <div className="sk_bd_root">
            {/* PALETTE */}
            <div className="sk_bd_tools_root">
                {elementLibrary.map((tpl) => (
                    <PaletteItem key={tpl.name} tpl={tpl} />
                ))}
            </div>

            {/* CANVAS */}
            <div className="sk_bd_layout_mid">

                <div className="sk_bd_canvas_root">
                    <div className="sk_bd_canvas_elements_wrapper">{renderNode(treeState)}</div>


                </div>
                <div className="sk_bd_tools">
                    <div className="sk_bd_tool_wrapper">
                        <button onClick={handleRemove} disabled={isRoot(selectedPath)}>
                            <i className="dg_icon_close"></i>
                        </button>
                    </div>
                    <div className="sk_bd_tool_wrapper">
                        <button onClick={() => moveNode(-1)}>
                            <i className="dg_icon_angle_left"></i>
                        </button>
                    </div>
                    <div className="sk_bd_tool_wrapper">
                        <button onClick={() => moveNode(1)}>
                            <i className="dg_icon_angle_right"></i>
                        </button>
                    </div>
                    <div className="sk_bd_tool_wrapper">
                        <button onClick={() => setVisualHelpers(!visualHelpers)}>
                            <i className="dg_icon_info"></i>
                        </button>
                    </div>
                    <div className="sk_bd_tool_wrapper">
                        <button onClick={exportHTMLCSS}>Generate Code</button>
                    </div>
                    {/* <div className="sk_bd_tool_wrapper">
                        <input value={treeState.cn} onChange={(e) => editRootClass(e.target.value)} />
                    </div> */}




                </div>
            </div>

            {/* CONTROLS */}
            <div className="sk_bd_canvas_controls">
                {/* <label>
                    text&nbsp;
                    <input value={customText} onChange={(e) => setCustomText(e.target.value)} />
                </label> */}



                <Inspector />
            </div>

            {/* CODE MODAL */}
            {isCodeModalOpen && (
                <div className="sk_bd_code_modal_backdrop" onClick={closeModal}>
                    <div className="sk_bd_code_root" onClick={(e) => e.stopPropagation()}>
                        <div className="sk_bd_code_modal_header">
                            <span>export</span>
                            <button className="sk_bd_code_close" onClick={closeModal}>
                                ✕
                            </button>
                        </div>
                        <pre className="sk_bd_code_wrapper">
                            <div>{generatedHtml}</div>
                            {"\n\n"}
                            <div>{generatedCss}</div>
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
