
import React from "react";
import { DraggableNumberInput } from "draggable-number-input";

export const PxDragInput = ({
    value,
    onChange,
    min = 0,
    max = 200,
    showClear = true,
}) => {
    const toNum = (v) =>
        v === "" || v == null ? "" : parseFloat(String(v).replace(/px$/, "")) || 0;

    const handleChange = (n) => {
        // library gives us a number; keep empty if user cleared
        if (n === "" || n == null) return onChange("");
        onChange(`${n}px`);
    };

    const clearValue = () => onChange("");

    return (
        <div className="sk_bd_input_wrapper">

            <DraggableNumberInput
                className="sk_bd_input_drag"
                value={toNum(value)}
                onChange={handleChange}
                min={min}
                max={max}
                modifierKeys={{
                    default: { multiplier: 1, sensitivity: 0.1 },
                }}
            />
            <span className="sk_bd_input_measure">px</span>
            {showClear && (
                <button
                    className="sk_bd_btn_small"
                    onClick={clearValue}
                >
                    clear
                </button>
            )}
        </div>
    );
};
