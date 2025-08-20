import { createSlice, createSelector } from "@reduxjs/toolkit";
/* ---------- initial tree (exactly your current one) ---------- */
const initialTree = {
    name: "layout",
    el: "div",
    cn: "container",
    type: "layout",
    essence: "event",
    styles: {
        display: "flex",
        alignItems: "center",
        padding: "10px",
    },
    children: [
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_token_wrapper",
            children: [{ el: "i", type: "icon", cn: "icon_4 dg_icon_", children: null }],
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
                    children: [{ el: "span", type: "text", cn: "dg_text", children: null, textContent: "text piece 1" }],
                },
                {
                    name: "layout",
                    type: "layout",
                    el: "div",
                    cn: "dg_token_wrapper",
                    children: [{ el: "span", type: "text", cn: "dg_text", children: null, textContent: "text piece 2" }],
                },
            ],
        },
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_token_wrapper",
            children: [{ el: "i", type: "icon", cn: "dg_icon_arrow_down", children: null }],
        },
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_token_wrapper",
            children: [{ name: "action", type: "button", el: "button", cn: "dg_btn", children: null, textContent: "btn default" }],
        },
    ],
};

/* ----------------------- helpers (mutable) -------------------- */
const getNodeAtPath = (node, path) => {
    let n = node;
    for (let i = 0; i < path.length; i++) {
        if (!n.children || !n.children[path[i]]) return null;
        n = n.children[path[i]];
    }
    return n;
};



const getParentPath = (path) => path.slice(0, -1);

const isLayoutNode = (n) => n?.type === "layout";

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

// Treat absence of the flag as "inherited" (backwards compatible)
const isNodeObj = (x) => x != null && typeof x === "object" && !Array.isArray(x);
const hasExplicitEssence = (n) => isNodeObj(n) && n.essenceIsInherited === false;


