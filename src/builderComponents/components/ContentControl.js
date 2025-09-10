import React from "react";

// Combined justify-content + align-items control
export const ContentControl = ({
    direction = "row",            // "row" | "column"
    justify,                      // current justify-content
    align,                        // current align-items
    onChange,                     // (nextJustify, nextAlign) => void
}) => {
    // canonical buckets
    const AXIS_POS = ["flex-start", "center", "flex-end"]; // start/middle/end

    // is cross-axis stretched?
    const isStretch = align === "stretch";

    // cycle distribution on re-click
    const nextDistribute = (j) => {
        switch (j) {
            case "space-between": return "space-around";
            case "space-around": return "space-evenly";
            case "space-evenly": return "flex-start";
            default: return "space-between";
        }
    };

    // For ROW:
    //   columns = MAIN (left/center/right) → justify
    //   rows    = CROSS (top/middle/bottom) → align
    //
    // For COLUMN:
    //   rows    = MAIN (top/middle/bottom) → justify
    //   columns = CROSS (left/center/right) → align
    const isRow = direction === "row";

    const MAIN_AXIS = AXIS_POS;  // always start/center/end
    const CROSS_AXIS = AXIS_POS;

    // helpers to test selection:
    // map (r,c) to (justify, align) depending on direction
    const mapCellToValues = (rIdx, cIdx) => {
        if (isRow) {
            const j = MAIN_AXIS[cIdx];
            const a = isStretch ? "stretch" : CROSS_AXIS[rIdx];
            return [j, a];
        } else {
            const j = MAIN_AXIS[rIdx];
            const a = isStretch ? "stretch" : CROSS_AXIS[cIdx];
            return [j, a];
        }
    };

    const isSelectedCell = (rIdx, cIdx) => {
        const [j, a] = mapCellToValues(rIdx, cIdx);
        return j === justify && (isStretch ? true /* keep mid-row highlight feel */ : a === align);
    };

    const handleCellClick = (rIdx, cIdx) => {
        const [j, a] = mapCellToValues(rIdx, cIdx);
        // re-click → cycle justify distribution
        if (isSelectedCell(rIdx, cIdx) && !isStretch) {
            onChange(nextDistribute(j), a);
        } else {
            onChange(j, a);
        }
    };

    const toggleStretch = () => {
        onChange(justify, isStretch ? "center" : "stretch");
    };

    // label purely for title tooltips
    const rowsLbl = ["top", "center", "bottom"];
    const colsLbl = ["left", "center", "right"];

    return (
        <div className="flex-align-control">
            <div className="flex-align-toolbar">
                <button
                    type="button"
                    className={`sk_bd_btn_lock  ${isStretch ? "state_checked" : ""}`}
                    onClick={toggleStretch}
                    title="Toggle cross-axis stretch"
                >
                    {isStretch ? <i className="sport_front_icon-lock" /> : <i className="sport_front_icon-lock-off" />}
                </button>
            </div>

            <div className="flex-align-grid">
                {AXIS_POS.map((_, r) => (
                    <div className="fac_row" key={`r-${r}`}>
                        {AXIS_POS.map((__, c) => (
                            <button
                                key={`c-${c}`}
                                type="button"
                                className={`fac_cell ${isSelectedCell(r, c) ? "state_selected" : ""}`}
                                onClick={() => handleCellClick(r, c)}
                                title={`${rowsLbl[r]}-${colsLbl[c]} (${direction})`}
                            >
                                <i className="fac_dot" />
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};