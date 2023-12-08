import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/time-pray.esm.js",
                format: "es",
                sourcemap: true,
            },
            {
                file: "dist/time-pray.umd.js",
                format: "umd",
                name: "time-pray",
                sourcemap: true,
            },
        ],
        plugins: [typescript()],
    },
    {
        input: "src/index.ts",
        output: {
            file: "dist/time-pray.d.ts",
            format: "es",
        },

        plugins: [dts()],
    },
];
