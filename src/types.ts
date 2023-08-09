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

export type Format =
    | "24h" // 24-hour format
    | "12h" // 12-hour format
    | "12hNS" // 12-hour format with no suffix
    | "Float"; // floating point number
