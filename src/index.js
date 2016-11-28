// Convert MMWR weeks <--> dates

import moment from 'moment'

/**
 * Return start date of the year using MMWR week rules
 */
const startDateOfYear = year => {
  let janOne = moment(year + '0101')
  let diff = 7 * (janOne.weekday() > 3) - janOne.weekday()
  return janOne.add(diff, 'days')
}

/**
 * Return date for Sunday (default) of given week
 */
export const MMWRWeekToDate = (year, week, day = 0) => {
  let dayOne = startDateOfYear(year)
  let diff = 7 * (week - 1) + day
  return dayOne.add(diff, 'days')
}

/**
 * Convert given moment date (default: now) to MMWRWeek
 */
export const DateToMMWRWeek = (date = moment()) => {
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
    day: date.weekday()
  }
}

/**
 * Return the number of MMWR weeks in a year
 */
export const MMWRWeeksInYear = year => {
  return DateToMMWRWeek(MMWRWeekToDate(year, 53)).year === year ? 53 : 52
}
