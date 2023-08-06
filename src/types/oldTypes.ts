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
    fajr?: DegreeOrMinute;
    // example "5 min"
    dhuhr?: number;
    asr?: number;
    // examples 10 ( which means degrees) or "5 min" which means the minutes value
    maghrib?: DegreeOrMinute;
    // examples 10 ( which means degrees) or "5 min" which means the minutes value
    isha?: DegreeOrMinute;
    midnight?: MidnightMethod;
    highLats?: HighLatsMethod;
};
export type DegreeOrMinute = { value: number; isMinutes?: true };

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

export type PraytimesOutput = Record<Timenames, Date | null>;
