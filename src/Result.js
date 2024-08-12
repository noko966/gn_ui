import React from 'react';
import {
  Collapse,
  MarketComponent,
  marketComponentFakeData,
  Scroll,
  Symbol,
  TeamScoreElement,
  Text,
} from '../library/digi-library';

const fakeDataMultiElements = [0, 1, 2, 3];

// const SportImageComponent = ({ sportId }) => {
//   const imageSource = `./images/backgrounds/${sportId}.webp`;
//   return (
//     <div className='dg_deco_image_wrapper'>
//       <img className='dg_deco_image' src={imageSource} />
//     </div>
//   );
// };

const ResultPage = () => {
  const oddIndexedData = marketComponentFakeData.filter(
    (_, index) => index % 2 !== 0
  );

  return (
    <div className='european_view_live_root'>
      <div className='european_view_live_content_layout'>
        <Scroll>
          <div className='euv_page_layout_grid'>
            {fakeDataMultiElements.map((m, i) => {
              return (
                <div
                  key={i}
                  className='european_view_event_multi_view_item_root'
                ></div>
              );
            })}
          </div>
        </Scroll>
      </div>
    </div>
  );
};
export default ResultPage;

{
  /*
                  <MultiViewItemHeaderElement
                    data={{ n: 'header name', sportId: 5 }}
                  />
                  <div className='european_view_event_multi_view_item_top'>
                    <TeamScoreElement data={{ sc: 5, tn: 'home team' }} />
                    <TeamScoreElement data={{ sc: 5, tn: 'away team' }} />
                  </div>
                  <div className='european_view_event_multi_view_item_markets_filter'>
                    <div className='layout_row_fill'>
                      <Symbol sportId={'angle_double_down'} />
                      <Text text={'2 nd half'} />
                    </div>
                    <div className='layout_row_hug'>
                      <Symbol sportId={'info'} />
                      <Symbol sportId={'stream'} />
                    </div>
                  </div>
                  <div className='european_view_multi_item_market_scroll_container'>
                    <Scroll>
                      {marketComponentFakeData.map((st, i) => {
                        return (
                          <div key={i}>
                            <Collapse
                              toggler={
                                <div className='european_view_event_multi_view_item_market_filter'>
                                  <div className='layout_row_fill'>
                                    <Symbol sportId={'angle_down'} />
                                    <Text text={'2 nd half'} />
                                  </div>
                                  <div className='layout_row_hug'>
                                    <Text text={'cashout'} />
                                  </div>
                                </div>
                              }
                            >
                              <MarketComponent
                                variant='stakes'
                                data={st.Stakes}
                              />
                            </Collapse>
                          </div>
                        );
                      })}
                    </Scroll>
                  </div>
  */
}
