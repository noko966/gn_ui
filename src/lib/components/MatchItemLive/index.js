import React from "react";

import {
  European,
} from "./views/European/index.js";


const MatchItemLiveComponent = ({
  view,
  variant,
  sportId,
  sportName,
  eventCount,
  leagueName,
  comment,
  children,
  ht,
  at,
  hs,
  as,
  slides,
}) => {
  const Component =
    {
      european: European,
    }[view] || European;

  return (
    <Component
    view={view}
    variant={variant}
    sportId={sportId}
    sportName={sportName}
    eventCount={eventCount}
    leagueName={leagueName}
    comment={comment}
    ht={ht}
    at={at}
    hs={hs}
    as={as}
    slides={slides}
    children={children}
    />
  );
};

export { MatchItemLiveComponent as MatchItemLive};