import {timebased} from  "../../Data/userdata";
import {userdata} from "../../index"
export async function getCurrentDrop() {
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
        if (userdata.startDrop === drop.dropname) {
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
