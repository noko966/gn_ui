import { ALIAS } from "./constants";

/**
 * Removes the 'px' suffix from a string value.
 * @param {string|number|null|undefined} value - The value to process.
 * @returns {string} The numeric part of the value as a string, or an empty string.
 * @example
 * stripPx("10px") // returns "10"
 * stripPx(10)     // returns "10"
 */
export const stripPx = (value) => (value ? String(value).replace(/px$/, "") : "");

/**
 * Ensures a value has a 'px' suffix if it's a plain number string.
 * @param {string|number|null|undefined} value - The value to process.
 * @returns {string} The value with a 'px' suffix, the original value if not a plain number, or an empty string.
 * @example
 * ensurePx(10)     // returns "10px"
 * ensurePx("10")   // returns "10px"
 * ensurePx("10em") // returns "10em"
 */
export const ensurePx = (value) =>
    value === "" || value == null ? "" : /^\d+$/.test(String(value)) ? `${value}px` : value;

/**
 * Merges multiple class name sources into a single, space-separated string with unique classes.
 * Falsy values and empty strings are ignored.
 * @param {...(string|undefined|null)} classSources - A list of class strings to merge.
 * @returns {string} A single string of unique, trimmed class names.
 * @example
 * mergeClassNames("btn", " btn-primary ", undefined, "btn") // returns "btn btn-primary"
 */
export function mergeClassNames(...classSources) {
    const tokens = classSources
        .filter(Boolean)
        .flatMap((s) => String(s).trim().split(/\s+/))
        .filter(Boolean);

    const seen = new Set();
    const uniqueTokens = [];
    for (const token of tokens) {
        if (!seen.has(token)) {
            seen.add(token);
            uniqueTokens.push(token);
        }
    }
    return uniqueTokens.join(" ");
}

/**
 * Checks if a path array represents the root.
 * @param {Array} path - The path array.
 * @returns {boolean} True if the path is empty.
 */
export const isRoot = (path) => path.length === 0;

/**
 * Retrieves a nested node from a tree-like structure using a path of indices.
 * Note: Uses recursion, which may cause stack overflow on extremely deep trees.
 * @param {Object} node - The root node of the tree.
 * @param {number[]} path - An array of child indices representing the path.
 * @returns {Object} The node at the specified path.
 */
export const getNodeAtPath = (node, path) =>
    path.length === 0 ? node : getNodeAtPath(node.children[path[0]], path.slice(1));

/**
 * Checks if a node is of the 'layout' type.
 * @param {Object|null|undefined} node - The node to check.
 * @returns {boolean} True if the node's type is "layout".
 */
export const isLayoutNode = (node) => node?.type === "layout";

/**
 * Checks if two path arrays are identical.
 * @param {number[]} a - The first path array.
 * @param {number[]} b - The second path array.
 * @returns {boolean} True if the paths are equivalent.
 */
export const pathEq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

/**
 * Converts a space-separated class string into a single CSS selector.
 * This creates a selector that matches an element having ALL the classes.
 * @param {string} classString - The space-separated class names.
 * @returns {string} A CSS selector string.
 * @example
 * classesToSelector("btn primary-btn") // returns ".btn.primary-btn"
 */
export const classesToSelector = (classString) =>
    classString
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => `.${token}`)
        .join("");

/**
 * Determines the semantic kind of a node, preferring its semantic `type` over its HTML `el` tag name.
 * @param {Object|null|undefined} node - The node object to analyze.
 * @param {string} [node.type] - The semantic type of the node (preferred).
 * @param {string} [node.el] - The HTML element tag name (fallback).
 * @returns {string} The node kind (e.g., "button", "div", or "node" as a fallback).
 */
const childKind = (node) => {
    if (!node) return "node";
    if (node.type) return node.type;
    if (node.el) return String(node.el).toLowerCase();
    return "node";
};

/**
 * Removes consecutive duplicate values from an array, preserving order.
 * @param {Array<any>} arr - The array to process.
 * @returns {Array<any>} A new array with consecutive duplicates removed.
 * @example
 * collapseConsecutive(['layout','layout','icon','text','text']) // returns ['layout','icon','text']
 */
const collapseConsecutive = (arr) => arr.filter((x, i) => i === 0 || x !== arr[i - 1]);

/**
 * Builds an auto-generated CSS wrapper class for a layout node based on its children's types.
 * The class name is based on the sequence of child types, with consecutive duplicates collapsed.
 * It uses aliases from the ALIAS constant to shorten type names.
 * @param {Object} node - The node object to analyze.
 * @param {string} node.type - Must be "layout" for the class to be generated.
 * @param {Array<Object>} [node.children] - Array of child nodes.
 * @returns {string} A generated wrapper class (e.g., "dg_ico_txt_wrapper") or an empty string if not applicable.
 */
function computeAutoWrapperClass(node) {
    if (node?.type !== "layout" || !Array.isArray(node.children) || node.children.length === 0) {
        return "";
    }

    const rawChildKinds = node.children.map(childKind).filter(Boolean);
    const collapsedKinds = collapseConsecutive(rawChildKinds);
    if (collapsedKinds.length === 0) return "";

    // Use alias from constants or the first letter of the kind as a fallback
    const shortened = collapsedKinds.map((kind) => ALIAS[kind] || kind[0]);
    return `dg_${shortened.join("_")}_wrapper`;
}

/**
 * Combines all CSS class sources for a node into a final, normalized class string.
 * Merges base, user-defined, auto-generated, and variant classes, ensuring uniqueness.
 * @param {Object} node - The node object containing class information.
 * @param {string} [node.baseCn] - Base CSS class names.
 * @param {string} [node.cn] - Alternative base CSS class names (used if baseCn is absent).
 * @param {string} [node.cnUser] - User-defined CSS class names.
 * @param {string} [node.variantClass] - Variant-specific CSS class names.
 * @param {string} [node.type] - Node type, used for auto-wrapper class generation.
 * @returns {string} Normalized, space-separated CSS class string.
 * @example
 * getEffectiveClass({
 *   baseCn: "btn",
 *   cnUser: "custom-btn",
 *   variantClass: "primary",
 *   type: "layout",
 *   children: [{type: "icon"}]
 * }) // returns "btn custom-btn dg_ico_wrapper primary"
 */
export function getEffectiveClass(node) {
    if (!node) return "";
    const autoWrapperClass = computeAutoWrapperClass(node);
    return mergeClassNames(node.baseCn, node.cn, node.cnUser, autoWrapperClass, node.variantClass);
}
