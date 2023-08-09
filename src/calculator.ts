/*

PrayTimes.js: Prayer Times Calculator (ver 2.3)
Copyright (C) 2007-2011 PrayTimes.org

Developer: Hamid Zarrabi-Zadeh
License: GNU LGPL v3.0

TERMS OF USE:
    Permission is granted to use this code, with or
    without modification, in any website or application
    provided that credit is given to the original work
    with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.

*/
import {Degrees, Location, Minutes, Params} from "./types";
import {sunPosition} from "./utils/sunPosition";
import {toJulianDate} from "./utils/toJulianDate";
import * as DMath from "./utils/degree-math";
import {asrFactors} from "./method-data";
import {fixHour} from "./utils/numbers";

const getCalculator = (setting: Params) => (location: Location, date: Date) => {
    const julianDate = toJulianDate(date, location);

    setting = {
        imsak: { minutes: 10 },
        dhuhr: { minutes: 0 },
        asr: asrFactors.Standard,
        highLats: "NightMiddle",
        ...setting,
    };
    return {
        dhuhr: toDate(dhuhr()),
        sunset: toDate(sunset()),
        sunrise: toDate(sunrise()),
        asr: toDate(asr()),
        fajr: toDate(fajr()),
        imsak: toDate(imsak()),
        maghrib: toDate(maghrib()),
        isha: toDate(isha()),
        midnight: toDate(midnight()),
    };

    function asr() {
        return asrTime(setting.asr?.factor || 1, 13 / 24);
    }

    function dhuhr() {
        return midDay(12 / 24) + (setting.dhuhr?.minutes || 0) / 60;
    }

    function midnight() {
        return (
            sunset() +
            timeDifference(
                sunset(),
                setting.midnight == "Jafari" ? fajr() : sunrise()
            ) /
                2
        );
    }

    function isMinutes(s: Degrees | Minutes | undefined): s is Minutes {
        return !!s && "minutes" in s;
    }

    function isha() {
        if (isMinutes(setting.isha)) {
            return maghrib() + (setting.isha.minutes || 0) / 60;
        }

        const angle = setting.isha?.degree || 0;
        const time = midDay(18 / 24) + SAT(18 / 24, angle);
        if (hlAdjustmentNeeded(time, sunset(), angle)) {
            return sunset() + nightPortion(angle);
        }

        return time;
    }

    function maghrib() {
        if (isMinutes(setting.maghrib)) {
            return sunset() + (setting.maghrib.minutes || 0) / 60;
        }
        const angle = setting.maghrib?.degree || 0;
        const time = midDay(18 / 24) + SAT(18 / 24, angle);
        if (hlAdjustmentNeeded(time, sunset(), angle)) {
            return sunset() + nightPortion(angle);
        }
        return time;
    }

    function imsak() {
        if (isMinutes(setting.imsak)) {
            return fajr() - (setting.imsak.minutes || 0) / 60;
        }
        const angle = setting.imsak?.degree || 0;
        const time = midDay(5 / 24) - SAT(5 / 24, angle);
        if (hlAdjustmentNeeded(time, sunrise(), angle)) {
            return sunrise() - nightPortion(angle);
        }
        return time;
    }

    function fajr() {
        const angle = setting.fajr?.degree || 0;
        const time = midDay(5 / 24) - SAT(5 / 24, angle);
        if (hlAdjustmentNeeded(time, sunrise(), angle))
            return sunrise() - nightPortion(angle);
        return time;
    }

    function sunset() {
        return midDay(18 / 24) + SAT(18 / 24, riseSetAngle());
    }

    function sunrise() {
        return midDay(6 / 24) + -1 * SAT(6 / 24, riseSetAngle());
    }

    function nightTime() {
        return timeDifference(sunset(), sunrise());
    }

    //---------------------- Calculation Functions -----------------------

    // compute mid-day time
    function midDay(time: number) {
        const eqt = sunPosition(julianDate + time).equation;
        const noon = fixHour(12 - eqt) - location.longitude / 15;
        return noon;
    }

    function SAT(time: number, angle: number) {
        const decl = sunPosition(julianDate + time).declination;
        return (
            (1 / 15) *
            DMath.arccos(
                (-DMath.sin(angle) -
                    DMath.sin(decl) * DMath.sin(location.latitude)) /
                    (DMath.cos(decl) * DMath.cos(location.latitude))
            )
        );
    }

    // compute the time at which sun reaches a specific angle below horizon
    // compute asr time
    function asrTime(factor: number, time: number) {
        const decl = sunPosition(julianDate + time).declination;
        const angle = -DMath.arccot(
            factor + DMath.tan(Math.abs(location.latitude - decl))
        );
        return midDay(time) + SAT(time, angle);
    }


    //---------------------- Compute Prayer Times -----------------------

    // return sun angle for sunset/sunrise
    function riseSetAngle() {
        //var earthRad = 6371009; // in meters
        //var angle = DMath.arccos(earthRad/(earthRad+ elv));
        const angle = 0.0347 * Math.sqrt(location.elevation || 0); // an approximation
        return 0.833 + angle;
    }

    // adjust a time for higher latitudes

    function hlAdjustmentNeeded(time: number, base: number, angle: number) {
        const portion = nightPortion(angle);
        const timeDiff = Math.abs(time - base);
        return (
            setting.highLats != "None" && (isNaN(time) || timeDiff > portion)
        );
    }

    // the night portion used for adjusting times in higher latitudes
    function nightPortion(angle: number) {
        const night = nightTime();
        const method = setting.highLats;
        let portion = 1 / 2; // MidNight
        if (method == "AngleBased") portion = (1 / 60) * angle;
        if (method == "OneSeventh") portion = 1 / 7;
        return portion * night;
    }

    // compute the difference between two times
    function timeDifference(time1: number, time2: number) {
        return fixHour(time2 - time1);
    }

    function toDate(hours: number) {
        if (isNaN(hours)) {
            return new Date(NaN);
        }
        return new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                Math.floor(hours),
                Math.floor((hours * 60) % 60),
                Math.floor((hours * 3600) % 60),
                Math.floor((hours * 3600 * 1000) % 1000)
            )
        );
    }
};
export default getCalculator;
