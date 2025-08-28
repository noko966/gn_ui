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
        paddingTop: "6px",
        paddingBottom: "6px",
        paddingRight: "8px",
        paddingLeft: "8px",
        background: "var(--eventBg)",
        color: "var(--eventTxt)",
    },
    children: [
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_layout",
            children: [{ el: "i", type: "icon", cn: "dg_icon_1", children: null }],
        },
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_layout",
            styles: { display: "flex", flexDirection: "column", gap: "4px" },
            children: [
                {
                    name: "layout",
                    type: "layout",
                    el: "div",
                    cn: "dg_layout",
                    children: [{ el: "span", type: "text", cn: "dg_text", children: null, textContent: "text piece 1" }],
                },
                {
                    name: "layout",
                    type: "layout",
                    el: "div",
                    cn: "dg_layout",
                    children: [{ el: "span", type: "text", cn: "dg_text", children: null, textContent: "text piece 2" }],
                },
            ],
        },
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_layout",
            children: [{ el: "i", type: "icon", cn: "dg_icon_arrow_down", children: null }],
        },
        {
            name: "layout",
            type: "layout",
            el: "div",
            cn: "dg_layout",
            children: [{ name: "action", type: "button", el: "button", cn: "dg_btn", children: null, textContent: "btn default" }],
        },
    ],
};

/* ----------------------- helpers (mutable) -------------------- */


const getNodeAtPath = (node, path) => {
    let n = node;
    for (let i = 0; i < path.length; i++) {
        if (!n?.children || !n.children[path[i]]) return null;
        n = n.children[path[i]];
    }
    return n;
};

function recalcVariantForNode(state, path) {
    if (!Array.isArray(path) || path.length === 0) {
        // No parent → root cannot have a variant
        const root = getNodeAtPath(state.tree, []);
        if (root) delete root.variantClass;
        return;
    }
    const node = getNodeAtPath(state.tree, path);
    const parent = getNodeAtPath(state.tree, path.slice(0, -1));
    if (!node || !parent) return;

    const base = sameBaseClass(node);
    if (!base) {
        delete node.variantClass;
        return;
    }

    const group = siblingsWithSameBase(parent, base);
    if (group.length <= 1) {
        delete node.variantClass;
        return;
    }

    const idxInGroup = group.findIndex((g) => g.n === node);
    node.variantClass = computeVariantByIndex(idxInGroup, group.length);
}

const sameBaseClass = (node) => (node?.baseCn || node?.cn || "").trim();

function siblingsWithSameBase(parent, base) {
    if (!parent?.children) return [];
    return parent.children
        .map((n, i) => ({ n, i }))
        .filter(({ n }) => sameBaseClass(n) === base);
}

// Compute variant by index inside the group
function computeVariantByIndex(idx, len) {
    if (len <= 1) return "";               // no variant if only one
    if (idx === 0) return "variant_first";
    if (idx === len - 1) return "variant_last";
    return `variant_${idx + 1}`;           // middle ones get index
}

function recalcVariantForGroup(state, path) {
    if (!Array.isArray(path) || path.length === 0) return; // skip root
    const parentPath = path.slice(0, -1);
    const parent = getNodeAtPath(state.tree, parentPath);
    const node = getNodeAtPath(state.tree, path);
    if (!parent || !node) return;

    const base = sameBaseClass(node);
    if (!base) {
        delete node.variantClass;
        return;
    }

    const group = siblingsWithSameBase(parent, base);
    // if only one in the group → clear all their variantClass
    if (group.length <= 1) {
        group.forEach(({ n }) => delete n.variantClass);
        return;
    }

    // assign first/last/middle consistently by DOM order
    group.forEach(({ n, i }, idx) => {
        const v = computeVariantByIndex(idx, group.length);
        if (v) n.variantClass = v; else delete n.variantClass;
    });
}

const shortSuffix = (key, value) => {
    if (!value) return "";
    // pick shortest token from value
    if (typeof value === "string") {
        // e.g. var(--accentTxt3) → txt3
        const match = value.match(/--([a-zA-Z0-9_-]+)\)/);
        if (match) return "_" + match[1].toLowerCase();
        return "_" + key.slice(0, 3).toLowerCase();
    }
    return "_" + key.slice(0, 3).toLowerCase();
}


