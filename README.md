# pray-times

Prayer Times Calculator for JavaScript Based on
[Praytimes.org](https://Praytimes.org). The original source code of
Praytimes.org was so old and was not packaged for npm so it was hard to actually
make it usable, additionally its output and input formats weren't really
suitable see [output philosophy](#output-philosophy) for more information
although there is no guarantee that this code works exactly the same as
Praytimes.org's version but it at least tested against a huge cities dataset for
matching the results (see [tests](#tests) for more information)

## Installation

```
npm install pray-times
```

## Usage

```js
import { getPrayerCalculator, methods } from "praytimes";

let calculator = getPrayerCalculator(methods.MWL);

let times = calculator(
    {
        longitude: -0.1,
        latitude: 51.5,
    },
    new Date(),
);

for (let time of Object.keys(times)) {
    console.log(times[time].toISOString());
}
```

## Configuration

For most users the already implemented calculation methods are enough for
example:

```ts
let calculator = getPrayerCalculator(methods.Jafari); // create a calculator based on Jafari method's parameters
```
**Warning:** these parameters aren't meant to be used as a way of tuning times for precaution there is another function for this purpose (see [tuning](#tuning))!
but if you want a more advanced usage you can provide your own calculation
parameters the default method for calculation is MWL method and anything else
will override it for more information about the details of these parameters see
[Praytimes manual](http://praytimes.org/manual)

### Example configuration

```ts
const params: Params = {
    imsak: { minutes: 10 },
    fajr: { degree: 18 },
    dhuhr: { minutes: 0 },
    asr: { factor: 1 },
    maghrib: { minutes: 0 },
    isha: { degree: 17 },
    midnight: "Standard",
    highLats: "NightMiddle",
};
```

here is a description for the parameters:

### imsak

-   Type: `Degrees | Minutes`
-   Default: `{minutes: 10}`

The sun angle below the horizon or minutes before Fajr to calculate Imsak time.

### fajr

-   Type: `Degrees`
-   Default: `{degree: 18}`

The sun angle below the horizon to use for calculating Fajr time. Specified in
degrees below the horizon.

### dhuhr

-   Type: `Minutes`
-   Default: `{minutes: 0}`

The number of minutes after (or before with negative value) midday to calculate
Dhuhr time.

### asr

-   Type: `{factor: number}`
-   Default: `{factor: 1}`

The shadow factor to use for calculating Asr time.

### maghrib

-   Type: `Degrees | Minutes`
-   Default: `{minutes: 0}`

The sun angle below the horizon or minutes after sunset to calculate Maghrib
time.

### isha

-   Type: `Degrees | Minutes`
-   Default: `{degree: 17}`

The sun angle below the horizon or minutes after Maghrib to calculate Isha time.

### midnight

-   Type: `MidnightMethod` (`"Standard" | "Jafari"`)
-   Default: `"Standard"`

The method to use for calculating midnight. Options are "Standard" or "Jafari".

### highLats

-   Type: `HighLatsMethod`
-   Default: `"NightMiddle"`

The adjustment method to use for higher latitudes. Options are "None",
"NightMiddle", "OneSeventh", or "AngleBased".

### Calculation Methods

Supported methods are:

-   `MWL` - Muslim World League
-   `ISNA` - Islamic Society of North America
-   `Egypt` - Egyptian General Authority of Survey
-   `Makkah` - Umm al-Qura, Makkah
-   `Karachi` - University of Islamic Sciences, Karachi
-   `Tehran` - Institute of Geophysics, University of Tehran
-   `Jafari` - Shia Ithna Ashari, Leva Institute, Qum

## API Reference

### getCalculator(settings)

Creates a prayer time calculator initialized with given settings.

Returns a function that can be called to get prayer times by passing location
and date.

### calculator(location, date)

Given a location and date, computes prayer times.

-   `location` - Object with latitude and longitude
-   `date` - JavaScript Date object ( the only important part is the date part and
    not the time part)

Returns an object with prayer times mapped to time names. Prayer times are Date
objects.

Time names are:

-   `imsak`
-   `fajr`
-   `sunrise`
-   `dhuhr`
-   `asr`
-   `sunset`
-   `maghrib`
-   `isha`
-   `midnight`

### tuning
you can tune times for precaution using the `tune` method like this :
```ts
import { tune } from "pray-times";
// calculate times
console.log(tune({ fajr: -3 }, times));
```
the first parameter of the function is a map of praytimes with a negative or positive number which represents minutes to tune a specific prayer time
for example given
this
```
{
  dhuhr: 2023-08-10T17:01:24.487Z,
  sunset: 2023-08-11T00:00:58.957Z,
  sunrise: 2023-08-10T10:01:16.019Z,
  asr: 2023-08-10T20:53:03.031Z,
  fajr: 2023-08-10T08:17:23.544Z,               // here is the difference
  imsak: 2023-08-10T08:07:23.544Z,
  maghrib: 2023-08-11T00:22:00.897Z,
  isha: 2023-08-11T01:19:54.920Z,
  midnight: 2023-08-11T04:09:11.250Z
}

```
will become this :
```
{
  dhuhr: 2023-08-10T17:01:24.487Z,
  sunset: 2023-08-11T00:00:58.957Z,
  sunrise: 2023-08-10T10:01:16.019Z,
  asr: 2023-08-10T20:53:03.031Z,
  fajr: 2023-08-10T08:14:23.544Z,               // here is the difference
  imsak: 2023-08-10T08:07:23.544Z,
  maghrib: 2023-08-11T00:22:00.897Z,
  isha: 2023-08-11T01:19:54.920Z,
  midnight: 2023-08-11T04:09:11.250Z
}
```
### formatting

#### format

Formats prayer times into a desired format.

```ts
format(times: Partial<PraytimesOutput>, format: Format, timezone?: number)
```

##### Parameters

- `times` (Partial<PraytimesOutput>) - The prayer times object to format
- `format` (Format) - The format to use. Options:
  - `"24h"` - 24 hour format (e.g. 13:45)
  - `"12h"` - 12 hour format with AM/PM (e.g. 1:45PM)
  - `"12hNS"` - 12 hour format with no suffix (e.g. 1:45)
  - `"Float"` - Floating point hours (e.g. 13.75)
- `timezone` (number) - Optional timezone offset from UTC in hours for time adjustment

##### Returns

(Object) - An object with prayer times formatted as strings.

##### Example

```js
const formatted = format({
  fajr: new Date('2023-03-01T06:15:00Z'),
  dhuhr: new Date('2023-03-01T13:30:00Z'),
  asr: new Date('2023-03-01T16:15:00Z')
}, '12h', -5);

// {
//   fajr: "6:15AM",
//   dhuhr: "1:30PM",
//   asr: "4:15PM"
// }
```

#### formatTime

Formats a Date object into a time string.

```ts
formatTime(format: Format, t: Date, timezone?: number)
```

##### Parameters

- `format` (Format) - Format to use (see format options above)
- `t` (Date) - Date to format
- `timezone` (number) - Optional timezone offset from UTC in hours

##### Returns

(string) - The formatted time string

##### Example

```js
formatTime('24h', new Date('2023-03-01T13:30:00'));

// '13:30'
```


## Output philosophy

The original code output's prayertimes as strings like '12:20' by default which
is good for most cases but the actually representation of a prayertime for a
given location at a given date is not a simple string like that, Its a moment in
time It is not related to any timezone so the best way to represent it is using
a timestamp number (or a Date object since Date object's only hold a timestamp)
there is a utility format function which can be used like :

```ts
import { format } from "pray-times";
// calculate times
console.log(format(times));
```

and it is based on the original code's formatter

pray-times's calculator doesn't contain a tuning feature you can achieve the
same behaviour with a utility function provided

```ts
import { tune } from "pray-times";
// calculate times
console.log(tune({ fajr: -3 }, times));
```

## Tests

this is actually a refactor of the original source code with the help of the
tests tests are enforcing the code to be as accurate as 50ms mistake by the
original source code's data across all cities the cities dataset is around 150
thousands cities all around the world and the test generates a random date and
method + higher latitude and midnight method for the city to be tested and it
enforces the output to match

## Credits

PrayTimes.js is based on [PrayTimes](http://praytimes.org). cities data for
testing is based on
[countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database)

## License

This project is licensed under the GNU LGPL v3.0 - see [LICENSE](LICENSE)
