# mmwr-week [![npm](https://img.shields.io/npm/v/mmwr-week.svg)]()

Tiny port of [MMWRWeek](https://github.com/jarad/MMWRweek) to JavaScript.

```shell
npm install mmwr-week
```

```js
→ const mmwr = require('mmwr-week')
→ const moment = require('moment')


// MMWR week to moment object
→ mmwr.MMWRWeekToDate(2016, 48) // moment("2016-11-27T00:00:00.000") 

// Moment date to MMWR week
→ mmwr.DateToMMWRWeek(moment('2016-11-27')) // { year: 2016, week: 48, day: 0 }

// Number of MMWR weeks in a year
→ mmwr.MMWRWeeksInYear(2016) // 52

// Week delta
→ mmwr.MMWRWeekWithDelta(2016, 3, -4) // { year: 2015, week: 51 }
```
