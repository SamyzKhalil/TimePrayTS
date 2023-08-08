import { PrayerCalculationMethods } from "../src/methods";
import getPrayerCalculator from "../src/calculator";
import { PraytimesOutput } from "../src/types";
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
