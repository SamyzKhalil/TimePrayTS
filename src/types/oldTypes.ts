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
    date: Date;
    // difference with GMT
    method?: Method;
    params?: Params;
};
export type MidnightMethod = "Standard" | "Jafari";

export type HighLatsMethod =
    | "None"
    | "NightMiddle"
    | "OneSeventh"
    | "AngleBased";

export type Params = {
    // examples 10 ( which means degrees) or "5 min" which means the minutes value
    imsak?: DegreeOrMinute;
    // example "5 min"
    fajr?: Degrees;
    // example "5 min"
    dhuhr?: Minutes;
    asr?: { factor: number };
    // examples 10 ( which means degrees) or "5 min" which means the minutes value
    maghrib?: DegreeOrMinute;
    // examples 10 ( which means degrees) or "5 min" which means the minutes value
    isha?: DegreeOrMinute;
    midnight?: MidnightMethod;
    highLats?: HighLatsMethod;
};
type Degrees = {
    degree: number;
};

type Minutes = {
    minutes: number;
};

export type DegreeOrMinute = Degrees | Minutes;

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