/* -------------------------- slice ---------------------------- */
const treeSlice = createSlice({
    name: "tree",
    initialState: {
        tree: initialTree,
        selectedPath: [],
        hoverPath: [],
        visualHelpers: true,
        generatedHtml: "",
        generatedCss: "",
        isCodeModalOpen: false,
        uiStates: {
            hover: false,
            active: false,
            inactive: false,
            loading: false,
        },
    },
    reducers: {
        setClassName(state, action) {
            const path = state.selectedPath;

            console.log(state, action);

            const { cn } = action.payload;
            const node = getNodeAtPath(state.tree, path);
            if (node) {
                node.cn = cn;
            }
        },
        setSelectedPath(state, action) {
            state.selectedPath = action.payload;
        },
        setHoverPath(state, action) {
            state.hoverPath = action.payload;
        },
        toggleVisualHelpers(state) {
            state.visualHelpers = !state.visualHelpers;
        },
        setUIState(state, action) {
            const { name, value } = action.payload;
            if (name in state.uiStates) state.uiStates[name] = !!value;
        },
        insertAfter(state, action) {
            const { path, newNode } = action.payload;
            const parentPath = path.slice(0, -1);
            const idx = path[path.length - 1];
            const parent = getNodeAtPath(state.tree, parentPath);
            if (!parent || !Array.isArray(parent.children)) return;
            parent.children.splice(idx + 1, 0, newNode);
        },
        insertAsChild(state, action) {
            const { path, newNode } = action.payload;
            const parent = getNodeAtPath(state.tree, path);
            if (!parent) return;
            if (!isLayoutNode(parent)) return;
            parent.children = [newNode, ...(parent.children || [])];
        },
        removeAtPath(state, action) {
            const path = action.payload;
            if (path.length === 0) return;
            const parentPath = path.slice(0, -1);
            const idx = path[path.length - 1];
            const parent = getNodeAtPath(state.tree, parentPath);
            if (!parent?.children) return;
            parent.children.splice(idx, 1);
            state.selectedPath = [];
        },
        swapSiblings(state, action) {
            const { path, dir } = action.payload;
            const parentPath = path.slice(0, -1);
            const idx = path[path.length - 1];
            const parent = getNodeAtPath(state.tree, parentPath);
            if (!parent?.children) return;
            const tgt = idx + dir;
            if (tgt < 0 || tgt >= parent.children.length) return;
            const a = parent.children[idx];
            parent.children[idx] = parent.children[tgt];
            parent.children[tgt] = a;
            state.selectedPath = [...parentPath, tgt];
        },
        editStyle(state, action) {
            const { key, value } = action.payload;
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;

            const { uiStates = {} } = state;
            const enabled = [];
            if (uiStates.active) enabled.push("state_active");
            if (uiStates.hover) enabled.push("state_hover");
            if (uiStates.inactive) enabled.push("state_inactive");
            if (uiStates.loading) enabled.push("state_loading");

            if (enabled.length === 0) {
                node.styles = { ...(node.styles || {}), [key]: value };
                return;
            }

            node.stateStyles ||= {};
            for (const bucket of enabled) {
                node.stateStyles[bucket] = { ...(node.stateStyles[bucket] || {}), [key]: value };
            }
        },

        setPosition(state, action) {
            const { edge = "top-left", offset = 0 } = action.payload || {};
            const path = state.selectedPath;
            const node = getNodeAtPath(state.tree, path);
            if (!node) return;

            // normalize offset to px (if a number)
            const px = typeof offset === "number" ? `${offset}px` : offset;

            // ensure styles object
            node.styles = { ...(node.styles || {}) };

            // set absolute positioning on the node
            node.styles.position = "absolute";

            // clear any previous anchors
            delete node.styles.top;
            delete node.styles.right;
            delete node.styles.bottom;
            delete node.styles.left;

            // apply requested corner
            switch (edge) {
                case "top-right":
                    node.styles.top = px;
                    node.styles.right = px;
                    break;
                case "bottom-left":
                    node.styles.bottom = px;
                    node.styles.left = px;
                    break;
                case "bottom-right":
                    node.styles.bottom = px;
                    node.styles.right = px;
                    break;
                case "top-left":
                default:
                    node.styles.top = px;
                    node.styles.left = px;
                    break;
            }

            // store chosen edge/offset for UI reflection
            node.absEdge = edge;
            node.absOffset = px;

            // ensure parent is position: relative (if static/undefined)
            const parentPath = getParentPath(path);
            const parent = getNodeAtPath(state.tree, parentPath);
            if (parent) {
                parent.styles = { ...(parent.styles || {}) };
                if (!parent.styles.position || parent.styles.position === "static") {
                    parent.styles.position = "relative";
                }
            }
        },


        setLayoutType(state, action) {
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;

            if (node.type !== "layout") return;

            const payload = typeof action.payload === "string"
                ? { type: action.payload }
                : (action.payload || {});

            const kind = payload.type || "hug";
            const widthPx = payload.width;

            node.styles = { ...(node.styles || {}) };

            delete node.styles.width;
            delete node.styles["--sk_width"];

            switch (kind) {
                case "fill":
                    node.styles.flexGrow = 1;
                    delete node.styles.flexShrink;
                    node.styles.minWidth = "1px";
                    break;

                case "fixed":
                    delete node.styles.flexGrow;
                    node.styles.flexShrink = 0;
                    const finalWidth =
                        widthPx || node.styles.width || node.styles["--sk_width"] || 120;
                    node.styles.width = finalWidth;
                    node.styles["--sk_width"] = finalWidth + "px";
                    delete node.styles.minWidth;
                    break;

                case "hug":
                default:
                    delete node.styles.flexGrow;
                    node.styles.flexShrink = 0;
                    delete node.styles.minWidth;
                    break;
            }

            node.layoutType = kind;
        },


        setEssence(state, action) {
            const newEss = action.payload || undefined;
            const path = state.selectedPath;
            const node = getNodeAtPath(state.tree, path);
            if (!node) return;

            node.styles = { ...(node.styles || {}) };

            if (!newEss) {
                // clear essence + related defaults/variables on the selected node
                delete node.essence;
                delete node.styles.background;
                delete node.styles.color;
                delete node.styles["--sk_bg"];
                delete node.styles["--sk_txt"];
            } else {
                // set essence + default bg/txt + variables on the selected node
                node.essence = newEss;
                node.styles["--sk_bg"] = `var(--${newEss}Bg)`;
                node.styles["--sk_txt"] = `var(--${newEss}Txt)`;
                node.styles.background = `var(--sk_bg)`;
                node.styles.color = `var(--sk_txt)`;
            }

            // reapply text roles for descendants based on effective essence chain
            const reapplyTextRoles = (n, inheritedEssence) => {
                const effective = n.essence || inheritedEssence || null;

                const role = n.textRole;
                if (role) {
                    n.styles = { ...(n.styles || {}) };
                    if (effective) {
                        n.styles["--sk_txt"] = `var(--${effective}${role})`;
                        n.styles.color = `var(--sk_txt)`;
                    } else {
                        delete n.styles["--sk_txt"];
                        delete n.styles.color;
                    }
                }

                if (Array.isArray(n.children)) {
                    n.children.forEach((c) => reapplyTextRoles(c, effective));
                }
            };

            const startEss = node.essence || null;
            reapplyTextRoles(node, startEss);
        },


        setEssenceTxtVariant(state, action) {
            const role = action.payload || "";
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;

            const essence = closestEssenceName(state.tree, state.selectedPath);

            node.styles = { ...(node.styles || {}) };

            if (!role) {
                delete node.textRole;
                delete node.styles["--sk_txt"];
                delete node.styles.color;
                return;
            }

            node.textRole = role;

            if (!essence) {
                delete node.styles["--sk_txt"];
                delete node.styles.color;
                return;
            }

            node.styles["--sk_txt"] = `var(--${essence}${role})`;
            node.styles.color = "var(--sk_txt)";
        },
        editClass(state, action) {
            const cls = action.payload;
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;
            node.cn = cls;
        },
        editTextContent(state, action) {
            const txtContent = action.payload;
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!txtContent) return;
            node.textContent = txtContent;
        },
        setGenerated(state, action) {
            const { html, css } = action.payload;
            state.generatedHtml = html;
            state.generatedCss = css;
        },
        openCodeModal(state) {
            state.isCodeModalOpen = true;
        },
        closeCodeModal(state) {
            state.isCodeModalOpen = false;
        },
    },
});

