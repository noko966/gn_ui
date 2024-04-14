import React, { useState } from "react";
import classNames from "classnames";
import "./index.scss";
// Tab component to display content
const SidebarTab = ({ isActive, children }) => {
  if (!isActive) return null;
  return <div className="view_european_side_bar_content">{children}</div>;
};

// Tabs container to switch between tabs
const SidebarTabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="view_european_side_bar_tabs_control">
      <div className="view_european_side_bar_tabs">
        {React.Children.map(children, (child, index) => {
          const tabClassName = classNames({
            [`view_european_side_bar_tab`]: true,
            state_active: index === activeTab,
          });
          return (
            <button
              className={tabClassName}
              onClick={() => setActiveTab(index)}
            >
              {child.props.title}
              {child.props.count && (
                <div className="tab_badge">{child.props.count}</div>
              )}
            </button>
          );
        })}
      </div>
      <div className="view_european_side_bar_content_root">
        {React.Children.map(children, (child, index) =>
          React.cloneElement(child, { isActive: index === activeTab })
        )}
      </div>
    </div>
  );
};

export { SidebarTabs, SidebarTab };
