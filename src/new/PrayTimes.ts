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

//--------------------- Help and Manual ----------------------
/*

User's Manual:
http://praytimes.org/manual

Calculation Formulas:
http://praytimes.org/calculation



//------------------------ User Interface -------------------------


    getTimes (date, coordinates [, timeZone [, dst [, timeFormat]]])

    setMethod (method)       // set calculation method
    adjust (parameters)      // adjust calculation parameters
    tune (offsets)           // tune times by given offsets

    getMethod ()             // get calculation method
    getSetting ()            // get current calculation parameters
    getOffsets ()            // get current time offsets


//------------------------- Sample Usage --------------------------


    var PT = new PrayTimes('ISNA');
    var times = PT.getTimes(new Date(), [43, -80], -5);
    document.write('Sunrise = '+ this.sunrise())


*/

//----------------------- PrayTimes Class ------------------------
import { Params } from "../types/oldTypes";
import * as DMath from "./utils/degree-math";

class PrayTimes {
    //------------------------ Constants --------------------------

    constructor(
        private setting: Params,
        date: Date,
        [latitude, longitude, elevation = 0]: [number, number, number?]
    ) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.elevation = elevation;
        this.julianDate =
            this.julian(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate()
            ) -
            this.longitude / (15 * 24);
    }
    numIterations = 1;

    latitude: number;
    longitude: number;

    elevation: number;

    julianDate: number;

    public getTimes() {
        return {
            dhuhr: this.dhuhr(),
            sunset: this.sunset(),
            sunrise: this.sunrise(),
            asr: this.asr(),
            fajr: this.fajr(),
            imsak: this.imsak(),
            maghrib: this.maghrib(),
            isha: this.isha(),
            midnight: this.midnight(),
        };
    }
    private asr() {
        return this.asrTime(this.setting.asr || 1, 13 / 24);
    }

    private dhuhr() {
        return this.midDay(12 / 24);
    }
    private midnight() {
        return this.setting.midnight == "Jafari"
            ? this.sunset() + this.timeDiff(this.sunset(), this.fajr()) / 2
            : this.sunset() + this.timeDiff(this.sunset(), this.sunrise()) / 2;
    }

    private isha() {
        if (this.setting.isha?.isMinutes) {
            return this.maghrib() + (this.setting.isha.value || 0) / 60;
        }

        const time = this.sunAngleTime(this.setting.isha?.value || 0, 18 / 24);
        const adjusted = this.adjustHLTime(
            time,
            this.sunset(),
            this.setting.isha?.value || 0,
            this.nightTime()
        );
        return adjusted;
    }
    private maghrib() {
        if (this.setting.maghrib?.isMinutes) {
            return this.sunset() + (this.setting.maghrib.value || 0) / 60;
        }

        const time = this.sunAngleTime(
            this.setting.maghrib?.value || 0,
            18 / 24
        );
        const adjusted = this.adjustHLTime(
            time,
            this.sunset(),
            this.setting.maghrib?.value || 0,
            this.nightTime()
        );

        return adjusted;
    }
    private imsak() {
        if (this.setting.imsak?.isMinutes) {
            return this.fajr() - (this.setting.imsak.value || 0) / 60;
        }
        const time = this.sunAngleTime(
            this.setting.imsak?.value || 0,
            5 / 24,
            -1
        );
        const adjusted = this.adjustHLTime(
            time,
            this.sunrise(),
            this.setting.imsak?.value || 0,
            this.nightTime(),
            -1
        );

        return adjusted;
    }
    private fajr() {
        const time = this.sunAngleTime(
            this.setting.fajr?.value || 0,
            5 / 24,
            -1
        );
        const adjusted = this.adjustHLTime(
            time,
            this.sunrise(),
            this.setting.fajr?.value || 0,
            this.nightTime(),
            -1
        );
        return adjusted;
    }
    private sunset() {
        return this.sunAngleTime(this.riseSetAngle(), 18 / 24);
    }
    private sunrise() {
        return this.sunAngleTime(this.riseSetAngle(), 6 / 24, -1);
    }

    private nightTime() {
        return this.timeDiff(this.sunset(), this.sunrise());
    }

    //---------------------- Calculation Functions -----------------------

    // compute mid-day time
    private midDay(time: number) {
        const eqt = this.sunPosition(this.julianDate + time).equation;
        const noon = DMath.fixHour(12 - eqt) - this.longitude / 15;
        return noon;
    }

    // compute the time at which sun reaches a specific angle below horizon
    private sunAngleTime(angle: number, time: number, direction: 1 | -1 = 1) {
        const decl = this.sunPosition(this.julianDate + time).declination;
        const noon = this.midDay(time);
        const t =
            (1 / 15) *
            DMath.arccos(
                (-DMath.sin(angle) -
                    DMath.sin(decl) * DMath.sin(this.latitude)) /
                    (DMath.cos(decl) * DMath.cos(this.latitude))
            );
        return noon + direction * t;
    }

    // compute asr time
    private asrTime(factor: number, time: number) {
        const decl = this.sunPosition(this.julianDate + time).declination;
        const angle = -DMath.arccot(
            factor + DMath.tan(Math.abs(this.latitude - decl))
        );
        return this.sunAngleTime(angle, time);
    }

    // compute declination angle of sun and equation of time
    // Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php
    private sunPosition(jd: number) {
        const D = jd - 2451545.0;
        const g = DMath.fixAngle(357.529 + 0.98560028 * D);
        const q = DMath.fixAngle(280.459 + 0.98564736 * D);
        const L = DMath.fixAngle(
            q + 1.915 * DMath.sin(g) + 0.02 * DMath.sin(2 * g)
        );

        const e = 23.439 - 0.00000036 * D;

        const RA =
            DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
        const eqt = q / 15 - DMath.fixHour(RA);
        const decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L));

        return { declination: decl, equation: eqt };
    }

    // convert Gregorian date to Julian day
    // Ref: Astronomical Algorithms by Jean Meeus
    private julian(year: number, month: number, day: number) {
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        const A = Math.floor(year / 100);
        const B = 2 - A + Math.floor(A / 4);

        const JD =
            Math.floor(365.25 * (year + 4716)) +
            Math.floor(30.6001 * (month + 1)) +
            day +
            B -
            1524.5;
        return JD;
    }

    //---------------------- Compute Prayer Times -----------------------

    // return sun angle for sunset/sunrise
    private riseSetAngle() {
        //var earthRad = 6371009; // in meters
        //var angle = DMath.arccos(earthRad/(earthRad+ this.elv));
        const angle = 0.0347 * Math.sqrt(this.elevation); // an approximation
        return 0.833 + angle;
    }

    // convert times to given time format

    // adjust a time for higher latitudes
    private adjustHLTime(
        time: number,
        base: number,
        angle: number,
        night: number,
        direction: 1 | -1 = 1
    ) {
        if (this.setting.highLats == "None") {
            return time;

            // adjustHighLats
        }
        const portion = this.nightPortion(angle, night);
        const timeDiff =
            direction == -1
                ? this.timeDiff(time, base)
                : this.timeDiff(base, time);
        if (isNaN(time) || timeDiff > portion) {
            time = base + direction * portion;
        }
        return time;
    }

    // the night portion used for adjusting times in higher latitudes
    private nightPortion(angle: number, night: number) {
        const method = this.setting.highLats;
        let portion = 1 / 2; // MidNight
        if (method == "AngleBased") portion = (1 / 60) * angle;
        if (method == "OneSeventh") portion = 1 / 7;
        return portion * night;
    }

    //---------------------- Misc Functions -----------------------

    // compute the difference between two times
    private timeDiff(time1: number, time2: number) {
        return DMath.fixHour(time2 - time1);
    }
}

//---------------------- Degree-Based Math Class -----------------------

//---------------------- Init Object -----------------------
//

export default PrayTimes;