export const {
    setSelectedPath,
    setHoverPath,
    toggleVisualHelpers,
    insertAfter,
    insertAsChild,
    removeAtPath,
    swapSiblings,
    editStyle,
    setLayoutType,
    setEssence,
    setEssenceTxtVariant,
    applyEssenceTextRole,
    editClass,
    editTextContent,
    setGenerated,
    openCodeModal,
    closeCodeModal,
    setUIState,
    setPosition,
    setClassName
} = treeSlice.actions;

export default treeSlice.reducer;

/* ----------------- selectors ---------------- */
export const selectTree = (s) => s.tree.tree;
export const selectSelectedPath = (s) => s.tree.selectedPath;
export const selectActiveNode = createSelector(
    [selectTree, selectSelectedPath],
    (tree, path) => getNodeAtPath(tree, path) || tree // fall back to root if nothing selected
);


export const selectHoverPath = (s) => s.tree.hoverPath;
export const selectVisualHelpers = (s) => s.tree.visualHelpers;

export const selectUIStates = (s) => {
    return s.tree.uiStates
};


const selectGeneratedHtml = (s) => s.tree.generatedHtml;
const selectGeneratedCss = (s) => s.tree.generatedCss;
const selectIsCodeOpen = (s) => s.tree.isCodeModalOpen;

export const selectExport = createSelector(
    [selectGeneratedHtml, selectGeneratedCss, selectIsCodeOpen],
    (html, css, isOpen) => ({ html, css, isOpen })
);

export const STATE_MAP = {
    active: { key: 'state_active', suffix: '.state_active', isPseudo: false },
    hover: { key: 'state_hover', suffix: ':hover', isPseudo: true },
    inactive: { key: 'state_inactive', suffix: '.state_inactive', isPseudo: false },
    loading: { key: 'state_loading', suffix: '.state_loading', isPseudo: false },
};