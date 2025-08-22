import React from "react";
import { DraggableNumberInput } from "draggable-number-input";

const toNum = (v) =>
    v === "" || v == null ? "" : parseFloat(String(v).replace(/px$/, "")) || 0;

const toPx = (v) => {
    if (v === "" || v == null) return "";
    const n = Number(v);
    return Number.isFinite(n) ? `${n}px` : String(v); // pass through "8px"
};

export const PxDragInput = ({
    value,              // expects "8px" | "" (string)
    onChange,           // expects string "8px" | ""
    min = 0,
    max = 200,
    showClear = true,
    name,               // radio group name (optional)
}) => {
    const handleDragChange = (n) => {
        // n is number (or possibly empty), normalize to px string
        if (n === "" || n == null) return onChange("");
        onChange(`${n}px`);
    };

    const applyQuick = (val) => {
        // val is a string like "0px", "4px"...
        onChange(val);
    };

    const clearValue = () => onChange("");

    const quickValues = ["0px", "4px", "6px", "8px"];
    const normalizedValue = toPx(value); // ensures "8" -> "8px" if ever passed

    return (
        <div className="sk_bd_input_root">
            <div className="sk_bd_input_wrapper">
                <DraggableNumberInput
                    className="sk_bd_input_drag"
                    value={toNum(value)}
                    onChange={handleDragChange}
                    min={min}
                    max={max}
                    modifierKeys={{
                        default: { multiplier: 1, sensitivity: 0.1 },
                    }}
                />
                <span className="sk_bd_input_measure">px</span>
                {showClear && (
                    <button className="sk_bd_btn_small" onClick={clearValue}>
                        clear
                    </button>
                )}
            </div>

            <div className="sk_bd_input_shortcuts_wrapper">
                {quickValues.map((val) => (
                    <label key={val} className="sk_bd_input_radio_shortcut">
                        <input
                            type="radio"
                            name={name}
                            checked={normalizedValue === val}
                            onChange={() => applyQuick(val)}
                        />
                        <span className="sk_bd_input_radio_lbl">{val}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
