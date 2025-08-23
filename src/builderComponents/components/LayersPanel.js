// components/LayersPanel.jsx
import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
    selectTree,
    selectSelectedPath,
    selectHoverPath,
    setSelectedPath,
    setHoverPath,
    removeAtPath,
    swapSiblings,
} from "../features/treeSlice";

const pathKey = (p) => (p.length ? p.join(".") : "root");
const isLayout = (n) => n?.type === "layout";

function NodeRow({
    node,
    path,
    depth,
    expandedSet,
    toggleExpand,
    selectedPath,
    hoverPath,
    onSelect,
    onHover,
    onRemove,
    onMoveUp,
    onMoveDown,
}) {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    const expanded = expandedSet.has(pathKey(path));
    const selected = JSON.stringify(path) === JSON.stringify(selectedPath);
    const hovered = JSON.stringify(path) === JSON.stringify(hoverPath);

    const label = (() => {
        const tag = node.el || "div";
        const cn = node.cn ? `.${node.cn.replace(/\s+/g, " .")}` : "";
        const type = node.type ? ` [${node.type}]` : "";
        const txt =
            node.textContent && !hasChildren ? ` — "${String(node.textContent).slice(0, 24)}"` : "";
        return `<${tag}${cn}>${type}${txt}`;
    })();

    return (
        <div
            className={
                "sk_layers_row" +
                (selected ? " state_selected" : "") +
                (hovered ? " state_hover" : "")
            }
            style={{ paddingLeft: depth * 8 }}
            onMouseEnter={() => onHover(path)}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(path);
            }}
        >
            <div className="sk_layer_item">
                {/* disclosure */}
                <button
                    className={"sk_layers_disclosure" + (hasChildren ? "" : " is_invisible")}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) toggleExpand(path);
                    }}
                    title={expanded ? "Collapse" : "Expand"}
                >
                    {expanded ? <i className="dg_icon_angle_bottom" /> : <i className="dg_icon_angle_right" />}
                </button>

                {/* type chip */}
                <span className={"sk_layers_chip " + (isLayout(node) ? "chip_layout" : "chip_elem")}>
                    {node.type.charAt(0).toUpperCase() || "-"}
                </span>

                {/* name/preview */}
                <span className="sk_layers_label" title={label}>
                    {node.cn || node.el || "node"}
                </span>

                {/* quick actions */}
                <span className="sk_layers_actions">
                    <button
                        className="sk_layers_btn"
                        title="Move up"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveUp(path);
                        }}
                    >
                        ↑
                    </button>
                    <button
                        className="sk_layers_btn"
                        title="Move down"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveDown(path);
                        }}
                    >
                        ↓
                    </button>
                    {path.length > 0 && (
                        <button
                            className="sk_layers_btn danger"
                            title="Remove"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(path);
                            }}
                        >
                            ✕
                        </button>
                    )}
                </span>
            </div>
            {/* children */}
            {hasChildren && expanded && (
                <div className="sk_layers_children">
                    {node.children.map((child, idx) => (
                        <NodeRow
                            key={pathKey([...path, idx])}
                            node={child}
                            path={[...path, idx]}
                            depth={depth + 1}
                            expandedSet={expandedSet}
                            toggleExpand={toggleExpand}
                            selectedPath={selectedPath}
                            hoverPath={hoverPath}
                            onSelect={onSelect}
                            onHover={onHover}
                            onRemove={onRemove}
                            onMoveUp={onMoveUp}
                            onMoveDown={onMoveDown}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function LayersPanel() {
    const dispatch = useDispatch();
    const tree = useSelector(selectTree, shallowEqual);
    const selectedPath = useSelector(selectSelectedPath, shallowEqual);
    const hoverPath = useSelector(selectHoverPath, shallowEqual);

    // local expand/collapse state (Set of serialized paths)
    const [expanded, setExpanded] = React.useState(() => new Set(["root"]));
    const toggleExpand = (path) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            const key = pathKey(path);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const onSelect = (path) => dispatch(setSelectedPath(path));
    const onHover = (path) => dispatch(setHoverPath(path));
    const onRemove = (path) => dispatch(removeAtPath(path));
    const onMoveUp = (path) => dispatch(swapSiblings({ path, dir: -1 }));
    const onMoveDown = (path) => dispatch(swapSiblings({ path, dir: 1 }));

    return (
        <div className="sk_layers_root">
            <div className="sk_bd_header">Layers</div>
            <div className="sk_layers_scroll">
                <NodeRow
                    node={tree}
                    path={[]}
                    depth={0}
                    expandedSet={expanded}
                    toggleExpand={toggleExpand}
                    selectedPath={selectedPath}
                    hoverPath={hoverPath}
                    onSelect={onSelect}
                    onHover={onHover}
                    onRemove={onRemove}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                />
            </div>
        </div>
    );
}
