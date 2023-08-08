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
import { Location, Params } from "./types";
import { sunPosition } from "./utils/sunPosition";
import { toJulianDate } from "./utils/toJulianDate";
import * as DMath from "./utils/degree-math";
import { asrFactors } from "./method-data";

//------------------------ Constants --------------------------
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
        return setting.midnight == "Jafari"
            ? sunset() + timeDifference(sunset(), fajr()) / 2
            : sunset() + timeDifference(sunset(), sunrise()) / 2;
    }

    function isha() {
        if (setting.isha && "minutes" in setting.isha) {
            return maghrib() + (setting.isha.minutes || 0) / 60;
        }

        const time = sunAngleTime(setting.isha?.degree || 0, 18 / 24);
        const adjusted = adjustHLTime(
            time,
            sunset(),
            setting.isha?.degree || 0,
            nightTime()
        );
        return adjusted;
    }
    function maghrib() {
        if (setting.maghrib && "minutes" in setting.maghrib) {
            return sunset() + (setting.maghrib.minutes || 0) / 60;
        }

        const time = sunAngleTime(setting.maghrib?.degree || 0, 18 / 24);
        const adjusted = adjustHLTime(
            time,
            sunset(),
            setting.maghrib?.degree || 0,
            nightTime()
        );

        return adjusted;
    }
    function imsak() {
        if (setting.imsak && "minutes" in setting.imsak) {
            return fajr() - (setting.imsak.minutes || 0) / 60;
        }
        const time = sunAngleTime(setting.imsak?.degree || 0, 5 / 24, -1);
        const adjusted = adjustHLTime(
            time,
            sunrise(),
            setting.imsak?.degree || 0,
            nightTime(),
            -1
        );

        return adjusted;
    }
    function fajr() {
        const time = sunAngleTime(setting.fajr?.degree || 0, 5 / 24, -1);
        const adjusted = adjustHLTime(
            time,
            sunrise(),
            setting.fajr?.degree || 0,
            nightTime(),
            -1
        );
        return adjusted;
    }
    function sunset() {
        return sunAngleTime(riseSetAngle(), 18 / 24);
    }
    function sunrise() {
        return sunAngleTime(riseSetAngle(), 6 / 24, -1);
    }

    function nightTime() {
        return timeDifference(sunset(), sunrise());
    }

    //---------------------- Calculation Functions -----------------------

    // compute mid-day time
    function midDay(time: number) {
        const eqt = sunPosition(julianDate + time).equation;
        const noon = DMath.fixHour(12 - eqt) - location.longitude / 15;
        return noon;
    }

    // compute the time at which sun reaches a specific angle below horizon
    function sunAngleTime(angle: number, time: number, direction: 1 | -1 = 1) {
        const decl = sunPosition(julianDate + time).declination;
        const noon = midDay(time);
        const t =
            (1 / 15) *
            DMath.arccos(
                (-DMath.sin(angle) -
                    DMath.sin(decl) * DMath.sin(location.latitude)) /
                    (DMath.cos(decl) * DMath.cos(location.latitude))
            );
        return noon + direction * t;
    }

    // compute asr time
    function asrTime(factor: number, time: number) {
        const decl = sunPosition(julianDate + time).declination;
        const angle = -DMath.arccot(
            factor + DMath.tan(Math.abs(location.latitude - decl))
        );
        return sunAngleTime(angle, time);
    }

    // compute declination angle of sun and equation of time
    // Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php

    //---------------------- Compute Prayer Times -----------------------

    // return sun angle for sunset/sunrise
    function riseSetAngle() {
        //var earthRad = 6371009; // in meters
        //var angle = DMath.arccos(earthRad/(earthRad+ elv));
        const angle = 0.0347 * Math.sqrt(location.elevation || 0); // an approximation
        return 0.833 + angle;
    }

    // adjust a time for higher latitudes
    function adjustHLTime(
        time: number,
        base: number,
        angle: number,
        night: number,
        direction: 1 | -1 = 1
    ) {
        if (setting.highLats == "None") {
            return time;
        }
        const portion = nightPortion(angle, night);
        const timeDiff =
            direction == -1
                ? timeDifference(time, base)
                : timeDifference(base, time);
        if (isNaN(time) || timeDiff > portion) {
            time = base + direction * portion;
        }
        return time;
    }

    // the night portion used for adjusting times in higher latitudes
    function nightPortion(angle: number, night: number) {
        const method = setting.highLats;
        let portion = 1 / 2; // MidNight
        if (method == "AngleBased") portion = (1 / 60) * angle;
        if (method == "OneSeventh") portion = 1 / 7;
        return portion * night;
    }

    // compute the difference between two times
    function timeDifference(time1: number, time2: number) {
        return DMath.fixHour(time2 - time1);
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
