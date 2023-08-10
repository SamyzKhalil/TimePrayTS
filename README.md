# pray-times

Prayer Times Calculator for JavaScript Based on [Praytimes.org](https://praytimes.org).

This is a refactor of the original Praytimes.org source code to make it more usable with npm and JavaScript. The output formats have also been updated - see Output Philosophy section for more details.

## Installation

Install with npm:

```
npm install pray-times
```

## Usage

Import the functions:

```js
import { getPrayerCalculator, methods } from "pray-times";
```

Create calculator:

```js
const calculator = getPrayerCalculator(methods.MWL);
```

Get prayer times:

```js
const times = calculator(
  {
    longitude: -0.1,
    latitude: 51.5,
  },
  new Date()
);
```

Output times:

```js
for (const time of Object.keys(times)) {
  console.log(times[time].toISOString());
}
```

## Configuration

For most uses, the predefined methods are sufficient:

```js
const calculator = getPrayerCalculator(methods.Jafari);
```

Warning: The parameters are not meant for tuning times - use the tuning function instead.

For advanced usage, you can provide custom calculation parameters. The default method is MWL. Any custom params will override defaults. See PrayTimes Manual for details.

### Example Configuration

```js
const params = {
  imsak: { minutes: 10 },
  fajr: { degree: 18 },
  dhuhr: { minutes: 0 },
  asr: { factor: 1 },
  maghrib: { minutes: 0 },
  isha: { degree: 17 },
  midnight: "Standard",
  highLats: "NightMiddle"
};
```

#### Calculation Methods

Supported methods:

- MWL - Muslim World League
- ISNA - Islamic Society of North America
- Egypt - Egyptian General Authority of Survey
- Makkah - Umm al-Qura, Makkah
- Karachi - University of Islamic Sciences, Karachi
- Tehran - Institute of Geophysics, University of Tehran
- Jafari - Shia Ithna Ashari, Leva Institute, Qum

## API Reference

### getCalculator(settings)

Creates a prayer time calculator initialized with given settings.

Returns a function that can be called to get prayer times by passing location and date.

#### calculator(location, date)

Given a location and date, computes prayer times.

- location - Object with latitude and longitude
- date - JavaScript Date object

Returns an object with prayer times mapped to time names. Prayer times are Date objects.

Time names:

- imsak
- fajr
- sunrise
- dhuhr
- asr
- sunset
- maghrib
- isha
- midnight

### tuning

You can tune times for precaution using the tune method:

```js
import { tune } from "pray-times";

// Calculate times
const tunedTimes = tune({ fajr: -3 }, times);
```

The first parameter is a map of pray times to a number of minutes to adjust the time.

For example:

```js
{
  fajr: 2023-08-10T08:17:23.544Z,
  // ...
}
```

Becomes:

```js
{
  fajr: 2023-08-10T08:14:23.544Z,
  // ...
}
```

### formatting

#### format

Formats prayer times into a desired format.

```js
format(times, format, timezone?)
```

Parameters:

- times (PraytimesOutput) - Times object to format
- format (Format) - Format preset. Options:
  - "24h" - 24 hour
  - "12h" - 12 hour with AM/PM
  - "12hNS" - 12 hour with no suffix
  - "Float" - Floating point hours
- timezone (number) - Optional UTC offset in hours

Returns: Object with formatted times.

Example:

```js
const formatted = format({
  fajr: new Date('2023-03-01T13:15:00Z'),
  dhuhr: new Date('2023-03-01T20:30:00Z'),
  asr: new Date('2023-03-02T00:45:00Z')
}, '12h', -8);

// {
//   fajr: "5:15AM",
//   dhuhr: "12:30PM",
//   asr: "4:45PM"
// }
```


#### formatTime

Formats a Date object into a time string.

```js
formatTime(format, date, timezone?)
```

Parameters:

- format (Format) - Format preset
- date (Date) - Date to format
- timezone (number) - Optional UTC offset in hours

Returns: (string) - Formatted time string

Example:

```js
formatTime('24h', new Date())
```

## Output Philosophy

The original code output prayer times as strings (e.g. '12:20').

This package outputs Date objects, which better represent prayer times as absolute moments in time, independent of timezone.

The format utility can be used to convert to strings as needed:

```js
import { format } from "pray-times";

const formattedTimes = format(times);
```

## Tests

Tests enforce accuracy within 50ms of original Praytimes.org calculations using a dataset of 150,000 cities globally. Dates, calculation methods, and parameters are randomly generated for robust testing.

## Credits

PrayTimes.js is based on [PrayTimes](http://praytimes.org). Cities dataset from [countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database).

## License

GNU LGPL v3.0 - see LICENSE
