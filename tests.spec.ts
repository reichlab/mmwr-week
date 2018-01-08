import { Epiweek, MMWRDate } from './index'
import { expect } from 'chai'
import 'mocha'
import * as moment from 'moment'

describe('MMWRDate', () => {

  it('should initialize correctly', () => {
    let mdate = new MMWRDate(2016, 48)
    expect(mdate.year).to.equal(2016)
    expect(mdate.week).to.equal(48)
    expect(mdate.day).to.equal(undefined)
  })

  it('should return correct first day of season', () => {
    let mdate = new MMWRDate(2016, 48)
    expect(mdate.startMomentDate.isSame(moment('2016-01-03T00:00:00.000'))).to.be.true
  })

  it('should return correct moment date', () => {
    let mdate = new MMWRDate(2016, 48)
    expect(mdate.toMomentDate().isSame(moment('2016-11-27T00:00:00.000'))).to.be.true
  })

  it('should read correctly from moment date', () => {
    let mdate = new MMWRDate(2016)
    mdate.fromMomentDate(moment('2016-12-27'))

    expect(mdate.year).to.equal(2016)
    expect(mdate.week).to.equal(52)
    expect(mdate.day).to.equal(3)
  })

  it('should return correct epiweek', () => {
    let mdate = new MMWRDate(2016, 52)
    expect(mdate.toEpiweek()).to.equal(201652)
  })

  it('should read correctly from epiweek', () => {
    let mdate = new MMWRDate(2016)
    mdate.fromEpiweek(201732)

    expect(mdate.year).to.equal(2017)
    expect(mdate.week).to.equal(32)
    expect(mdate.day).to.equal(1)
  })

  it('should return correct number of weeks', () => {
    let mdate = new MMWRDate(2016)
    expect(mdate.nWeeks).to.equal(52)

    mdate = new MMWRDate(2014)
    expect(mdate.nWeeks).to.equal(53)
  })

  it('should return correct week difference', () => {
    let mdate = new MMWRDate(2016, 52)
    let odate = new MMWRDate(2016, 3)

    expect(mdate.diffWeek(odate)).to.equal(49)
  })

  it('should apply correct week difference', () => {
    let mdate = new MMWRDate(2016, 52, 3)
    mdate.applyWeekDiff(56)

    expect(mdate.year).to.equal(2018)
    expect(mdate.week).to.equal(4)
    expect(mdate.day).to.equal(3)
  })
})
