import { PraytimesOutput } from "../../new/types";
import { PrayerInputs } from "../PrayerInputs";
import PrayTimes from "./PrayTimes";
export function OriginalPraytimes(inputs: PrayerInputs): PraytimesOutput {
    const p = new PrayTimes();
    if (inputs.method) p.setMethod(inputs.method);
    if (inputs.params) p.adjust(inputs.params);

    const dateParts: [number, number, number] =
        inputs.date instanceof Date
            ? [
                inputs.date.getFullYear(),
                inputs.date.getMonth(),
                inputs.date.getDate(),
            ]
            : inputs.date;
    const res = p.getTimes(inputs.date, inputs.location, 0, 0, "Float");

    return Object.fromEntries(
        Object.entries(res).map(([k, v]) => [
            k,
            v != "-----"
                ? convertToDate(dateParts, v as number)
                : new Date(NaN),
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
