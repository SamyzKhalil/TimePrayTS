import { Location, Params, Timenames } from "../src/types";

export type TestCase = {
    inputs: {
        params: Params;
        date: Date;
        location: Location;
    };

    originalOutput: Record<Timenames, Date>;
};
