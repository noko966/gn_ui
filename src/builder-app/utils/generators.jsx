export const elementLibrary = [
    {
        name: "flag",
        type: "flag",
        styles: { "--flagSize": "24px" },
        el: "div",
        cn: "cHFlag",
        children: null,
        preview: () => <div className="cHFlag f188" />,
    },
    {
        name: "icon",
        type: "icon",
        styles: { "--icoSize": "24px" },
        el: "i",
        cn: "dg_icon_1",
        children: null,
        preview: () => (
            <div className="dg_layout" style={{ display: "flex", gap: "4px" }}>
                <i className="dg_icon_1" />
                <i className="dg_icon_2" />
            </div>
        ),
    },
    {
        name: "text",
        type: "text",
        styles: { "--fontSize": "13px" },
        el: "span",
        cn: "dg_text",
        textContent: "lorem ipsum",
        children: null,
        preview: () => <span className="dg_text">lorem ipsum</span>,
    },
    {
        name: "action",
        type: "button",
        el: "button",
        cn: "dg_btn",
        children: null,
        textContent: "btn default",
        preview: () => (
            <button style={{ width: "80px" }} className="dg_btn">
                button
            </button>
        ),
    },
    {
        name: "input",
        type: "input",
        el: "input",
        cn: "dg_input",
        children: null,
        preview: () => <input style={{ width: "80px" }} className="dg_input" placeholder="…" />,
    },
    {
        name: "layout row",
        type: "layout",
        el: "div",
        cn: "dg_layout",
        styles: { display: "flex", columnGap: "8px", minWidth: "20px", minHeight: "20px" },
        children: [],
        preview: () => (
            <div className="dg_layout" style={{ display: "flex", gap: "6px" }}>
                <span style={{ background: "#ccc", width: "6px", height: "20px" }} />
                <span style={{ background: "#ccc", width: "6px", height: "20px" }} />
                <span style={{ background: "#ccc", width: "6px", height: "20px" }} />
            </div>
        ),
    },
    {
        name: "layout column",
        type: "layout",
        el: "div",
        cn: "dg_layout",
        styles: { display: "flex", flexDirection: "column", rowGap: "8px", minWidth: "20px", minHeight: "20px" },
        children: [],
        preview: () => (
            <div className="dg_layout" style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
                <span style={{ background: "#ccc", width: "20px", height: "6px" }} />
                <span style={{ background: "#ccc", width: "20px", height: "6px" }} />
                <span style={{ background: "#ccc", width: "20px", height: "6px" }} />
            </div>
        ),
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
