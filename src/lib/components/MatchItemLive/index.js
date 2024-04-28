import React from "react";
// import "./index.scss";

import {
  LiveMatchEventOddSliderComponent,
  LiveMatchEventComponent,
  LiveMatchLegendComponent,
  LiveMatchHeaderComponent,
} from "./views/European/index.js";

// Export components based on view
// const getViewComponents = (view) => {
//   switch (view) {
//     case "european":
//       return {
//         LiveMatchEventOddSliderComponent: ({ slides }) => (
//           <LiveMatchEventOddSliderComponent slides={slides} />
//         ),
//         LiveMatchEventComponent: ({ children, ht, at, hs, as }) => (
//           <LiveMatchEventComponent
//             children={children}
//             ht={ht}
//             at={at}
//             hs={hs}
//             as={as}
//           />
//         ),
//         LiveMatchLegendComponent: ({ leagueName, comment }) => (
//           <LiveMatchLegendComponent leagueName={leagueName} comment={comment} />
//         ),
//         LiveMatchHeaderComponent: ({ sportId, sportName, eventCount }) => (
//           <LiveMatchHeaderComponent
//             sportId={sportId}
//             sportName={sportName}
//             eventCount={eventCount}
//           />
//         ),
//       };
//     default:
//       throw new Error(`Unsupported view: ${view}`);
//   }
// };

export {
  LiveMatchEventOddSliderComponent,
  LiveMatchEventComponent,
  LiveMatchLegendComponent,
  LiveMatchHeaderComponent,
};
