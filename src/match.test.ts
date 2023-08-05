import cities from "../assets/cities.json";
import { getPraytimes } from "./new/wrapper";
import { OriginalPraytimes } from "./original/wrapper";
import { randomBuiltinInput } from "./test-utils/random-inputs";
import { PraytimesOutput } from "./types/oldTypes";
type City = {
  id: string;
  name: string;
  state_id: string;
  state_code: string;
  state_name: string;
  country_id: string;
  country_code: string;
  country_name: string;
  latitude: string;
  longitude: string;
  wikiDataId: string;
};

it(`should match for cities`, () => {
  for (const city of cities as City[]) {
    const input = randomBuiltinInput(+city.latitude, +city.longitude);
    const originalPraytimes = OriginalPraytimes(input);
    const newPraytimes = getPraytimes(input);
    assertPraytimes(originalPraytimes, newPraytimes, city);
  }
});
function assertPraytimes(
  original: PraytimesOutput,
  newtimes: PraytimesOutput,
  city: City
) {
  for (const key in original) {
    if (original[key] === null) expect(newtimes[key]).toBeNull();
    else {
      const o: Date = original[key];
      const n: Date = newtimes[key];
      expect(n.getTime()).toBeCloseTo(o.getTime(), -2);
    }
  }
}
