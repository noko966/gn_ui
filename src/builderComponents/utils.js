export const getNum = (v) => (v ? String(v).replace(/px$/, "") : "");
export const ensurePx = (v) => (v === "" || v == null ? "" : /^\d+$/.test(String(v)) ? `${v}px` : v);