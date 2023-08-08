import { Method, Params } from "../new/types";


export type PrayerInputs = {
    location: [number, number, number?];
    date: Date;
    method?: Method;
    params?: Params;
};

