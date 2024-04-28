import React, { useState, useRef, useLayoutEffect } from "react";
import classNames from "classnames";

const Collapse = ({ children, toggler}) => {
  const [isVisible, setIsVisible] = useState(true);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    if (isVisible && contentRef.current) {
      const contentHeight = contentRef.current.offsetHeight + 'px';
      contentRef.current.style.setProperty('--content_height', contentHeight);
    }
  }, [children]);

  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  const contentClassName = classNames({
    'dg_collapse_content_wrapper': true,
    state_hidden: !isVisible,
    state_visible: isVisible,
  });

  // const togglerWithHandler = React.cloneElement(toggler, {
  //   onClick: toggleVisible,
  //   ...toggler.props,
  // });

  return (
    <div>
      <div onClick={toggleVisible}>
      {toggler}
      </div>
      <div
        ref={contentRef}
        className={contentClassName}
      >
        {children}
      </div>
    </div>
  );
};

export default Collapse;
