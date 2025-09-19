import classNames from "classnames";
import { Collapse, MarketComponent, Scroll, Symbol, Text, marketComponentFakeData } from "../../lib/index.js";

const SportImageComponent = ({ sportId }) => {
    const imageSource = `./images/backgrounds/${sportId}.webp`;
    return <img className="dg_deco_image" src={imageSource} />;
};

const EventDetailsBillboard = ({ data }) => {
    const rootClassName = classNames({
        european_view_event_details_billboard_root: true,
    });

    return (
        <div className={rootClassName}>
            <div className="european_view_event_details_billboard_table_wrapper">
                <div className="european_view_event_details_billboard_layout_start">
                    <div className="billboard_layout_row">
                        <Symbol sportId="angle_left" />
                        <Text customClassName="lg" text={data.CN} />
                        <Symbol sportId="info" />
                    </div>
                    <div className="billboard_layout_row_team">
                        <Symbol sportId="issue" />
                        <Text customClassName="tn" text={data.HT} />
                    </div>
                    <div className="billboard_layout_row_team">
                        <Symbol sportId="issue" />
                        <Text customClassName="tn" text={data.AT} />
                    </div>
                </div>
                <div className="european_view_event_details_billboard_layout_end">
                    <Scroll isHorizontal={true}>
                        <div className="billboard_layout_row_table_wrapper">
                            <div className="billboard_layout_col_table">
                                <div className="billboard_layout_row_thead">
                                    {data.scoresHt.map((s, i) => {
                                        return (
                                            <div key={i} className="td">
                                                <Text text={i + 1} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="billboard_layout_row_trow">
                                    <div className="td m">
                                        <Text text={10} />
                                    </div>
                                    {data.scoresHt.map((s, i) => {
                                        return (
                                            <div key={i} className="td">
                                                <Text text={s} />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="billboard_layout_row_trow">
                                    <div className="td m">
                                        <Text text={5} />
                                    </div>
                                    {data.scoresAt.map((s, i) => {
                                        return (
                                            <div key={i} className="td">
                                                <Text text={s} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Scroll>
                </div>
            </div>

            <div className="european_view_event_details_billboard_layout_filters"></div>
            <SportImageComponent sportId={data.sportId} />
        </div>
    );
};

const billBoardFakeData = {
    scoresHt: [0, 1, 2, 3, 4, 5, 6],
    scoresAt: [0, 1, 2, 3, 4, 5, 6],
    sportId: 1,
    CN: "alcatraz 155",
    HT: "mustangs",
    AT: "Dogs",
};

const LiveDetailsPage = () => {
    const oddIndexedData = marketComponentFakeData.filter((_, index) => index % 2 !== 0);
    const evenIndexedData = marketComponentFakeData.filter((_, index) => index % 2 === 0);

    return (
        <div className="european_view_live_root">
            <div className="european_view_live_content_layout">
                <Scroll>
                    <div className="euv_page_list">
                        <EventDetailsBillboard data={billBoardFakeData} />
                        <MarketComponent variant="filter" data={oddIndexedData} />
                        <div className="euv_page_lists_row">
                            <div className="flex_col euv_page_list euv_page_list_50">
                                {oddIndexedData.map((st) => {
                                    return (
                                        <div>
                                            <Collapse toggler={<MarketComponent variant="header" data={st} />}>
                                                <MarketComponent variant="stakes" data={st.Stakes} />
                                            </Collapse>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="euv_page_list euv_page_list_50">
                                {evenIndexedData.map((st) => {
                                    return (
                                        <div>
                                            <Collapse toggler={<MarketComponent variant="header" data={st} />}>
                                                <MarketComponent variant="stakes" data={st.Stakes} />
                                            </Collapse>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Scroll>
            </div>
        </div>
    );
};
export default LiveDetailsPage;
