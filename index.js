// Convert MMWR weeks <--> dates

import moment from 'moment'
import chai from 'chai'

chai.should()

/**
 * Return start date of the year using MMWR week rules
 */
const startDateOfYear = year => {
  year.should.be.a('number')

  let janOne = moment(year + '0101')
  let diff = 7 * (janOne.isoWeekday() > 3) - janOne.isoWeekday()
  return janOne.add(diff, 'days')
}

/**
 * Return date for given week (starts at Sunday)
 */
export const MMWRWeekToDate = (year, week, day = 1) => {
  year.should.be.a('number')
  week.should.be.a('number')
  day.should.be.a('number')
  week.should.be.within(1, 53)
  day.should.be.within(1, 7)

  let dayOne = startDateOfYear(year)
  let diff = 7 * (week - 1) + (day - 1)
  return dayOne.add(diff, 'days')
}

/**
 * Return MMWR week with given week delta
 */
export const MMWRWeekWithDelta = (year, week, delta) => {
  year.should.be.a('number')
  week.should.be.a('number')
  delta.should.be.a('number')
  week.should.be.within(1, 53)
  delta.should.be.within(-52, 52) // Don't care after that. FIXME

  let out = week + delta

  if (delta > 0) {
    let maxWeek = MMWRWeeksInYear(year)
    return {
      year: out > maxWeek ? year + 1 : year,
      week: out > maxWeek ? out - maxWeek : out
    }
  } else {
    let maxWeek = MMWRWeeksInYear(year - 1)
    return {
      year: out < 1 ? year - 1 : year,
      week: out < 1 ? maxWeek + out : out
    }
  }
}

/**
 * Convert given moment date (default: now) to MMWRWeek
 */
export const DateToMMWRWeek = (date = moment()) => {
  date.should.be.an.instanceof(moment)

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
export const MMWRWeeksInYear = year => {
  year.should.be.a('number')

  return DateToMMWRWeek(MMWRWeekToDate(year, 53)).year === year ? 53 : 52
}

/**
 * Return number of weeks between given MMWR weeks
 */
export const MMWRWeekDiff = (yearLow, weekLow, yearHigh, weekHigh) => {
  yearHigh.should.be.at.least(yearLow)

  if (yearLow === yearHigh) {
    return weekHigh - weekLow
  } else {
    let diff = weekHigh + (MMWRWeeksInYear(yearLow) - weekLow)

    let low = yearLow + 1
    while (low < yearHigh) {
      diff += MMWRWeeksInYear(low)
      low++
    }
    return diff
  }
}
