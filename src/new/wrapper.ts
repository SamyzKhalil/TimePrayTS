import { PrayerInputs, PraytimesOutput } from "../types/oldTypes";
import { PrayerCalculationMethods } from "./methods";
import PrayTimes from "./PrayTimes";
export function getPraytimes(inputs: PrayerInputs): PraytimesOutput {
    const p = new PrayTimes(
        {
            ...PrayerCalculationMethods[inputs.method || "MWL"].params,
            ...inputs.params,
        },
        {
            latitude: inputs.location[0],
            longitude: inputs.location[1],
            elevation: inputs.location[2],
        },
        inputs.date
    );

    const res = p.getTimes();

    return res;
}
