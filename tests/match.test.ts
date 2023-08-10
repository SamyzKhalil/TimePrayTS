import fs from "fs/promises";
import { getPraytimes } from "./wrapper";
import { OriginalPraytimes } from "./original/wrapper";
import { randomBuiltinInput } from "./utils/random-inputs";
import { PraytimesOutput } from "../src/types";
import { PrayerInputs } from "./PrayerInputs";
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

it(`should match for cities`, async () => {
    const cities = JSON.parse(
        await fs.readFile("./assets/cities-all.json", "utf8"), // change it to cities.json if you want to have faster test runs
    );
    for (const city of cities as City[]) {
        const input = randomBuiltinInput(+city.latitude, +city.longitude);
        const originalPraytimes = OriginalPraytimes(input);
        const newPraytimes = getPraytimes(input);
        assertPraytimes(input, originalPraytimes, newPraytimes, city);
    }
});
function assertPraytimes(
    inputs: any,
    original: PraytimesOutput,
    newtimes: PraytimesOutput,
    city?: City,
) {
    for (const key in original) {
        if (isNaN(original[key])) expect(newtimes[key].getTime()).toBeNaN();
        else {
            const o: Date = original[key];
            const n: Date = newtimes[key];
            try {
                expect(n.getTime()).toBeCloseTo(o.getTime(), -2);
            } catch (e) {
                console.log(inputs, original, newtimes, city, e);
                console.log(
                    `invalid ${key} \nold:${o.toISOString()}\nnew:${n.toISOString()}`,
                );
                throw e;
            }
        }
    }
}
it("specific case ", () => {
    const input = {
        location: [-17.83333, 178.25, 333.33051608360284] as [
            number,
            number,
            number,
        ],
        date: new Date("2066-10-26T12:34:03.675Z"),
        method: "Tehran" as const,
        params: { midnight: undefined, highLats: "AngleBased" } as const,
    };

    const originalPraytimes = OriginalPraytimes(input);
    const newPraytimes = getPraytimes(input);

    assertPraytimes(input, originalPraytimes, newPraytimes);
});

it("imsak degree high lats", () => {
    const input: PrayerInputs = {
        location: [89, 2.48994, 0] as [number, number, number],
        date: new Date("2066-10-26T12:34:03.675Z"),
        method: "Tehran" as const,
        params: {
            midnight: undefined,
            highLats: "AngleBased",
            imsak: { degree: 10 },
        } as const,
    };

    const originalPraytimes = OriginalPraytimes({
        ...input,
        params: { ...input.params, imsak: "10" },
    });
    const newPraytimes = getPraytimes(input);

    assertPraytimes(input, originalPraytimes, newPraytimes);
});

it("imsak degree", () => {
    const input: PrayerInputs = {
        location: [30, 2.48994, 0] as [number, number, number],
        date: new Date("2066-10-26T12:34:03.675Z"),
        method: "Tehran" as const,
        params: {
            midnight: undefined,
            highLats: "AngleBased",
            imsak: { degree: 10 },
        } as const,
    };

    const originalPraytimes = OriginalPraytimes({
        ...input,
        params: { ...input.params, imsak: "10" },
    });
    const newPraytimes = getPraytimes(input);

    assertPraytimes(input, originalPraytimes, newPraytimes);
});
