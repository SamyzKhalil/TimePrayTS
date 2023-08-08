import { PrayerInputs, PraytimesOutput } from "../types/oldTypes";
import { PrayerCalculationMethods } from "./methods";
import PrayTimes from "./PrayTimes";
export function getPraytimes(inputs: PrayerInputs): PraytimesOutput {
    const p = new PrayTimes(
        {
            ...PrayerCalculationMethods[inputs.method || "MWL"].params,
            ...inputs.params,
        },
        inputs.date,
        inputs.location
    );

    const dateParts: [number, number, number] =
        inputs.date instanceof Date
            ? [
                  inputs.date.getFullYear(),
                  inputs.date.getMonth(),
                  inputs.date.getDate(),
              ]
            : inputs.date;
    const res = p.getTimes();

    return Object.fromEntries(
        Object.entries(res).map(([k, v]: any) => [
            k,
            !isNaN(v) ? convertToDate(dateParts, v as number) : NaN,
        ])
    ) as any;
}

function convertToDate(nd: [number, number, number], hours: number) {
    return new Date(
        Date.UTC(
            nd[0],
            nd[1],
            nd[2],
            Math.floor(hours),
            Math.floor((hours * 60) % 60),
            Math.floor((hours * 3600) % 60),
            Math.floor((hours * 3600 * 1000) % 1000)
        )
    );
}
