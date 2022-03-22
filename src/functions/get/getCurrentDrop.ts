import {timebased, userdata} from "../../data/userdata";

export async function getCurrentDrop(DropcurrentlyWatching: string) {
    let CurrentDrop:Drop = {
        dropid: '',
        dropname: '',
        Connected: false,
        allowedchannels: [],
        timebasedrop: [],
        live: false,
        foundlivech: [],
        isClaimed: false
    };
    for (const drop of userdata.drops) {
        if (drop.foundlivech.includes(DropcurrentlyWatching)) {
            CurrentDrop = drop;
        }
    }
    return CurrentDrop
}

export type Drop = {
    dropid: string,
    dropname: string,
    Connected: boolean,
    allowedchannels: Array<Channel>,
    timebasedrop: Array<timebased>,
    live: boolean,
    foundlivech: Array<string>,
    isClaimed: boolean
}

type Channel = {
    id: string,
    displayName: string,
    name: string,
    __typename: string
}
