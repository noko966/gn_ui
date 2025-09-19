import { MatchItemComponent } from "../lib/index.js";

export default {
    title: "Digitain/Sports/MatchItem",
    component: MatchItemComponent,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        view: {
            control: "select",
            options: ["european"],
        },
        variant: {
            control: "select",
            options: ["standard", "compact", "detailed"],
        },
    },
    args: {
        view: "european",
        variant: "standard",
    },
};

const sampleMatchData = {
    id: 1,
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    competition: "Premier League",
    date: "2025-01-20",
    time: "15:00",
    homeOdds: "2.10",
    drawOdds: "3.20",
    awayOdds: "3.40",
    status: "upcoming",
};

export const European = {
    args: {
        view: "european",
        variant: "standard",
        data: sampleMatchData,
    },
};

export const CompactView = {
    args: {
        view: "european",
        variant: "compact",
        data: sampleMatchData,
    },
};

export const DetailedView = {
    args: {
        view: "european",
        variant: "detailed",
        data: {
            ...sampleMatchData,
            extraInfo: {
                venue: "Old Trafford",
                weather: "Clear",
                temperature: "18°C",
            },
        },
    },
};

export const LiveMatch = {
    args: {
        view: "european",
        variant: "standard",
        data: {
            ...sampleMatchData,
            status: "live",
            score: { home: 1, away: 0 },
            minute: "45+2",
        },
    },
};

export const FinishedMatch = {
    args: {
        view: "european",
        variant: "standard",
        data: {
            ...sampleMatchData,
            status: "finished",
            score: { home: 2, away: 1 },
            result: "home_win",
        },
    },
};
