'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MMWRWeeksInYear = exports.DateToMMWRWeek = exports.MMWRWeekToDate = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Convert MMWR weeks <--> dates

_chai2.default.should();

/**
 * Return start date of the year using MMWR week rules
 */
var startDateOfYear = function startDateOfYear(year) {
  year.should.be.a('number');

  var janOne = (0, _moment2.default)(year + '0101');
  var diff = 7 * (janOne.weekday() > 3) - janOne.weekday();
  return janOne.add(diff, 'days');
};

/**
 * Return date for Sunday (default) of given week
 */
var MMWRWeekToDate = exports.MMWRWeekToDate = function MMWRWeekToDate(year, week) {
  var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  year.should.be.a('number');
  week.should.be.a('number');
  day.should.be.a('number');
  week.should.be.within(1, 53);
  day.should.be.within(0, 6);

  var dayOne = startDateOfYear(year);
  var diff = 7 * (week - 1) + day;
  return dayOne.add(diff, 'days');
};

/**
 * Convert given moment date (default: now) to MMWRWeek
 */
var DateToMMWRWeek = exports.DateToMMWRWeek = function DateToMMWRWeek() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _moment2.default)();

  date.should.be.an.instanceof(_moment2.default);

  var year = date.year();
  var startDates = [year - 1, year, year + 1].map(function (y) {
    return startDateOfYear(y);
  });
  var diffs = startDates.map(function (d) {
    return date.diff(d);
  });

  var startId = 1;
  if (diffs[1] < 0) startId = 0;else if (diffs[2] >= 0) startId = 2;

  var startDate = startDates[startId];

  return {
    year: (0, _moment2.default)(startDate).add(7, 'days').year(),
    week: Math.floor(date.diff(startDate, 'days') / 7) + 1,
    day: date.weekday()
  };
};

/**
 * Return the number of MMWR weeks in a year
 */
var MMWRWeeksInYear = exports.MMWRWeeksInYear = function MMWRWeeksInYear(year) {
  year.should.be.a('number');

  return DateToMMWRWeek(MMWRWeekToDate(year, 53)).year === year ? 53 : 52;
};