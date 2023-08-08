import { PrayerCalculationMethods } from "../new/methods";
import getPrayerCalculator from "../new/calculator";
import { PraytimesOutput } from "../new/types";
import type { PrayerInputs } from "./PrayerInputs";

export function getPraytimes(inputs: PrayerInputs): PraytimesOutput {
  const calculator = getPrayerCalculator({
    ...PrayerCalculationMethods[inputs.method || "MWL"].params,
    ...inputs.params,
  });

  const res = calculator(
    {
      latitude: inputs.location[0],
      longitude: inputs.location[1],
      elevation: inputs.location[2],
    },
    inputs.date,
  );

  return res;
}
