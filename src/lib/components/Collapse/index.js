import React, { useState, useRef, useEffect } from "react";

const Collapse = ({ children, toggler, baseHeight = 42 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (isVisible && contentRef.current) {
      // Calculate the total height of the content
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isVisible, children]);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const togglerWithHandler = React.cloneElement(toggler, {
    onClick: toggleVisibility,
    ...toggler.props,
  });

  return (
    <div>
      {togglerWithHandler}
      <div
        ref={contentRef}
        style={{
          maxHeight: maxHeight,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
