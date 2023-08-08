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
import { Params } from "../types/oldTypes";
import * as DMath from "./utils/degree-math";

type Location = {
    longitude: number;
    latitude: number;
    elevation?: number;
};

class PrayTimes {
    //------------------------ Constants --------------------------

    constructor(
        private setting: Params,
        private location: Location,
        private date: Date
    ) {
        this.julianDate =
            this.julian(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate()
            ) -
            this.location.longitude / (15 * 24);
    }

    private julianDate: number;

    public getTimes() {
        return {
            dhuhr: this.toDate(this.dhuhr()),
            sunset: this.toDate(this.sunset()),
            sunrise: this.toDate(this.sunrise()),
            asr: this.toDate(this.asr()),
            fajr: this.toDate(this.fajr()),
            imsak: this.toDate(this.imsak()),
            maghrib: this.toDate(this.maghrib()),
            isha: this.toDate(this.isha()),
            midnight: this.toDate(this.midnight()),
        };
    }
    private asr() {
        return this.asrTime(this.setting.asr?.factor || 1, 13 / 24);
    }

    private dhuhr() {
        return this.midDay(12 / 24) + (this.setting.dhuhr?.minutes || 0) / 60;
    }
    private midnight() {
        return this.setting.midnight == "Jafari"
            ? this.sunset() + this.timeDiff(this.sunset(), this.fajr()) / 2
            : this.sunset() + this.timeDiff(this.sunset(), this.sunrise()) / 2;
    }

    private isha() {
        if (this.setting.isha && "minutes" in this.setting.isha) {
            return this.maghrib() + (this.setting.isha.minutes || 0) / 60;
        }

        const time = this.sunAngleTime(this.setting.isha?.degree || 0, 18 / 24);
        const adjusted = this.adjustHLTime(
            time,
            this.sunset(),
            this.setting.isha?.degree || 0,
            this.nightTime()
        );
        return adjusted;
    }
    private maghrib() {
        if (this.setting.maghrib && "minutes" in this.setting.maghrib) {
            return this.sunset() + (this.setting.maghrib.minutes || 0) / 60;
        }

        const time = this.sunAngleTime(
            this.setting.maghrib?.degree || 0,
            18 / 24
        );
        const adjusted = this.adjustHLTime(
            time,
            this.sunset(),
            this.setting.maghrib?.degree || 0,
            this.nightTime()
        );

        return adjusted;
    }
    private imsak() {
        if (this.setting.imsak && "minutes" in this.setting.imsak) {
            return this.fajr() - (this.setting.imsak.minutes || 0) / 60;
        }
        const time = this.sunAngleTime(
            this.setting.imsak?.degree || 0,
            5 / 24,
            -1
        );
        const adjusted = this.adjustHLTime(
            time,
            this.sunrise(),
            this.setting.imsak?.degree || 0,
            this.nightTime(),
            -1
        );

        return adjusted;
    }
    private fajr() {
        const time = this.sunAngleTime(
            this.setting.fajr?.degree || 0,
            5 / 24,
            -1
        );
        const adjusted = this.adjustHLTime(
            time,
            this.sunrise(),
            this.setting.fajr?.degree || 0,
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
        const noon = DMath.fixHour(12 - eqt) - this.location.longitude / 15;
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
                    DMath.sin(decl) * DMath.sin(this.location.latitude)) /
                    (DMath.cos(decl) * DMath.cos(this.location.latitude))
            );
        return noon + direction * t;
    }

    // compute asr time
    private asrTime(factor: number, time: number) {
        const decl = this.sunPosition(this.julianDate + time).declination;
        const angle = -DMath.arccot(
            factor + DMath.tan(Math.abs(this.location.latitude - decl))
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
        const angle = 0.0347 * Math.sqrt(this.location.elevation || 0); // an approximation
        return 0.833 + angle;
    }

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

    // compute the difference between two times
    private timeDiff(time1: number, time2: number) {
        return DMath.fixHour(time2 - time1);
    }
    toDate(hours: number) {
        if (isNaN(hours)) {
            return new Date(NaN);
        }
        return new Date(
            Date.UTC(
                this.date.getFullYear(),
                this.date.getMonth(),
                this.date.getDate(),
                Math.floor(hours),
                Math.floor((hours * 60) % 60),
                Math.floor((hours * 3600) % 60),
                Math.floor((hours * 3600 * 1000) % 1000)
            )
        );
    }
}

export default PrayTimes;
