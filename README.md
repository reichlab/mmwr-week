# mmwr-week [![npm](https://img.shields.io/npm/v/mmwr-week.svg)](https://www.npmjs.com/package/mmwr-week)

Tiny port of [MMWRWeek](https://github.com/jarad/MMWRweek) to TypeScript.
Weekdays go from Sunday (1) to Saturday (7). Read full documentation
[here](http://reichlab.io/mmwr-week).

```shell
npm install mmwr-week
```

```js
→ const mmwr = require('mmwr-week')
→ const moment = require('moment')

// Create MMWRDate object
→ let mdate = new mmwr.MMWRDate(2016, 48)
// MMWRDate { year: 2016, week: 48, day: undefined }

// First day of year according to MMWRDate
→ mdate.startMomentDate
// returns moment("2016-01-03T00:00:00.000")

// Convert to moment object
→ mdate.toMomentDate()
// returns moment("2016-11-27T00:00:00.000")

// Moment date to MMWRDate
→ mdate.fromMomentDate(moment('2016-12-27'))
// returns nothing, mutates mdate to MMWRDate { year: 2016, week: 52, day: 3 }

// Convert to epiweek
→ mdate.toEpiweek()
// returns 201652

// Import from epiweek
→ mdate.fromEpiweek(201732)
// returns nothing, mutates mdate to MMWRDate { year: 2017, week: 32, day: 1 }

// Number of MMWR weeks in a year
→ mdate.nWeeks
// returns 52

// Week difference (mdate - odate)
→ let odate = new mmwr.MMWRDate(2016, 3)
→ mdate.diffWeek(odate)
// returns 81

// Apply week diff
→ mdate.applyWeekDiff(56)
// returns nothing, mutates mdate to MMWRDate { year: 2018, week: 36, day: 1 }
```
