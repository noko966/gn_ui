import { func } from 'prop-types';
import React, { useState } from 'react';

const initialTree = {
    el: 'div',
    cn: 'container',
    styles: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px'
    },
    children: [
        {
            el: 'i',
            cn: 'icon_4 dg_icon_',
            children: null,
        },
        {
            el: 'span',
            cn: 'text',
            styles: { color: 'white' },
            children: 'Hello World'
        },
        {
            el: 'i',
            cn: 'dg_icon_arrow_down',
            children: null,
        },
    ]
};

const elementLibrary = [
    { name: 'flag', el: 'div', cn: 'cHFlag ', children: null },
    { name: 'icon', el: 'i', cn: 'dg_icon_ ', children: null },
    { name: 'text', el: 'span', cn: 'dg_text_ ', children: 'text default' },
    { name: 'action', el: 'button', cn: 'dg_btn', children: 'btn text default' },
];

const essenceOptions = ['event', 'alert', 'primary', 'secondary'];

export default function TreeEditor() {
    const [treeState, setTreeState] = useState(initialTree);
    const [selectedPath, setSelectedPath] = useState([]);
    const [newClass, setNewClass] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [generatedCss, setGeneratedCss] = useState('');
    const [selectedElement, setSelectedElement] = useState(elementLibrary[0]);
    const [customText, setCustomText] = useState('');
    const [selectedEssence, setSelectedEssence] = useState('');

    const renderRealNode = (node, path = []) => {
        const isSelected = JSON.stringify(path) === JSON.stringify(selectedPath);
        const Tag = node.el || 'div';
        const style = node.styles || {};
        const className = node.cn || '';

        const handleClick = (e) => {
            e.stopPropagation();
            setSelectedPath(path);
        };

        const children = Array.isArray(node.children)
            ? node.children.map((child, i) => renderRealNode(child, [...path, i]))
            : node.children;

        return (
            <Tag
                key={path.join('-')}
                className={className + (isSelected ? ' state_selected_node' : '')}
                style={style}
                onClick={handleClick}
            >
                {children}
            </Tag>
        );
    };

    function updateNodeAtPath(tree, path, updater) {
        if (path.length === 0) return updater(tree);
        const [head, ...rest] = path;
        return {
            ...tree,
            children: tree.children.map((child, i) =>
                i === head ? updateNodeAtPath(child, rest, updater) : child
            ),
        };
    }

    function removeNodeAtPath(tree, path) {
        const parentPath = path.slice(0, -1);
        const indexToRemove = path[path.length - 1];
        return updateNodeAtPath(tree, parentPath, (parent) => ({
            ...parent,
            children: parent.children.filter((_, i) => i !== indexToRemove),
        }));
    }

    function insertNodeAfterPath(tree, path, newNode) {
        const parentPath = path.slice(0, -1);
        const index = path[path.length - 1];
        return updateNodeAtPath(tree, parentPath, (parent) => ({
            ...parent,
            children: [
                ...parent.children.slice(0, index + 1),
                newNode,
                ...parent.children.slice(index + 1),
            ],
        }));
    }

    function swapSiblings(tree, path, dir) {
        const parentPath = path.slice(0, -1);
        const index = path[path.length - 1];
        const target = index + dir;
        return updateNodeAtPath(tree, parentPath, (parent) => {
            const children = [...parent.children];
            if (target < 0 || target >= children.length) return parent;
            [children[index], children[target]] = [children[target], children[index]];
            return { ...parent, children };
        });
    }

    function handleRemove() {
        setTreeState(removeNodeAtPath(treeState, selectedPath));
        setSelectedPath([]);
    }

    function handleAddAfter() {
        const newNode = {
            ...selectedElement,
            children: selectedElement.children === 'text default' ? customText : selectedElement.children,
        };
        setTreeState(insertNodeAfterPath(treeState, selectedPath, newNode));
    }

    function handleEditClass(newClassName) {
        setTreeState(updateNodeAtPath(treeState, selectedPath, (node) => ({
            ...node,
            cn: newClassName
        })));
    }

    function handleEditStyle(key, value) {
        setTreeState(updateNodeAtPath(treeState, selectedPath, (node) => ({
            ...node,
            styles: { ...node.styles, [key]: value }
        })));
    }

    function handleEssenceChange(name) {
        setTreeState(updateNodeAtPath(treeState, selectedPath, (node) => ({
            ...node,
            styles: {
                ...node.styles,
                background: `var(--${name}Bg)`,
                color: `var(--${name}Txt)`
            }
        })));
        setSelectedEssence(name);
    }

    function moveNode(dir) {
        setTreeState(swapSiblings(treeState, selectedPath, dir));
        setSelectedPath(prev => {
            const newPath = [...prev];
            newPath[newPath.length - 1] += dir;
            return newPath;
        });
    }

    function generateHtml(node, indent = 0) {
        if (!node) return '';
        const tab = '  '.repeat(indent);
        const tag = node.el || 'div';
        const className = node.cn ? ` class="sk_${node.cn}"` : '';
        const children = Array.isArray(node.children)
            ? '\n' + node.children.map(child => generateHtml(child, indent + 1)).join('') + tab
            : (node.children || '');
        return `${tab}<${tag}${className}>${children}</${tag}>\n`;
    }

    function generateCss(node, stylesMap = {}) {
        if (node?.cn && node?.styles) {
            stylesMap[`sk_${node.cn}`] = { ...stylesMap[`sk_${node.cn}`], ...node.styles };
        }
        if (Array.isArray(node.children)) {
            node.children.forEach(child => generateCss(child, stylesMap));
        }
        return stylesMap;
    }

    function stylesToCssText(styles) {
        return Object.entries(styles)
            .map(([key, value]) => `${camelToKebab(key)}: ${value};`)
            .join('\n  ');
    }

    function camelToKebab(str) {
        return str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
    }

    function exportHTMLCSS(tree) {
        const html = generateHtml(tree);
        const stylesMap = generateCss(tree);
        const css = Object.entries(stylesMap)
            .map(([className, styles]) => `.${className} {\n  ${stylesToCssText(styles)}\n}`)
            .join('\n\n');
        setGeneratedHtml(html);
        setGeneratedCss(css);
    }

    function RenderPaletteElement(node) {
        const Tag = node.el || 'div';
        return <Tag
            className={`${node.cn}`}
        >
            {node.children}
        </Tag>
    }

    return (
        <div>
            <div className="sk_bd_tools_root">
                {elementLibrary.map((el, i) => (
                    <div key={i} >
                        {RenderPaletteElement(el)}
                    </div>
                ))}
            </div>

            <div className="sk_bd_canvas_root">
                <div className="sk_bd_canvas_elements_wrapper">
                    {renderRealNode(treeState)}
                </div>

                <div className="sk_bd_canvas_controls">
                    <select onChange={(e) => setSelectedElement(JSON.parse(e.target.value))}>
                        {elementLibrary.map((el, i) => (
                            <option key={i} value={JSON.stringify(el)}>
                                {el.name}
                            </option>
                        ))}
                    </select>



                    <input
                        type="text"
                        placeholder="Text content"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                    />

                    <button onClick={handleAddAfter}>Add node after</button>
                    <button onClick={handleRemove}>Remove node</button>
                    <button onClick={() => moveNode(1)}>Move right</button>
                    <button onClick={() => moveNode(-1)}>Move left</button>

                    <input
                        type="text"
                        placeholder="New class"
                        value={newClass}
                        onChange={(e) => setNewClass(e.target.value)}
                        onBlur={() => handleEditClass(newClass)}
                    />

                    <select onChange={(e) => handleEditStyle('display', e.target.value)}>
                        <option value="">display</option>
                        <option value="flex">flex</option>
                        <option value="block">block</option>
                        <option value="inline-block">inline-block</option>
                    </select>

                    <select onChange={(e) => handleEditStyle('alignItems', e.target.value)}>
                        <option value="">alignItems</option>
                        <option value="center">center</option>
                        <option value="flex-start">flex-start</option>
                        <option value="flex-end">flex-end</option>
                    </select>

                    <select onChange={(e) => handleEditStyle('flexDirection', e.target.value)}>
                        <option value="">flexDirection</option>
                        <option value="row">row</option>
                        <option value="column">column</option>
                    </select>

                    <select value={selectedEssence} onChange={(e) => handleEssenceChange(e.target.value)}>
                        <option value="">Apply essence</option>
                        {essenceOptions.map((name) => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>

                    <button onClick={() => exportHTMLCSS(treeState)}>Export HTML/CSS</button>
                </div>
            </div>

            <div>
                <pre className="export-output">
                    <strong>HTML:</strong>
                    {'\n'}{generatedHtml}
                    {'\n\n'}<strong>CSS:</strong>
                    {'\n'}{generatedCss}
                </pre>
            </div>
        </div>
    );
}
