/**
 * Main module file for mmwr-week
 */

/**
 * Doc guard
 */
import * as moment from 'moment'

/**
 * Epiweek in format yyyyww
 */
export type Epiweek = number

/**
 * Class representing an MMWR date
 */
export class MMWRDate {
  constructor (public year: number, public week?: number, public day?: number) {}

  /**
   * Return year start moment date
   */
  get startMomentDate () {
    let janOne: any = moment(this.year + '0101')
    let diff = 7 * +(janOne.isoWeekday() > 3) - janOne.isoWeekday()
    return janOne.add(diff, 'days')
  }

  /**
   * Return a moment representation
   */
  toMomentDate () {
    let dayOne = this.startMomentDate
    let diff = 7 * (this.week - 1)
    if (this.day) {
      diff += this.day - 1
    }
    return dayOne.add(diff, 'days')
  }

  /**
   * Set values using given moment date
   */
  fromMomentDate (date = moment()) {
    let year = date.year()
    let startDates = [year - 1, year, year + 1]
      .map(y => {
        let md = new MMWRDate(y)
        return md.startMomentDate
      })
    let diffs = startDates.map(d => date.diff(d))

    let startId = 1
    if (diffs[1] < 0) startId = 0
    else if (diffs[2] >= 0) startId = 2

    let startDate = startDates[startId]

    this.year = moment(startDate).add(7, 'days').year()
    this.week = Math.floor(date.diff(startDate, 'days') / 7) + 1
    this.day = (date.isoWeekday() % 7) + 1
  }

  /**
   * Return date in epiweek format
   */
  toEpiweek (): Epiweek {
    return this.year * 100 + this.week
  }

  /**
   * Set values using epiweek stamp
   */
  fromEpiweek (epiweek: Epiweek) {
    this.year = Math.floor(epiweek / 100)
    this.week = epiweek % 100
    this.day = 1
  }

  /**
   * Number of weeks in this MMWR season
   */
  get nWeeks (): number {
    let md = new MMWRDate(this.year, 53)
    md.fromMomentDate(md.toMomentDate())
    return md.year === this.year ? 53 : 52
  }

  /**
   * Return number of weeks differing from this
   */
  diffWeek (mdate: MMWRDate): number {
    if (this.year === mdate.year) {
      return this.week - mdate.week
    } else {
      // Order of dates [low, high]
      let ds = [this, mdate]
      let sign = -1
      if (this.year > mdate.year) {
        ds = [mdate, this]
        sign = 1
      }

      let diff = ds[1].week + ds[0].nWeeks - ds[0].week

      let begin = ds[0].year + 1
      while (begin < ds[1].year) {
        diff += ds[0].nWeeks
        begin++
      }
      return sign * diff
    }
  }

  /**
   * Apply week delta
   */
  applyWeekDiff (delta: number) {
    let newWeek

    while (true) {
      newWeek = this.week + delta
      if (delta > 0) {
        if (newWeek > this.nWeeks) {
          delta = newWeek - this.nWeeks - 1
          this.week = 1
          this.year++
        } else {
          this.week = newWeek
          break
        }
      } else {
        if (newWeek <= 0) {
          this.year--
          this.week = this.nWeeks
          delta = newWeek
        } else {
          this.week = newWeek
          break
        }
      }
    }
  }
}
