// Convert MMWR weeks <--> dates

import * as moment from 'moment'

interface MMWRWeek {
  year: number,
  week: number,
  day?: number
}

/**
 * Return start date of the year using MMWR week rules
 */
function startDateOfYear (year: number) {
  let janOne: any = moment(year + '0101')
  let diff = 7 * +(janOne.isoWeekday() > 3) - janOne.isoWeekday()
  return janOne.add(diff, 'days')
}

/**
 * Return date for given week (starts at Sunday)
 */
export function MMWRWeekToDate (mweek: MMWRWeek) {
  let dayOne = startDateOfYear(mweek.year)
  let diff = 7 * (mweek.week - 1)
  if (mweek.day) {
    diff += mweek.day - 1
  }
  return dayOne.add(diff, 'days')
}

/**
 * Return MMWR week with given week delta
 */
export function MMWRWeekWithDelta (mweek: MMWRWeek, delta: number): MMWRWeek {
  // delta.should.be.within(-52, 52) Don't care after that. FIXME
  let out = mweek.week + delta
  if (delta > 0) {
    let maxWeek = MMWRWeeksInYear(mweek.year)
    return {
      year: out > maxWeek ? mweek.year + 1 : mweek.year,
      week: out > maxWeek ? out - maxWeek : out
    }
  } else {
    let maxWeek = MMWRWeeksInYear(mweek.year - 1)
    return {
      year: out < 1 ? mweek.year - 1 : mweek.year,
      week: out < 1 ? maxWeek + out : out
    }
  }
}

/**
 * Convert given moment date (default: now) to MMWRWeek
 */
export function DateToMMWRWeek (date = moment()): MMWRWeek {
  let year = date.year()
  let startDates = [year - 1, year, year + 1]
      .map(y => startDateOfYear(y))
  let diffs = startDates.map(d => date.diff(d))

  let startId = 1
  if (diffs[1] < 0) startId = 0
  else if (diffs[2] >= 0) startId = 2

  let startDate = startDates[startId]

  return {
    year: moment(startDate).add(7, 'days').year(),
    week: Math.floor(date.diff(startDate, 'days') / 7) + 1,
    day: (date.isoWeekday() % 7) + 1
  }
}

/**
 * Return the number of MMWR weeks in a year
 */
export function MMWRWeeksInYear (year: number): number {
  return DateToMMWRWeek(MMWRWeekToDate({
    year: year,
    week: 53
  })).year === year ? 53 : 52
}

/**
 * Return number of weeks between given MMWR weeks
 */
export function MMWRWeekDiff (mweekLow: MMWRWeek, mweekHigh: MMWRWeek): number {
  if (mweekLow.year === mweekHigh.year) {
    return mweekHigh.week - mweekLow.week
  } else {
    let diff = mweekHigh.week + (MMWRWeeksInYear(mweekLow.year) - mweekLow.week)

    let low = mweekLow.year + 1
    while (low < mweekHigh.year) {
      diff += MMWRWeeksInYear(low)
      low++
    }
    return diff
  }
}

