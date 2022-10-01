export class userdataclass {
    loginpageurl: string;
    cookies: Object[];
    auth_token: string;
    watch_option: string;
    game: string;
    clientid: string;
    userid: string;
    drops: Array<DropsArray>;
    claimedDrops: Array<ClaimedDropsArray>;
    nonActiveDrops: Array<string>;
    availableDropNameChoices: Array<string>;
    startDrop: string;
    showtoken: boolean;
    settings: {
        Chromeexe: string;
        UserDataPath: string;
        WebHookURL: string;
        WebHookEvents: Array<string>;
        debug: boolean;
        displayless: boolean;
        ProgressCheckInterval: number;
        RetryDelay: number;
        WaitforChannels: boolean;
        Prioritylist: Array<string>;
        AutoClaim: boolean;
        LogToFile: boolean;
        ForceCustomChannel: boolean;
        UseKeepAlive: boolean;
        AutoPoints: boolean;
    };
    customchannel: Array<CustomChannel>;

    constructor() {
        this.loginpageurl = "https://www.twitch.tv/login";
        this.cookies = [];
        this.auth_token = "";
        this.watch_option = "";
        this.game = "";
        this.clientid = "";
        this.userid = "";
        this.drops = [];
        this.claimedDrops = [];
        this.nonActiveDrops = [];
        this.availableDropNameChoices = [];
        this.startDrop = "";
        this.showtoken = false;
        this.settings = {
            Chromeexe: "",
            UserDataPath: "",
            WebHookURL: "",
            WebHookEvents: [],
            debug: false,
            displayless: false,
            ProgressCheckInterval: 60000,
            RetryDelay: 60000,
            WaitforChannels: false,
            Prioritylist: [],
            AutoClaim: true,
            LogToFile: true,
            ForceCustomChannel: false,
            UseKeepAlive: false,
            AutoPoints: false
        }
        this.customchannel = [];
    }
}

type ClaimedDropsArray = {
    id: string,
    imageurl: string,
    name: string,
    game: Object
}

type DropsArray = {
    dropid: string,
    dropname: string,
    Connected: boolean,
    allowedchannels: Array<Channel>,
    timebasedrop: Array<timebased>,
    live: boolean,
    foundlivech: Array<string>,
    isClaimed: boolean
}

export type timebased = {
    id: string,
    name: string,
    startAt: string,
    endAt: string,
    preconditionDrops: boolean,
    requiredMinutesWatched: number,
    benefitEdges: Array<benefitEdges>,
    self: {
        status?: string,
        Pointsamount?: string,
        hasPreconditionsMet?: boolean,
        currentMinutesWatched: number,
        isClaimed: boolean | null,
        dropInstanceID: string | null,
        __typename: string
    },
    campaign: {
        id: string,
        detailsURL: string,
        accountLinkURL: string,
        self: {isAccountConnected: boolean},
        __typename: string
    }
}

type benefitEdges = {
    benefit: {
        id: string,
        imageAssetURL: string,
        name: string,
        __typename: string
    },
    entitlementLimit: number,
    claimCount: number,
    __typename: string
}

type Channel = {
    id: string,
    displayName: string,
    name: string,
    __typename: string
}

export type CustomChannel = {
    Name: string,
    TTVLink: string,
    WatchType: string,
    Time: number,
    Points: boolean,
    live?: boolean | null
}
