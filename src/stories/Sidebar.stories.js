// SidebarEuropeanFull.stories.jsx
import React from "react";
import { SidebarItem, Scroll } from "../../library/digi-library.js";

export default {
  title: "Digitain/Sidebar",
  component: SidebarItem, // Assuming Scroll is your main component for the story\
  tags: ["autodocs"],
  argTypes: {
    view: { control: "select", options: ["european", "esport"] },
    variant: {
      control: "select",
      options: ["favorite", "league", "sport", "country", "live"],
    },

    // Add more controls for other props if necessary
  },
  args: {
    ht: "home team",
    at: "away team",
    hs: 1,
    as: 0,
    time: "15-24",
    HasLI: true,
    name: "name",
    count: 15,
    id: 15233,
    sportId: 3,
  },
};

const Template = ({ view, ...args }) => {
  return (
    <div style={{ width: "200px", height: "250px" }}>
      <Scroll view={view} fullHeight={true} {...args}></Scroll>
    </div>
  );
};

export const Sport = {
  args: {
    view: "european",
    variant: "sport",
    name: "football",
    count: 0,
  },
};

export const Favorite = {
  args: {
    view: "european",
    variant: "favorite",
    name: "favorites",
    count: 0,
  },
};

export const League = {
  args: {
    view: "european",
    variant: "league",
    name: "league name",
    count: 0,
  },
};

export const Country = {
  args: {
    view: "european",
    variant: "country",
    name: "country name",
    id: 10,
  },
};

export const Live = {
  args: {
    view: "european",
    variant: "live",
    ht: "home team",
    at: "away team",
    hs: 1,
    as: 0,
    time: "15-24",
    HasLI: true,
  },
};
