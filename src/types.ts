export type Method =
    | "MWL"
    | "ISNA"
    | "Egypt"
    | "Makkah"
    | "Karachi"
    | "Tehran"
    | "Jafari";

export type MidnightMethod = "Standard" | "Jafari";

export type HighLatsMethod =
    | "None"
    | "NightMiddle"
    | "OneSeventh"
    | "AngleBased";

export type Params = {
    imsak?: Degrees | Minutes;
    fajr?: Degrees;
    dhuhr?: Minutes;
    asr?: { factor: number };
    maghrib?: Degrees | Minutes;
    isha?: Degrees | Minutes;
    midnight?: MidnightMethod;
    highLats?: HighLatsMethod;
};
export type Degrees = {
    degree: number;
};

export type Minutes = {
    minutes: number;
};

export type Timenames =
    | "imsak"
    | "fajr"
    | "sunrise"
    | "dhuhr"
    | "asr"
    | "sunset"
    | "maghrib"
    | "isha"
    | "midnight";

export type PraytimesOutput = Record<Timenames, Date>;

export type Location = {
    longitude: number;
    latitude: number;
    elevation?: number;
};
