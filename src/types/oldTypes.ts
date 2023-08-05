export type Method =
    | "MWL"
    | "ISNA"
    | "Egypt"
    | "Makkah"
    | "Karachi"
    | "Tehran"
    | "Jafari";

export type PrayerInputs = {
    // [latitude, longitude, elevation]
    location: [number, number, number?];
    date: Date|[number,number,number];
    // difference with GMT
    method?: Method;
    params?: Params;
};
export type midnightMethod = "Standard" | "Jafari";

export type highLatsMethod =
    | "None"
    | "NightMiddle"
    | "OneSeventh"
    | "AngleBased";

export type Params = {
    // examples 10 ( which means degrees) or "5 min" which means the minutes value
    imsak?: string | number;
    // example "5 min"
    fajr?: string;
    // example "5 min"
    dhuhr?: string;
    asr?: number;
    // examples 10 ( which means degrees) or "5 min" which means the minutes value
    maghrib?: string | number;
    // examples 10 ( which means degrees) or "5 min" which means the minutes value
    isha?: string | number;
    midnight?: midnightMethod;
    highLats?: highLatsMethod;
};

type Timenames =
    | "imsak"
    | "fajr"
    | "sunrise"
    | "dhuhr"
    | "asr"
    | "sunset"
    | "maghrib"
    | "isha"
    | "midnight";

export type PraytimesOutput = Record<Timenames, Date | null>;

