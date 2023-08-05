import { Params } from "../types/oldTypes";

const asrMethod = { Standard: 1, Hanafi: 2 };
const // do not change anything here; use adjust method instead
  setting: Params = {
    imsak: "10 min",
    dhuhr: "0 min",
    asr: asrMethod.Standard,
    highLats: "NightMiddle",
  };

export const defaultParams: Params = {
  maghrib: "0 min",
  midnight: "Standard",
  ...setting
};
export const PrayerCalculationMethods = {
  MWL: {
    name: "Muslim World League",
    params: { ...defaultParams, fajr: 18, isha: 17 },
  },
  ISNA: {
    name: "Islamic Society of North America (ISNA)",
    params: { ...defaultParams, fajr: 15, isha: 15 },
  },
  Egypt: {
    name: "Egyptian General Authority of Survey",
    params: {
      ...defaultParams,
      fajr: 19.5,
      isha: 17.5,
    },
  },
  Makkah: {
    name: "Umm Al-Qura University, Makkah",
    params: { ...defaultParams, fajr: 18.5, isha: "90 min" },
  }, // fajr was 19 degrees before 1430 hijri
  Karachi: {
    name: "University of Islamic Sciences, Karachi",
    params: { ...defaultParams, fajr: 18, isha: 18 },
  },
  Tehran: {
    name: "Institute of Geophysics, University of Tehran",
    params: {
      ...defaultParams,
      fajr: 17.7,
      isha: 14,
      maghrib: 4.5,
      midnight: "Jafari",
    },
  }, // isha is not explicitly specified in this method
  Jafari: {
    name: "Shia Ithna-Ashari, Leva Institute, Qum",
    params: {
      ...defaultParams,
      fajr: 16,
      isha: 14,
      maghrib: 4,
      midnight: "Jafari",
    },
  },
} satisfies Record<string, { name: string, params: Params }>;
