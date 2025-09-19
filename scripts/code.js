import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Use any style of your preference
import { useEffect, useState } from "react";

const HighlightedCode = ({ componentName }) => {
    const [code, setCode] = useState("");

    useEffect(() => {
        const fetchAndHighlightCode = async () => {
            const path = `/components/${componentName}/${componentName}.js`; // Adjust path as necessary
            const response = await fetch(path);
            const text = await response.text();
            const highlighted = hljs.highlightAuto(text).value;
            setCode(highlighted);
        };

        fetchAndHighlightCode();
    }, [componentName]);

    return <pre dangerouslySetInnerHTML={{ __html: code }} />;
};

export default HighlightedCode;
