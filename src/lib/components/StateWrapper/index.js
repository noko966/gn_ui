import React, { useState } from "react";

const StateWrapper = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  // Toggle function to change visibility
  const toggleActive = () => {
    setIsActive((prev) => !prev);
    console.log(isActive);
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { isActive, setIsActive: toggleActive });
    }
    return child;
  });

  return <>{childrenWithProps}</>;

  // Cloning children and passing additional props
  // const EnhancedChild = withExtraProp(ChildComponent, isActive, setIsActive);

  // return <EnhancedChild />;
};

export default StateWrapper;