const makeLayoutParent = (overrides = {}) => ({
    name: "layout",
    type: "layout",
    el: "div",
    cn: "dg_layout",
    styles: { display: "flex", gap: "8px", minWidth: "20px", minHeight: "20px" },
    children: [],
    ...overrides,
});


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
        setIconClass(state, action) {
            const { path, icon } = action.payload; // icon can be "dg_icon_arrow_down" or just "arrow_down"
            const node = getNodeAtPath(state.tree, path);
            if (!node || node.type !== "icon") return;

            // const full = icon.startsWith("dg_icon_") ? icon : `dg_icon_${icon}`;
            const full = icon;
            node.el = "i";              // make sure it's an <i>
            node.baseCn = full;         // render/export uses baseCn
            delete node.variantClass;   // clear any auto-variant if you use those
        },
        setFlagClass(state, action) {

            const { path, flag } = action.payload; // icon can be "dg_icon_arrow_down" or just "arrow_down"
            const node = getNodeAtPath(state.tree, path);
            console.log(node);

            if (!node || node.type !== "flag") return;

            // const full = icon.startsWith("dg_icon_") ? icon : `dg_icon_${icon}`;
            node.el = "div";              // make sure it's an <i>
            node.baseCn = flag;         // render/export uses baseCn
            delete node.variantClass;   // clear any auto-variant if you use those
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
            const path = state.selectedPath;
            const node = getNodeAtPath(state.tree, path);
            if (!node) return;

            node.styles ||= {};
            if (value === "" || value == null) delete node.styles[key];
            else node.styles[key] = value;

            // Recompute variant after style change
            recalcVariantForNode(state, path);
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


        setScrollType(state, action) {
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;

            if (node.type !== "layout") return;

            const payload = typeof action.payload === "string"
                ? { type: action.payload }
                : (action.payload || {});

            const currentClasses = (node.cnUser || node.cn || "").split(/\s+/).filter(Boolean);

            // remove scroll classes
            const filtered = currentClasses.filter(c => c !== "dg_scrollbar_x" && c !== "dg_scrollbar_y");

            const kind = payload.type || "";

            node.styles = { ...(node.styles || {}) };

            switch (kind) {
                case "horizontal":
                    node.cnUser = [...filtered, "dg_scrollbar_x"].join(" ");
                    node.styles.overflowX = "auto";
                    node.styles.overflowY = "hidden";
                    node.styles.width = "100%";
                    break;

                case "vertical":
                    node.cnUser = [...filtered, "dg_scrollbar_y"].join(" ");
                    node.styles.overflowX = "hidden";
                    node.styles.overflowY = "auto";
                    node.styles.height = "100%";
                    break;
                default:
                    node.cnUser = filtered.join(" ");
                    delete node.styles.overflowX;
                    delete node.styles.overflowY;
                    delete node.styles.height;
                    delete node.styles.width;
                    break;
            }

            node.scrollType = kind;
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

            recalcVariantForGroup(state, state.selectedPath);
        },
        // treeSlice.js
        editClass(state, action) {
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;
            console.log(node.cnUser, node.cn);

            // If your app uses user class in this reducer:
            if ("baseCn" in node) node.cnUser = (action.payload || "").trim();
            else node.cn = (action.payload || "").trim();

            // user typed a class → drop variant class
            delete node.variantClass;
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
        setEqualChildrenCount(state, action) {
            const { path, count } = action.payload; // path = parent layout_equal
            const n = Math.max(1, Number(count) || 1);

            const parent = getNodeAtPath(state.tree, path);
            if (!parent || parent.subType !== "layout_equal") return;

            parent.equalCount = n;

            // only ensure children that are *layout* types
            const children = Array.isArray(parent.children) ? parent.children : [];
            const layoutKids = children.filter(ch => ch && ch.type === "layout");
            const nonLayoutKids = children.filter(ch => !ch || ch.type !== "layout"); // preserve any non-layouts untouched (usually empty)

            if (layoutKids.length > n) {
                // trim from the end
                layoutKids.length = n;
            } else if (layoutKids.length < n) {
                const toAdd = n - layoutKids.length;
                for (let i = 0; i < toAdd; i++) {
                    layoutKids.push({
                        name: "layout",
                        type: "layout",
                        el: "div",
                        cn: "dg_token_wrapper",
                        styles: {},
                        children: []
                    });
                }
            }

            parent.children = [...layoutKids, ...nonLayoutKids];
        },
        setUserClass(state, action) {
            const node = getNodeAtPath(state.tree, state.selectedPath);
            if (!node) return;
            // support both shapes
            if ("baseCn" in node) node.cnUser = (action.payload || "").trim();
            else node.cn = (action.payload || "").trim();

            // user took control → remove auto variant
            delete node.variantClass;
        },
        wrapSelectedInLayout(state, action) {
            // optional customization for the new parent
            const { parentProps } = action.payload || {};

            const selPath = state.selectedPath;
            if (!Array.isArray(selPath)) return;

            // Wrap ROOT
            if (selPath.length === 0) {
                const oldRoot = state.tree;
                const newParent = makeLayoutParent(parentProps);
                newParent.children = [oldRoot];
                state.tree = newParent;
                // Select the new wrapper (now root)
                state.selectedPath = [];
                state.hoverPath = [];
                return;
            }

            // Wrap NON-ROOT
            const parentPath = selPath.slice(0, -1);
            const idx = selPath[selPath.length - 1];

            const parent = getNodeAtPath(state.tree, parentPath);
            if (!parent || !Array.isArray(parent.children) || !parent.children[idx]) return;

            const nodeToWrap = parent.children[idx];
            const newParent = makeLayoutParent(parentProps);
            newParent.children = [nodeToWrap];

            // Replace the original node with the new parent
            parent.children[idx] = newParent;

            // Select the new parent
            state.selectedPath = [...parentPath, idx];
            state.hoverPath = [...parentPath, idx];
        },

    },

});

export const {
    setSelectedPath,
    setHoverPath,
    setUserClass,
    toggleVisualHelpers,
    insertAfter,
    insertAsChild,
    removeAtPath,
    swapSiblings,
    editStyle,
    setLayoutType,
    setScrollType,
    setEssence,
    setEssenceTxtVariant,
    applyEssenceTextRole,
    editClass,
    setIconClass,
    editTextContent,
    setGenerated,
    openCodeModal,
    closeCodeModal,
    setUIState,
    setPosition,
    setClassName,
    setFlagClass,
    setEqualChildrenCount,
    wrapSelectedInLayout
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