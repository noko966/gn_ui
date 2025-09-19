// inspector.js — variables-first Inspector + essence picker (no state logic)

import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContentControl, HScrollRow, PxDragInput } from "../components";
import {
    editClass,
    editStyle,
    editTextContent,
    selectSelectedPath,
    setEssence,
    setEssenceBgVariant,
    setEssenceTxtVariant,
    setFlagClass,
    setIconClass,
    setLayoutType,
    setScrollType,
    setTruncateType,
} from "../store/treeSlice";
import { FLAGS_DATA, ICONS_DATA } from "../utils";

/* ---- options ---- */
const essenceOptions = [
    "body",
    "accent",
    "button",
    "buttonSecondary",
    "navbar",
    "slider",
    "subHeader",
    "dominant",
    "event",
    "eventHeader",
    "eventLive",
    "odd",
    "oddActive",
    "showMore",
    "marketHeader",
    "collapse",
    "tab",
    "tabActive",
    "menu_1",
    "menu_2",
    "menu_3",
];
const essenceBackgroundOptions = [
    "Bg",
    "BgHover",
    "Bg2",
    "Bg2Hover",
    "Bg3",
    "Bg3Hover",
    "Accent",
    "AccentTxt",
    "RGBA",
    "RGBA2",
    "RGBA3",
];
const essenceTextOptions = ["Txt", "Txt2", "Txt3", "Accent", "AccentTxt"];

/* map var → css property name (React style keys) */
const VAR_TO_PROP = {
    "--sk_el_custom_bg": "background",
    "--sk_el_custom_txt": "color",
    "--sk_el_custom_dir": "flexDirection",
    "--sk_el_custom_gap": "gap",
    "--sk_el_custom_p": "padding",
    "--sk_el_custom_radius": "borderRadius",
    "--fontSize": "fontSize",
    "--sk_el_custom_width": "width",
};

/* ================================================================== */
/*                         I N S P E C T O R                          */
/* ================================================================== */

