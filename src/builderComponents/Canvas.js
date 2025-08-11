/**
 * TreeEditor.jsx  –  **complete source**
 *
 * What’s new vs. your last paste:
 * • “layout” added to the palette (flex container template)
 * • Only layout nodes may nest children
 * • Buttons:  “+ Child” (inside)  and  “+ After” (sibling)
 * • Smart inspector for layout nodes: size (fill/hug), direction, wrap,
 *   horizontal / vertical gap, essence and class name
 * • Root component class field
 * • Export-to-modal stays untouched
 */

import React, { useState, useMemo } from "react";

/* ───────────────────────── sample tree ────────────────────────── */

const initialTree = {
    name: "layout", // ← root counts as layout
    el: "div",
    cn: "container",
    styles: { display: "flex", alignItems: "center", padding: "10px" },
    children: [
        { el: "i", cn: "icon_4 dg_icon_", children: null },
        {
            name: "layout",
            el: "div",
            cn: "dg_text_wrapper",
            styles: { display: "flex", flexDirection: "column", gap: "4px" },
            children: [
                { el: "span", cn: "dg_text", children: "text piece 1" },
                { el: "span", cn: "dg_text", children: "text piece 2" }
            ]
        },
        { el: "i", cn: "dg_icon_arrow_down", children: null }
    ]
};

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
        el: "div",
        cn: "dg_layout",
        styles: { display: "flex", gap: "8px", minWidth: "40px", minHeight: "40px" },
        children: []
    }
];

const essenceOptions = ["body", "accent", "dominant", "event"];

/* ───────────────────────── component ─────────────────────────── */

