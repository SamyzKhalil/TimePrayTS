import {
  HighLatsMethod,
  Method,
  MidnightMethod,
  Params,
} from "../../new/types";
import { PrayerInputs } from "../PrayerInputs";

const randomMethod = () => {
  const methods: Method[] = [
    "MWL",
    "ISNA",
    "Egypt",
    "Makkah",
    "Karachi",
    "Tehran",
    "Jafari",
  ];
  // return "Tehran";
  return methods[Math.floor(Math.random() * methods.length)];
};
function getRandomDate(start: Date, end: Date) {
  const startDate = start.getTime();
  const endDate = end.getTime();
  const randomTime = Math.random() * (endDate - startDate) + startDate;
  return new Date(randomTime);
}
export const randomBuiltinInput = (
  latitude: number,
  longitude: number,
): PrayerInputs => {
  const elevation = Math.random() * 1000;
  const location: [number, number, number?] = [
    latitude,
    longitude,
    elevation,
  ];
  if (Math.random() > 0.9) {
    location.pop();
  }

  const date = getRandomDate(new Date("1900-1-1"), new Date("2100-1-1"));

  const method = randomMethod();
  const params = randomParams();

  return {
    location,
    date,
    method,
    params,
  };
};
function randomParams(): Params {
  const highLats: HighLatsMethod = (
    ["None", "NightMiddle", "OneSeventh", "AngleBased"] as const
  )[Math.floor(Math.random() * 5)];
  const midnightMethod: MidnightMethod = (["Standard", "Jafari"] as const)[
    Math.floor(Math.random() * 3)
  ];
  return {
    midnight: midnightMethod,
    highLats,
  };
}
