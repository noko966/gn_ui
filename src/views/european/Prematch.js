import { Collapse, MarketComponent, MatchItemComponent, Scroll, marketComponentFakeData } from "../../lib/index.js";

const resultsFakeData = [
    {
        Id: 1,
        HT: "Team Name Data",
        AT: "Team Name Data",
        eventId: 1231231,
        date: "03.20",
        time: "12.11",
        N: "Result",
        count: 66,
        IsC: true,
        BP: 0,
        RP: 0,
        PP: null,
        A: null,
        IsA: false,
        Groups: [2163],
        Stakes: [
            {
                Id: 3652165936,
                N: "Win1",
                EN: null,
                SN: null,
                GId: 1,
                GN: "Result",
                SC: 1,
                A: null,
                F: 2.77,
                IsEx: false,
                OrderingId: 9223372036844775000,
                StakeOrderId: 1,
                SFN: "Result:  Win1",
                SS: false,
                FD: 0,
                IsC: true,
                IsA: true,
                IsL: false,
                IsF: false,
                IsBF: false,
                D: false,
                FP: null,
                RF: 0,
                ED: null,
                IsWinner: false,
                Factors: {
                    1: {
                        Id: 1,
                        Name: "Result",
                        F: 2.77,
                        M: 0,
                        NPP: [],
                    },
                },
                OSCId: 0,
                LId: "",
                SRT: 0,
            },
            {
                Id: 3652165829,
                N: "X",
                EN: null,
                SN: null,
                GId: 1,
                GN: "Result",
                SC: 2,
                A: null,
                F: 3.45,
                IsEx: false,
                OrderingId: 9223372036844775000,
                StakeOrderId: 2,
                SFN: "Result:  X",
                SS: false,
                FD: 0,
                IsC: true,
                IsA: true,
                IsL: false,
                IsF: false,
                IsBF: false,
                D: false,
                FP: null,
                RF: 0,
                ED: null,
                IsWinner: false,
                Factors: {
                    1: {
                        Id: 1,
                        Name: "Result",
                        F: 3.45,
                        M: 0,
                        NPP: [],
                    },
                },
                OSCId: 0,
                LId: "",
                SRT: 0,
            },
            {
                Id: 3652165958,
                N: "Win2",
                EN: null,
                SN: null,
                GId: 1,
                GN: "Result",
                SC: 3,
                A: null,
                F: 2.48,
                IsEx: false,
                OrderingId: 9223372036844775000,
                StakeOrderId: 3,
                SFN: "Result:  Win2",
                SS: false,
                FD: 0,
                IsC: true,
                IsA: true,
                IsL: false,
                IsF: false,
                IsBF: false,
                D: false,
                FP: null,
                RF: 0,
                ED: null,
                IsWinner: false,
                Factors: {
                    1: {
                        Id: 1,
                        Name: "Result",
                        F: 2.48,
                        M: 0,
                        NPP: [],
                    },
                },
                OSCId: 0,
                LId: "",
                SRT: 0,
            },
        ],
    },
];

const filterData = {
    id: 4,
    name: "norway eastern",
    options: [
        {
            value: "football",
            icon: "",
        },
    ],
};

const PrematchPage = () => {
    return (
        <div className="european_view_prematch_root">
            <MatchItemComponent variant="filter" data={filterData} />

            <div className="european_view_prematch_content_layout">
                <Scroll>
                    <div className="european_view_prematch_list">
                        {resultsFakeData.map((st) => {
                            return (
                                <div>
                                    <MatchItemComponent variant="gameHeader" data={st} />
                                    <MarketComponent variant="stakes" data={st.Stakes} />
                                </div>
                            );
                        })}
                    </div>
                </Scroll>
                <Scroll>
                    <div className="european_view_prematch_list">
                        {marketComponentFakeData.map((st) => {
                            return (
                                <div>
                                    <Collapse toggler={<MarketComponent variant="header" data={st} />}>
                                        <MarketComponent variant="stakes" data={st.Stakes} />
                                    </Collapse>
                                </div>
                            );
                        })}
                    </div>
                </Scroll>
            </div>
        </div>
    );
};
export default PrematchPage;
