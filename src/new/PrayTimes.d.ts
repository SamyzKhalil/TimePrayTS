import { Method, Params } from "./oldTypes";

declare type Format = "24h" | "12h" | "12hNS" | "Float";
declare export default class PrayTimes {
  setMethod(method: Method);
  adjust(params: Params);
  getTimes(
    date: Date|[number,number,number],
    coordinates: [number, number, number?],
    timezone?: number,
    dst?: 1 | 0,
    format?: Format
  );
}
