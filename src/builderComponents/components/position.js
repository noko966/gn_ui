import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { selectTree, selectSelectedPath, setPosition } from "../features/treeSlice";
import { getNum, ensurePx } from "../utils";




export function PositionControl({ selectedNode }) {
    const dispatch = useDispatch();
    const tree = useSelector(selectTree);
    const selectedPath = useSelector(selectSelectedPath, shallowEqual);

    // derive current edge & offset from node (fall back from styles if needed)
    const currentEdge =
        selectedNode?.absEdge ||
        (() => {
            const st = selectedNode?.styles || {};
            if (st.top != null && st.left != null) return "top-left";
            if (st.top != null && st.right != null) return "top-right";
            if (st.bottom != null && st.left != null) return "bottom-left";
            if (st.bottom != null && st.right != null) return "bottom-right";
            return "top-left";
        })();

    const currentOffset =
        (selectedNode?.absOffset ||
            selectedNode?.styles?.top ||
            selectedNode?.styles?.left ||
            selectedNode?.styles?.right ||
            selectedNode?.styles?.bottom ||
            "0px");

    const [offset, setOffset] = React.useState(getNum(currentOffset));

    React.useEffect(() => {
        setOffset(getNum(currentOffset));
    }, [currentOffset, selectedNode]);

    const commitOffset = () => {
        const val = offset === "" ? 0 : Number.isNaN(+offset) ? offset : +offset;
        dispatch(setPosition({ edge: currentEdge, offset: val }));
    };

    const chooseEdge = (edge) => {
        const val = offset === "" ? 0 : Number.isNaN(+offset) ? offset : +offset;
        dispatch(setPosition({ edge, offset: val }));
    };

    return (
        <div className="dg_bd_layout_edit_tool_wrapper">
            <div className="dg_bd_layout_edit_tool_label">position</div>

            {/* Edge radios */}
            <div className="dg_bd_layout_edit_tool_wrapper_variants">
                {[
                    { k: "top-left", lbl: "top-left" },
                    { k: "top-right", lbl: "top-right" },
                    { k: "bottom-left", lbl: "bottom-left" },
                    { k: "bottom-right", lbl: "bottom-right" },
                ].map(({ k, lbl }) => (
                    <label key={k} className="sk_bd_input_radio">
                        <input
                            type="radio"
                            name="abs_corner"
                            checked={currentEdge === k}
                            onChange={() => chooseEdge(k)}
                        />
                        <i className="sk_bd_input_radio_imitator"></i>
                        <span className="sk_bd_input_radio_lbl">{lbl}</span>
                    </label>
                ))}
            </div>

            {/* Offset */}
            <div className="dg_bd_layout_edit_tool_wrapper_variants" style={{ marginTop: 6 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <input
                        className="sk_bd_input"
                        type="number"
                        value={offset}
                        onChange={(e) => setOffset(e.target.value)}
                        onBlur={commitOffset}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") commitOffset();
                        }}
                        style={{ width: 100 }}
                    />
                    px
                </span>
            </div>


        </div>
    );
}
