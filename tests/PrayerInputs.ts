import { Method, Params } from "../src/types";

export type PrayerInputs = {
    location: [number, number, number?];
    date: Date;
    method?: Method;
    params?: Params;
};