export default function TreeEditor() {
    /* STATE ------------------------------------------------------- */
    const [treeState, setTreeState] = useState(initialTree);
    const [selectedPath, setSelectedPath] = useState([]);
    const [selectedElemTpl, setSelectedElemTpl] = useState(elementLibrary[0]);
    const [customText, setCustomText] = useState("");

    const [newClassInput, setNewClassInput] = useState("");
    const [selectedEssence, setSelectedEssence] = useState("");

    const [generatedHtml, setGeneratedHtml] = useState("");
    const [generatedCss, setGeneratedCss] = useState("");
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

    /* HELPERS ------------------------------------------------------ */
    const isRoot = (p) => p.length === 0;

    const getNodeAtPath = (node, path) =>
        path.length === 0
            ? node
            : getNodeAtPath(node.children[path[0]], path.slice(1));

    const selectedNode =
        selectedPath.length === 0 ? treeState : getNodeAtPath(treeState, selectedPath);

    const isLayoutNode = (n) =>
        n?.name === "layout" || n?.cn?.split(" ").includes("dg_layout") || n?.styles?.display === "flex";

    const canHaveChildren = (n) => isLayoutNode(n);

    const updateNodeAtPath = (tree, path, updater) => {
        if (path.length === 0) return updater(tree);
        const [head, ...rest] = path;
        return {
            ...tree,
            children: tree.children.map((c, i) =>
                i === head ? updateNodeAtPath(c, rest, updater) : c
            )
        };
    };

    /* INSERT / REMOVE / MOVE -------------------------------------- */
    const insertAfter = (path, newNode) =>
        updateNodeAtPath(treeState, path.slice(0, -1), (parent) => ({
            ...parent,
            children: [
                ...parent.children.slice(0, path[path.length - 1] + 1),
                newNode,
                ...parent.children.slice(path[path.length - 1] + 1)
            ]
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
            children: parent.children.filter((_, i) => i !== path[path.length - 1])
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
            children: tpl.children === "text default" ? customText : tpl.children
        };
        if (inside && canHaveChildren(selectedNode))
            setTreeState(insertAsChild(selectedPath, node));
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
                styles: { ...n.styles, [k]: v }
            }))
        );

    function handleEssenceChange(name) {
        setTreeState(
            updateNodeAtPath(treeState, selectedPath, (node) => ({
                ...node,
                styles: {
                    ...node.styles,
                    background: name ? `var(--${name}Bg)` : "",
                    color: name ? `var(--${name}Txt)` : ""
                }
            }))
        );
        setSelectedEssence(name);
    }

    const editClass = (cls) =>
        setTreeState(updateNodeAtPath(treeState, selectedPath, (n) => ({ ...n, cn: cls })));

    const editRootClass = (cls) => setTreeState({ ...treeState, cn: cls });

    /* EXPORT ------------------------------------------------------- */
    const camelToKebab = (s) =>
        s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

    const stylesToCssText = (obj) =>
        Object.entries(obj)
            .map(([k, v]) => `${camelToKebab(k)}: ${v};`)
            .join("\n  ");

    /* helper: return ".idx_N" or ""  (root never gets one) */
    const idxSuffix = (node, index, isRoot) => {
        if (isRoot) return "";                              // root always one
        const hasUserIdx = (node.cn || "")
            .split(" ")
            .some((t) => /^idx_\d+$/.test(t));
        return hasUserIdx ? "" : ` idx_${index}`;           // prepend space for HTML
    };

    /* ───────────────────── generateHtml ───────────────────── */
    function generateHtml(node, indent = 0, index = 1, isRoot = true) {
        if (!node) return "";
        const tab = "  ".repeat(indent);
        const tag = node.el || "div";

        const idxCls = idxSuffix(node, index, isRoot);      // " idx_3" or ""
        const classAttr =
            node.cn || idxCls.trim()
                ? ` class="sk_${(node.cn || "").trim()}${idxCls}"`
                : "";

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
            const thisSel =
                (parentSel ? parentSel + " > " : "") +
                skify(node.cn) +
                (idxCls ? `.${idxCls}` : "");

            if (node.styles) {
                map[thisSel] = { ...(map[thisSel] || {}), ...node.styles };
            }
            parentSel = thisSel;                                // for children
        }

        /* 2. recurse */
        if (Array.isArray(node.children) && node.children.length) {
            node.children.forEach((c, i) =>
                generateCss(c, map, parentSel, i + 1, false)
            );
        }

        console.log(map);
        
        return map;
    }


    function exportHTMLCSS() {
        const html = generateHtml(treeState);
        const cssMap = generateCss(treeState);
        const css = Object.entries(cssMap)
            .map(
                ([cls, st]) =>
                    `${cls} {\n  ${stylesToCssText(st)}\n}`
            )
            .join("\n\n");
        setGeneratedHtml(html);
        setGeneratedCss(css);
        setIsCodeModalOpen(true);
    }

    /* RENDER ------------------------------------------------------- */

    const renderNode = (node, path = []) => {
        const Tag = node.el || "div";
        const sel = JSON.stringify(path) === JSON.stringify(selectedPath);
        const rootSel = sel && isRoot(path);
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
                    (sel ? " state_selected_node" : "") +
                    (rootSel ? " state_selected_root" : "")
                }
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPath(path);
                }}
            >
                {children}
            </Tag>
        );
    };

    /* inspector ---------------------------------------------------- */
    const Inspector = () => {
        if (!selectedNode) return <em>Select a node</em>;

        if (isLayoutNode(selectedNode)) {
            const st = selectedNode.styles || {};
            const horizGap =
                (st.flexDirection || "row") === "row" ? st.columnGap : st.rowGap;
            const vertGap =
                (st.flexDirection || "row") === "row" ? st.rowGap : st.columnGap;

            return (
                <>
                    <h4>Layout</h4>

                    <label>
                        class&nbsp;
                        <input
                            value={selectedNode.cn || ""}
                            onChange={(e) => editClass(e.target.value)}
                        />
                    </label>

                    <label>
                        size&nbsp;
                        <select
                            value={
                                selectedNode.styles?.flexGrow === 1 ? "fill" : "hug"
                            }
                            onChange={(e) => {
                                const val = e.target.value;

                                setTreeState(
                                    updateNodeAtPath(treeState, selectedPath, (node) => {
                                        const st = { ...(node.styles || {}) };

                                        if (val === "fill") {
                                            st.flexGrow = 1;
                                            st.minWidth = "1px";
                                            delete st.flexShrink;      // remove hug prop if present
                                        } else {
                                            st.flexShrink = 0;
                                            delete st.flexGrow;        // remove fill props if present
                                            delete st.minWidth;
                                        }

                                        return { ...node, styles: st };
                                    })
                                );
                            }}
                        >
                            <option value="fill">fill</option>
                            <option value="hug">hug</option>
                        </select>
                    </label>

                    <label>
                        direction&nbsp;
                        <select
                            value={st.flexDirection || "row"}
                            onChange={(e) => editStyle("flexDirection", e.target.value)}
                        >
                            <option value="row">row</option>
                            <option value="column">column</option>
                        </select>
                    </label>

                    <label>
                        wrap&nbsp;
                        <select
                            value={st.flexWrap || "nowrap"}
                            onChange={(e) => editStyle("flexWrap", e.target.value)}
                        >
                            <option value="nowrap">no-wrap</option>
                            <option value="wrap">wrap</option>
                        </select>
                    </label>

                    <label>
                        h-gap&nbsp;
                        <input
                            type="number"
                            value={(horizGap || "0px").replace("px", "")}
                            onChange={(e) => {
                                const val = e.target.value + "px";
                                (st.flexDirection || "row") === "row"
                                    ? editStyle("columnGap", val)
                                    : editStyle("rowGap", val);
                            }}
                            style={{ width: 60 }}
                        />
                        px
                    </label>

                    <label>
                        v-gap&nbsp;
                        <input
                            type="number"
                            value={(vertGap || "0px").replace("px", "")}
                            onChange={(e) => {
                                const val = e.target.value + "px";
                                (st.flexDirection || "row") === "row"
                                    ? editStyle("rowGap", val)
                                    : editStyle("columnGap", val);
                            }}
                            style={{ width: 60 }}
                        />
                        px
                    </label>

                    + <label>
                        essence&nbsp;
                        <select
                            value={selectedEssence}
                            onChange={(e) => handleEssenceChange(e.target.value)}
                        >
                            <option value="">–</option>
                            {essenceOptions.map((n) => (
                                <option key={n}>{n}</option>
                            ))}
                        </select>
                    </label>
                </>
            );
        }

        /* non-layout node */
        return (
            <>
                <h4>Element</h4>
                <label>
                    class&nbsp;
                    <input
                        value={selectedNode.cn || ""}
                        onChange={(e) => editClass(e.target.value)}
                    />
                </label>
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
            <div className="sk_bd_canvas_root">
                <div className="sk_bd_canvas_elements_wrapper">
                    {renderNode(treeState)}
                </div>
            </div>

            {/* CONTROLS */}
            <div className="sk_bd_canvas_controls">
                <label>
                    text&nbsp;
                    <input
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                    />
                </label>

                <button
                    onClick={() =>
                        handlePaletteClick(selectedElemTpl, false /* after */)
                    }
                >
                    + After
                </button>

                <button
                    onClick={() => handlePaletteClick(selectedElemTpl, true /* inside */)}
                    disabled={!canHaveChildren(selectedNode)}
                >
                    + Child
                </button>

                <button onClick={handleRemove} disabled={isRoot(selectedPath)}>
                    Remove
                </button>

                <button onClick={() => moveNode(-1)}>
                    <i className="dg_icon_angle_left"></i>
                </button>
                <button onClick={() => moveNode(1)}>
                    <i className="dg_icon_angle_right"></i>
                </button>

                <button onClick={exportHTMLCSS}>Export HTML/CSS</button>

                <label>
                    component class&nbsp;
                    <input
                        value={treeState.cn}
                        onChange={(e) => editRootClass(e.target.value)}
                    />
                </label>
                <Inspector />
            </div>



            {/* CODE MODAL */}
            {isCodeModalOpen && (
                <div className="sk_bd_code_modal_backdrop" onClick={closeModal}>
                    <div
                        className="sk_bd_code_root"
                        onClick={(e) => e.stopPropagation()}
                    >
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