export const Inspector = memo(function Inspector({ selectedNode }) {
    const dispatch = useDispatch();
    const selectedPath = useSelector(selectSelectedPath);

    // Locks for padding/radius
    const [lockPadding, setLockPadding] = useState(false);
    const [lockRadius, setLockRadius] = useState(false);

    // padding setters (respect lock)
    const setPaddingTop = (v) => {
        if (lockPadding) {
            ["Top", "Right", "Bottom", "Left"].forEach((side) =>
                dispatch(editStyle({ key: `padding${side}`, value: v }))
            );
        } else {
            dispatch(editStyle({ key: "paddingTop", value: v }));
        }
    };
    const setPaddingRight = (v) =>
        lockPadding
            ? ["Top", "Right", "Bottom", "Left"].forEach((side) =>
                  dispatch(editStyle({ key: `padding${side}`, value: v }))
              )
            : dispatch(editStyle({ key: "paddingRight", value: v }));
    const setPaddingBottom = (v) =>
        lockPadding
            ? ["Top", "Right", "Bottom", "Left"].forEach((side) =>
                  dispatch(editStyle({ key: `padding${side}`, value: v }))
              )
            : dispatch(editStyle({ key: "paddingBottom", value: v }));
    const setPaddingLeft = (v) =>
        lockPadding
            ? ["Top", "Right", "Bottom", "Left"].forEach((side) =>
                  dispatch(editStyle({ key: `padding${side}`, value: v }))
              )
            : dispatch(editStyle({ key: "paddingLeft", value: v }));

    // radius setters (respect lock)
    const setRadiusTL = (v) => {
        if (lockRadius) {
            ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].forEach((corner) =>
                dispatch(editStyle({ key: `border${corner}Radius`, value: v }))
            );
        } else {
            dispatch(editStyle({ key: "borderTopLeftRadius", value: v }));
        }
    };
    const setRadiusTR = (v) =>
        lockRadius
            ? ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].forEach((corner) =>
                  dispatch(editStyle({ key: `border${corner}Radius`, value: v }))
              )
            : dispatch(editStyle({ key: "borderTopRightRadius", value: v }));
    const setRadiusBR = (v) =>
        lockRadius
            ? ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].forEach((corner) =>
                  dispatch(editStyle({ key: `border${corner}Radius`, value: v }))
              )
            : dispatch(editStyle({ key: "borderBottomRightRadius", value: v }));
    const setRadiusBL = (v) =>
        lockRadius
            ? ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].forEach((corner) =>
                  dispatch(editStyle({ key: `border${corner}Radius`, value: v }))
              )
            : dispatch(editStyle({ key: "borderBottomLeftRadius", value: v }));

    if (!selectedNode) return <em>Select a node</em>;

    // read any CSS var from the selected node (base styles only here)
    const readVar = (name) => selectedNode?.styles?.[name] ?? "";

    // write var AND assign css key to use that var(); clear key when var is empty
    const setVarAndProp = (name, value) => {
        const prop = VAR_TO_PROP[name];
        // set variable itself
        dispatch(editStyle({ key: name, value }));
        // mirror to concrete prop
        if (prop) {
            const propVal = value ? `var(${name})` : "";
            dispatch(editStyle({ key: prop, value: propVal }));
        }
    };

    // current values
    const curFlag = readVar("--flagSize"); // px
    const curIcon = readVar("--icoSize"); // px
    const selectedEssence = selectedNode?.essence || "";
    const selectedLayoutType = selectedNode?.layoutType || "hug";
    const selectedScrollType = selectedNode?.scrollType || "";
    const selectedTruncationType = selectedNode?.truncationType || "";

    const curTxtRole = selectedNode?.textRole || "";
    const curBgRole = selectedNode?.bgRole || "";

    // unique radio grouping per node
    const uniq = selectedPath?.length ? selectedPath.join("_") : "root";

    const st = selectedNode.styles || {};

    const direction = selectedNode.styles?.flexDirection || "row";
    const justify = selectedNode.styles?.justifyContent || "flex-start";
    const align = selectedNode.styles?.alignItems || "center";
    const padTop = selectedNode.styles?.paddingTop || "";
    const padRight = selectedNode.styles?.paddingRight || "";
    const padBottom = selectedNode.styles?.paddingBottom || "";
    const padLeft = selectedNode.styles?.paddingLeft || "";
    const gapRow = selectedNode.styles?.rowGap || "";
    const gapCol = selectedNode.styles?.columnGap || "";
    const width = selectedNode.styles?.width || "";
    const height = selectedNode.styles?.height || "";

    const radTL = selectedNode.styles?.borderTopLeftRadius || "";
    const radTR = selectedNode.styles?.borderTopRightRadius || "";
    const radBL = selectedNode.styles?.borderBottomLeftRadius || "";
    const radBR = selectedNode.styles?.borderBottomRightRadius || "";
    const fontSize = selectedNode.styles?.fontSize || "";
    const fontWeight = selectedNode.styles?.fontWeight || "400";
    const textTransform = selectedNode.styles?.textTransform || "none";

    const setStyle = (key, value) => {
        if (selectedNode.styles?.display !== "flex") {
            dispatch(editStyle({ key: "display", value: "flex" }));
        }
        dispatch(editStyle({ key, value }));
    };

    return (
        <>
            <div className="dg_bd_layout_edit_tool_wrapper">
                <div className="dg_bd_layout_edit_tool_label">custom class</div>
                <div className="dg_bd_layout_edit_tool_wrapper_variants">
                    <input
                        className="sk_bd_input"
                        value={selectedNode.cnUser ?? selectedNode.cn ?? ""} // shows user class or legacy cn
                        onChange={(e) => dispatch(editClass(e.target.value))} // or setUserClass(...)
                        placeholder="optional class"
                    />
                </div>
            </div>

            {/* ============================ ESSENCE ========================== */}
            <div className="dg_bd_layout_edit_tool_wrapper">
                <div className="sk_bd_input_section_lbl">node essence</div>
                <HScrollRow>
                    {essenceOptions.map((ess) => (
                        <label
                            key={`ess_${ess}_${uniq}`}
                            className="sk_bd_input_radio variant_essence"
                            style={{ "--bge": `var(--${ess}Bg)`, "--txte": `var(--${ess}Txt)` }}>
                            <input
                                type="radio"
                                name={`ess_${uniq}`}
                                checked={selectedEssence === ess}
                                onChange={() => dispatch(setEssence(ess))}
                            />
                            <i className="sk_bd_input_radio_imitator"></i>
                            <span className="sk_bd_input_radio_lbl">
                                <div className="sk_bd_essence_name">{ess}</div>
                            </span>
                        </label>
                    ))}
                    <label className="sk_bd_input_radio variant_essence">
                        <input
                            type="radio"
                            name={`ess_${uniq}`}
                            checked={!selectedEssence}
                            onChange={() => dispatch(setEssence(""))}
                        />
                        <i className="sk_bd_input_radio_imitator"></i>
                        <span className="sk_bd_input_radio_lbl">none</span>
                    </label>
                </HScrollRow>
            </div>

            {/* ============================ PAINT ============================ */}

            <div className="dg_bd_layout_edit_tool_wrapper">
                <div className="sk_bd_input_section_lbl">background color</div>
                <HScrollRow>
                    {essenceBackgroundOptions.map((role) => (
                        <label
                            key={`bg_${role}_${uniq}`}
                            className="sk_bd_input_radio variant_essence"
                            style={{
                                "--bge": `var(--${selectedEssence}${role})`,
                                "--txte": `var(--${selectedEssence}Txt)`,
                            }}>
                            <input
                                type="radio"
                                name={`paintBg_${uniq}`}
                                checked={curBgRole === role}
                                onChange={() => dispatch(setEssenceBgVariant(role))}
                            />
                            <i className="sk_bd_input_radio_imitator"></i>
                            <span className="sk_bd_input_radio_lbl">
                                <div className="sk_bd_essence_name">{role}</div>
                            </span>
                        </label>
                    ))}

                    <label key={`bg_none_${uniq}`} className="sk_bd_input_radio variant_essence">
                        <input
                            type="radio"
                            name={`paintBg_${uniq}`}
                            checked={!curBgRole}
                            onChange={() => dispatch(setEssenceBgVariant(""))}
                        />
                        <i className="sk_bd_input_radio_imitator"></i>
                        <span className="sk_bd_input_radio_lbl">none</span>
                    </label>
                </HScrollRow>
            </div>

            <div className="dg_bd_layout_edit_tool_wrapper">
                <div className="sk_bd_input_section_lbl">text color</div>
                <HScrollRow>
                    {essenceTextOptions.map((role) => (
                        <label
                            key={`txt_${role}_${uniq}`}
                            className="sk_bd_input_radio variant_essence"
                            style={{
                                "--bge": `var(--${selectedEssence}Bg)`,
                                "--txte": `var(--${selectedEssence}${role})`,
                            }}>
                            <input
                                type="radio"
                                name={`paintTxt_${uniq}`}
                                checked={curTxtRole === role}
                                onChange={() => dispatch(setEssenceTxtVariant(role))}
                            />
                            <i className="sk_bd_input_radio_imitator"></i>
                            <span className="sk_bd_input_radio_lbl">
                                <div className="sk_bd_essence_name">{role}</div>
                            </span>
                        </label>
                    ))}

                    <label key={`txt_none_${uniq}`} className="sk_bd_input_radio variant_essence">
                        <input
                            type="radio"
                            name={`paintTxt_${uniq}`}
                            checked={!curTxtRole}
                            onChange={() => dispatch(setEssenceTxtVariant(""))}
                        />
                        <i className="sk_bd_input_radio_imitator"></i>
                        <span className="sk_bd_input_radio_lbl">none</span>
                    </label>
                </HScrollRow>
            </div>

            {selectedNode.type === "flag" && (
                <>
                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <label className="sk_bd_input_section_lbl">Flag Type</label>
                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <select
                                className="sk_bd_input"
                                value={selectedNode.baseCn || ""}
                                onChange={(e) => dispatch(setFlagClass({ path: selectedPath, flag: e.target.value }))}>
                                {FLAGS_DATA.map((id) => {
                                    const cn = `cHFlag f${id}`;
                                    return (
                                        <option key={id} value={cn}>
                                            {id}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">flag size</div>

                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <PxDragInput
                                value={curFlag}
                                onChange={(v) => setVarAndProp("--flagSize", v)}
                                min={0}
                                max={64}
                            />
                        </div>
                    </div>
                </>
            )}

            {selectedNode.type === "icon" && (
                <>
                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <label className="sk_bd_input_section_lbl">Icon Type</label>
                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <select
                                className="sk_bd_input"
                                value={selectedNode.baseCn || ""} // <- current icon class
                                onChange={(e) => dispatch(setIconClass({ path: selectedPath, icon: e.target.value }))}>
                                {ICONS_DATA.map((id) => {
                                    // const value = id.startsWith("dg_icon_") ? id : `dg_icon_${id}`;
                                    const value = id;
                                    const label = id.replace(/^dg_icon_/, "");
                                    return (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">icon size</div>

                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <PxDragInput
                                value={curIcon}
                                onChange={(v) => setVarAndProp("--icoSize", v)}
                                min={0}
                                max={64}
                            />
                        </div>
                    </div>
                </>
            )}

            {selectedNode.textContent && (
                <>
                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">inner text</div>
                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <input
                                className="sk_bd_input"
                                value={selectedNode.textContent || ""}
                                onChange={(e) => dispatch(editTextContent(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">font size</div>

                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <PxDragInput
                                className="sk_bd_input"
                                value={parseInt(fontSize) || 0}
                                onChange={(v) => setStyle("fontSize", v)}
                                customQuickValues={["8px", "10px", "12px", "14px"]}
                            />
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">font weight</div>

                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            {["400", "500", "700"].map((val) => (
                                <label key={val} className="sk_bd_input_radio">
                                    <input
                                        type="radio"
                                        name="dir"
                                        checked={fontWeight === val}
                                        onChange={() => setStyle("fontWeight", val)}
                                    />
                                    <i className="sk_bd_input_radio_imitator"></i>
                                    <span className="sk_bd_input_radio_lbl">{val}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">text transform</div>

                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            {["none", "uppercase", "lowercase", "capitalize"].map((val) => (
                                <label key={val} className="sk_bd_input_radio">
                                    <input
                                        type="radio"
                                        name="textTransform"
                                        checked={textTransform === val}
                                        onChange={() => setStyle("textTransform", val)}
                                    />
                                    <i className="sk_bd_input_radio_imitator"></i>
                                    <span className="sk_bd_input_radio_lbl">{val}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">truncate</div>

                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <label className="sk_bd_input_radio">
                                <input
                                    type="radio"
                                    name="truncation_mode"
                                    checked={selectedTruncationType === "row"}
                                    onChange={() => dispatch(setTruncateType("row"))}
                                />
                                <i className="sk_bd_input_radio_imitator"></i>
                                <span className="sk_bd_input_radio_lbl">{"row"}</span>
                            </label>

                            <label className="sk_bd_input_radio">
                                <input
                                    type="radio"
                                    name="truncation_mode"
                                    checked={selectedScrollType === ""}
                                    onChange={() => dispatch(setTruncateType(""))}
                                />
                                <i className="sk_bd_input_radio_imitator"></i>
                                <span className="sk_bd_input_radio_lbl">{"none"}</span>
                            </label>
                        </div>
                    </div>
                </>
            )}

            {selectedNode.type === "layout" && (
                <>
                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">size</div>
                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <label className="sk_bd_input_radio">
                                <input
                                    type="radio"
                                    name="size_mode"
                                    checked={selectedLayoutType === "fill"}
                                    onChange={() => dispatch(setLayoutType("fill"))}
                                />
                                <i className="sk_bd_input_radio_imitator"></i>
                                <span className="sk_bd_input_radio_lbl">fill</span>
                            </label>

                            <label className="sk_bd_input_radio">
                                <input
                                    type="radio"
                                    name="size_mode"
                                    checked={selectedLayoutType === "hug"}
                                    onChange={() => dispatch(setLayoutType("hug"))}
                                />
                                <i className="sk_bd_input_radio_imitator"></i>
                                <span className="sk_bd_input_radio_lbl">hug</span>
                            </label>

                            <label className="sk_bd_input_radio">
                                <input
                                    type="radio"
                                    name="size_mode"
                                    checked={selectedLayoutType === "fixed"}
                                    onChange={() => dispatch(setLayoutType("fixed"))}
                                />
                                <i className="sk_bd_input_radio_imitator"></i>
                                <span className="sk_bd_input_radio_lbl">fixed</span>
                            </label>
                        </div>
                        <div className="dg_bd_layout_edit_tool_grid_2">
                            <div className="dg_bd_layout_edit_control">
                                <div className="sk_bd_input_lbl">width</div>
                                <PxDragInput
                                    value={parseInt(width) || 0}
                                    onChange={(v) => setStyle("width", v)}
                                    name={"width"}
                                    cssProp={"width"}
                                    min={0}
                                    max={1000}
                                    customQuickValues={["100px", "200px", "400px", "800px"]}
                                />
                            </div>
                            <div className="dg_bd_layout_edit_control">
                                <div className="sk_bd_input_lbl">height</div>
                                <PxDragInput
                                    value={parseInt(height) || 0}
                                    onChange={(v) => setStyle("height", v)}
                                    name={"height"}
                                    cssProp={"height"}
                                    min={0}
                                    max={1000}
                                    customQuickValues={["100px", "200px", "400px", "800px"]}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">layout</div>
                        <div className="dg_bd_layout_edit_tool_wrapper_logical_group">
                            <div className="dg_bd_layout_edit_tool_grid_2_dir">
                                {["row", "column"].map((val) => (
                                    <label key={val} className="sk_bd_input_radio">
                                        <input
                                            type="radio"
                                            name="dir"
                                            checked={direction === val}
                                            onChange={() => setStyle("flexDirection", val)}
                                        />
                                        <i className="sk_bd_input_radio_imitator"></i>
                                        <span className="sk_bd_input_radio_lbl">{val}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="dg_bd_layout_edit_tool_grid_2_dir">
                                <ContentControl
                                    direction={direction}
                                    justify={justify}
                                    align={align}
                                    onChange={(nextJustify, nextAlign) => {
                                        setStyle("justifyContent", nextJustify);
                                        setStyle("alignItems", nextAlign);
                                    }}
                                />

                                <div className="dg_bd_layout_edit_control">
                                    <span className="sk_bd_input_lbl">{direction === "row" ? "gap x" : "gap y"}</span>
                                    <PxDragInput
                                        className="sk_bd_input"
                                        value={direction === "row" ? parseInt(gapCol) || 0 : parseInt(gapRow) || 0}
                                        onChange={(v) => setStyle(direction === "row" ? "columnGap" : "rowGap", v)}
                                        name={direction === "row" ? "columnGap" : "rowGap"}
                                        cssProp={direction === "row" ? "columnGap" : "rowGap"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">padding</div>
                        <div className="dg_bd_layout_edit_tool_grid_1_pad">
                            <div className="dg_bd_layout_edit_control">
                                <span className="sk_bd_input_lbl">Top</span>
                                <PxDragInput
                                    className="sk_bd_input"
                                    value={parseInt(padTop) || 0}
                                    onChange={setPaddingTop}
                                    name={"paddingTop"}
                                />
                            </div>
                        </div>
                        <div className="dg_bd_layout_edit_tool_grid_2_pad">
                            <div className="dg_bd_layout_edit_control">
                                <span className="sk_bd_input_lbl">Left</span>
                                <PxDragInput
                                    className="sk_bd_input"
                                    value={parseInt(padLeft) || 0}
                                    onChange={setPaddingLeft}
                                    name={"paddingLeft"}
                                />
                            </div>
                            <button
                                className={`sk_bd_btn_lock ${lockPadding ? "state_checked" : ""}`}
                                onClick={() => setLockPadding((v) => !v)}
                                title={lockPadding ? "Unlock padding" : "Lock padding (edit all sides)"}>
                                {lockPadding ? (
                                    <i className="sport_front_icon-lock" />
                                ) : (
                                    <i className="sport_front_icon-lock-off" />
                                )}
                            </button>
                            <div className="dg_bd_layout_edit_control">
                                <span className="sk_bd_input_lbl">Right</span>
                                <PxDragInput
                                    className="sk_bd_input"
                                    value={parseInt(padRight) || 0}
                                    onChange={setPaddingRight}
                                    name={"paddingRight"}
                                />
                            </div>
                        </div>

                        <div className="dg_bd_layout_edit_tool_grid_1_pad">
                            <div className="dg_bd_layout_edit_control">
                                <span className="sk_bd_input_lbl">Bottom</span>
                                <PxDragInput
                                    className="sk_bd_input"
                                    value={parseInt(padBottom) || 0}
                                    onChange={setPaddingBottom}
                                    name={"paddingBottom"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="dg_bd_layout_edit_tool_wrapper">
                        <div className="sk_bd_input_section_lbl">scroll</div>

                        <div className="dg_bd_layout_edit_tool_wrapper_variants">
                            <label className="sk_bd_input_radio">
                                <input
                                    type="radio"
                                    name="scroll_mode"
                                    checked={selectedScrollType === "horizontal"}
                                    onChange={() => dispatch(setScrollType("horizontal"))}
                                />
                                <i className="sk_bd_input_radio_imitator"></i>
                                <span className="sk_bd_input_radio_lbl">{"horizontal"}</span>
                            </label>

                            <label className="sk_bd_input_radio">
                                <input
                                    type="radio"
                                    name="scroll_mode"
                                    checked={selectedScrollType === "vertical"}
                                    onChange={() => dispatch(setScrollType("vertical"))}
                                />
                                <i className="sk_bd_input_radio_imitator"></i>
                                <span className="sk_bd_input_radio_lbl">{"vertical"}</span>
                            </label>

                            <label className="sk_bd_input_radio">
                                <input
                                    type="radio"
                                    name="scroll_mode"
                                    checked={selectedScrollType === ""}
                                    onChange={() => dispatch(setScrollType(""))}
                                />
                                <i className="sk_bd_input_radio_imitator"></i>
                                <span className="sk_bd_input_radio_lbl">{"none"}</span>
                            </label>
                        </div>
                    </div>
                </>
            )}

            {/* gap → --sk_el_custom_gap */}

            <div className="dg_bd_layout_edit_tool_wrapper">
                <div className="sk_bd_input_section_lbl">radius</div>
                <div className="dg_bd_layout_edit_tool_grid_2_rad">
                    <div className="dg_bd_layout_edit_control">
                        <span className="sk_bd_input_lbl">Top left</span>
                        <PxDragInput className="sk_bd_input" value={parseInt(radTL) || 0} onChange={setRadiusTL} />
                    </div>
                    <div></div>
                    <div className="dg_bd_layout_edit_control">
                        <span className="sk_bd_input_lbl">Top right</span>
                        <PxDragInput className="sk_bd_input" value={parseInt(radTR) || 0} onChange={setRadiusTR} />
                    </div>
                </div>
                <div className="dg_bd_layout_edit_tool_grid_2_rad">
                    <button
                        className={`sk_bd_btn_lock variant_radius ${lockRadius ? "state_checked" : ""}`}
                        onClick={() => setLockRadius((v) => !v)}
                        title={lockRadius ? "Unlock radius" : "Lock radius (edit all corners)"}>
                        {lockRadius ? (
                            <i className="sport_front_icon-lock" />
                        ) : (
                            <i className="sport_front_icon-lock-off" />
                        )}
                    </button>
                </div>

                <div className="dg_bd_layout_edit_tool_grid_2_rad">
                    <div className="dg_bd_layout_edit_control">
                        <span className="sk_bd_input_lbl">Bottom left</span>
                        <PxDragInput className="sk_bd_input" value={parseInt(radBL) || 0} onChange={setRadiusBL} />
                    </div>
                    <div></div>
                    <div className="dg_bd_layout_edit_control">
                        <span className="sk_bd_input_lbl">Bottom right</span>
                        <PxDragInput className="sk_bd_input" value={parseInt(radBR) || 0} onChange={setRadiusBR} />
                    </div>
                </div>
            </div>
        </>
    );
});
