import getPrayerCalculator from "../src/calculator";
import { PraytimesOutput } from "../src/types";
import type { PrayerInputs } from "./PrayerInputs";
import { methods } from "../src";

export function getPraytimes(inputs: PrayerInputs): PraytimesOutput {
    const calculator = getPrayerCalculator({
        ...methods[inputs.method || "MWL"],
        ...inputs.params,
    });

    const res = calculator(
        {
            latitude: inputs.location[0],
            longitude: inputs.location[1],
            elevation: inputs.location[2],
        },
        inputs.date
    );

    return res;
}
