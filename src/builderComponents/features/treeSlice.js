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
        background: "var(--eventBg)",
        color: "var(--eventTxt)",
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
                    children: [{ el: "span", type: "text", cn: "dg_text", children: "text piece 1" }],
                },
                {
                    name: "layout",
                    type: "layout",
                    el: "div",
                    cn: "dg_token_wrapper",
                    children: [{ el: "span", type: "text", cn: "dg_text", children: "text piece 2" }],
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
            children: [{ name: "action", type: "button", el: "button", cn: "dg_btn", children: "btn default" }],
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

        setEssence(state, action) {
            const name = action.payload;
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;
            node.essence = name || undefined;
            node.styles = {
                ...(node.styles || {}),
                background: name ? `var(--${name}Bg)` : "",
                color: name ? `var(--${name}Txt)` : "",
            };
        },
        applyEssenceTextRole(state, action) {
            const role = action.payload;
            const essence = closestEssenceName(state.tree, state.selectedPath);
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;
            node.styles = { ...(node.styles || {}) };
            if (!role) {
                delete node.styles.color;
                delete node.textRole;
            } else if (essence) {
                node.styles.color = `var(--${essence}${role})`;
                node.textRole = role;
            }
        },
        editClass(state, action) {
            const cls = action.payload;
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;
            node.cn = cls;
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
    setEssence,
    applyEssenceTextRole,
    editClass,
    setGenerated,
    openCodeModal,
    closeCodeModal,
    setUIState,
} = treeSlice.actions;

export default treeSlice.reducer;

/* ----------------- selectors ---------------- */
export const selectTree = (s) => s.tree.tree;
export const selectSelectedPath = (s) => s.tree.selectedPath;
export const selectHoverPath = (s) => s.tree.hoverPath;
export const selectVisualHelpers = (s) => s.tree.visualHelpers;

export const selectUIStates = (s) => {
    console.log(s.tree);
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