export const getNum = (v) => (v ? String(v).replace(/px$/, "") : "");
export const ensurePx = (v) => (v === "" || v == null ? "" : /^\d+$/.test(String(v)) ? `${v}px` : v);

// Short tokens for types
const TYPE_ABBR = {
    layout: "lay",
    icon: "ico",
    text: "txt",
    flag: "los",    // you asked for dg_los_wrapper
    button: "btn",
    input: "inp",
};

// Fallback for unknown types
const abbrFor = (type = "") => TYPE_ABBR[type] || (type ? type.slice(0, 3) : "unk");

// Build a short “auto-wrapper” class from direct children.
// - Counts each child type
// - Pluralizes token if count > 1 (e.g. lay → lays)
// - Joins tokens with '_' and prefixes with "dg_"
// - Example: children [icon, text, layout, layout] -> "dg_ico_txt_lays_wrapper"
export function buildAutoWrapperClass(node) {
    if (!node || !Array.isArray(node.children) || node.children.length === 0) {
        return "dg_slot_wrapper"; // nothing inside
    }

    // Count types
    const counts = {};
    for (const ch of node.children) {
        if (!ch) continue;
        const t = (ch.type || ch.el || "").toString().toLowerCase();
        if (!t) continue;
        counts[t] = (counts[t] || 0) + 1;
    }

    const tokens = Object.entries(counts)
        // keep a stable order: layouts first, then others by name
        .sort(([a], [b]) => (a === "layout" ? -1 : b === "layout" ? 1 : a.localeCompare(b)))
        .map(([t, n]) => {
            const base = abbrFor(t);
            return n > 1 ? `${base}s` : base;
        });

    if (tokens.length === 0) return "dg_slot_wrapper";

    const cls = `dg_${tokens.join("_")}_wrapper`;
    // squash accidental repeats like dg_lay_lay_wrapper -> dg_lays_wrapper
    return cls.replace(/(_lay)(_lay)+/g, "_lays");
}

// Merge class names (base + user + auto), keep them unique and trimmed
export function mergeClassNames(...pieces) {
    const tokens = pieces
        .filter(Boolean)
        .flatMap(s => String(s).trim().split(/\s+/))
        .filter(Boolean);

    const seen = new Set();
    const out = [];
    for (const t of tokens) {
        if (!seen.has(t)) {
            seen.add(t);
            out.push(t);
        }
    }
    return out.join(" ");
}


export const elementLibrary = [
    { name: "flag", type: "flag", styles: { "--flagSize": "24px" }, el: "div", cn: "cHFlag", children: null },
    { name: "icon", type: "icon", styles: { "--icoSize": "24px" }, el: "i", cn: "dg_icon_1", children: null },
    { name: "text", type: "text", styles: { "--fontSize": "13px" }, el: "span", cn: "dg_text", textContent: "lorem ipsum", children: null },
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
        name: "scroller",
        type: "layout",
        el: "div",
        cn: "dg_scroller",
        styles: { overflowY: "auto", overflowX: "hidden", height: "100%" },
        children: [],
    },
];


export const isRoot = (p) => p.length === 0;
export const getNodeAtPath = (node, path) =>
    path.length === 0 ? node : getNodeAtPath(node.children[path[0]], path.slice(1));
export const isLayoutNode = (n) => n?.type === "layout";
export const pathEq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
export const skify = (cls) => cls.trim().split(/\s+/).filter(Boolean).map((t) => `.${t}`).join("");
