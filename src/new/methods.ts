import { Params } from "../types/oldTypes";

const asrMethod = { Standard: 1, Hanafi: 2 };
const setting: Params = {
  imsak: { value: 10, isMinutes: true },
  dhuhr: 0,
  asr: asrMethod.Standard,
  highLats: "NightMiddle",
};

export const defaultParams: Params = {
  maghrib: { value: 0, isMinutes: true },
  midnight: "Standard",
  ...setting
};
export const PrayerCalculationMethods = {
  MWL: {
    name: "Muslim World League",
    params: { ...defaultParams, fajr: { value: 18 }, isha: { value: 17 } },
  },
  ISNA: {
    name: "Islamic Society of North America (ISNA)",
    params: { ...defaultParams, fajr: { value: 15 }, isha: { value: 15 } },
  },
  Egypt: {
    name: "Egyptian General Authority of Survey",
    params: {
      ...defaultParams,
      fajr: { value: 19.5 },
      isha: { value: 17.5 },
    },
  },
  Makkah: {
    name: "Umm Al-Qura University, Makkah",
    params: { ...defaultParams, fajr: { value: 18.5 }, isha: { value: 90, isMinutes: true } },
  }, // fajr was 19 degrees before 1430 hijri
  Karachi: {
    name: "University of Islamic Sciences, Karachi",
    params: { ...defaultParams, fajr: { value: 18 }, isha: { value: 18 } },
  },
  Tehran: {
    name: "Institute of Geophysics, University of Tehran",
    params: {
      ...defaultParams,
      fajr: { value: 17.7 },
      isha: { value: 14 },
      maghrib: { value: 4.5 },
      midnight: "Jafari",
    },
  }, // isha is not explicitly specified in this method
  Jafari: {
    name: "Shia Ithna-Ashari, Leva Institute, Qum",
    params: {
      ...defaultParams,
      fajr: { value: 16 },
      isha: { value: 14 },
      maghrib: { value: 4 },
      midnight: "Jafari",
    },
  },
} satisfies Record<string, { name: string, params: Params }>;
