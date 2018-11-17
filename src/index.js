/**
 *
 * DatePicker
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { monthNames, weekDays } from './utils/constants.js';
import Panel from './Panel.js';
import styles from './style.css'


/*eslint-disable */
function isLeapYear(year) {
  if (year % 100 === 0) {
    return year % 400 === 0 ? false : true;
  } else if (year % 4 === 0) {
    return true;
  } else return false;
}

const generateWeeks = weekDays.map(week => (
  <td  className={'week-td'}>
    {week}
  </td>
));

/*eslint-disable */
export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    let currentYear = new Date().getFullYear(); // yearIndex
    let currentMonth = new Date().getMonth(); //monthIndex
    let currentDay = new Date().getDate(); // today's date
    this.datePickerRef = null;
    this.state = {
      showCalendar: false,
      currentYear: currentYear,
      currentMonth: currentMonth,
      currentDay: currentDay,
      toShowPanel: false,
      toShow: 'Month',
      selectedDate: props.placeholder || 'Select Date',
      selectedDay: currentDay,
    };
  }

 
  showCalendarHandle = () => {
    this.setState({
      showCalendar: !this.state.showCalendar,
    });
    };

  monthStartingDay = date => {
    console.log('Date here :', date);
    return date.getDay();
  };
  selectDate = date => {
    let newDate =
      date.target.innerHTML +
      '-' +
      monthNames[this.state.currentMonth].name +
      '-' +
      this.state.currentYear;
    this.setState({
      selectedDate: newDate,
      selectedDay: date.target.innerHTML,
      showCalendar: false,
    });
  };
  generateDays = (monthIndex, year) => {
    let leapYear = isLeapYear(year);
    if (leapYear) {
      monthNames[1].days = 29;
    }
    let startingDay = this.monthStartingDay(
      new Date(`${monthNames[monthIndex].name} 1 ${year}`),
    );
    return this.generateGrid(startingDay, monthNames[monthIndex].days);
  };

  generateGrid = (startingDay = 0, NoOfDays = 28) => {
    let counter = 1,
      row = 4 + ((NoOfDays % 7) + startingDay >= 7 ? 2 : 1),
      column = 7,
      i = 0,
      j = 0,
      columnLoop = startingDay,
      firstRow,
      lastRow;
    let flag = 0;
    let rows = [];

    for (i = 0; i < row; i++) {
      let columns = [];
      column = i === row - 1 ? ((NoOfDays % 4) + startingDay) % 7 : 7;
      for (j = columnLoop; j < column; j++) {
        columns.push(
          <div className='item-wrapper'>
            <span className={['day-li',counter === parseInt(this.state.selectedDay) && 'day-li-active'].join(' ')}
              onClick={this.selectDate}
            >
              {counter++}
            </span>
          </div>,
        );
      }
      if (flag === 0) {
        firstRow = columns;
      }
      flag = 1;
      if (flag == 1) {
        columnLoop = 0;
      }

      if (i === row - 1) {
        lastRow = columns;
      }

      rows.push(<div className='column'>{columns}</div>);
    }
    this.previousDays(startingDay, firstRow);
    this.nextDays((NoOfDays + startingDay) % 7, lastRow);
    return <div className='row'>{rows}</div>;
  };
  previousDays = (startingDay, firstRow) => {
    let previousMonth =
      this.state.currentMonth === 0 ? 11 : (this.state.currentMonth - 1) % 12;
    let previousMonthLastdate = monthNames[previousMonth].days;
    let i;
    for (i = 0; i < startingDay; i++) {
      firstRow.unshift(
        <div className='item-wrapper'>
          <span className='day-li invisible'>
            {previousMonthLastdate - i}
          </span>
        </div>,
      );
    }
    return firstRow;
  };
  nextDays = (endDay, lastRow) => {
    let i;
    if (endDay) {
      for (i = 1; i <= 7 - endDay; i++) {
        lastRow.push(
          <div className='item-wrapper'>
            <span className='day-li invisible'>
              {i}
            </span>
          </div>,
        );
      }
    }
    return lastRow;
  };

  previousMonth = () => {
    this.setState({
      currentMonth: (this.state.currentMonth - 1) % 12,
    });
  };
  nextMonth = () => {
    this.setState({
      currentMonth: (this.state.currentMonth + 1) % 12,
    });
  };
  previousYear = () => {
    this.setState({
      currentYear: this.state.currentYear - 1,
    });
  };
  nextYear = () => {
    this.setState({
      currentYear: this.state.currentYear + 1,
    });
  };
  showMonthPanel = () => {
    this.setState({
      toShowPanel: true,
      toShow: 'Month',
    });
  };
  showYearPanel = () => {
    this.setState({
      toShowPanel: true,
      toShow: 'Year',
    });
  };

  selectMonth = month => {
    console.log('Month selected :', month);
    this.setState({
      currentMonth: month,
      toShowPanel: false,
    });
  };
  selectYear = year => {
    console.log('Year selected :', year);
    this.setState({
      currentYear: year,
      toShowPanel: false,
    });
  };
  mouseLeave = () => {
    this.setState({
      showCalendar: false,
    });
  };
  render() {
    return (
      <div className="wrapper"
        innerRef={ref => (this.datePickerRef = ref)}
        tabIndex={0}
        onBlur={this.mouseLeave}
      >
        <div className='container' onClick={this.showCalendarHandle}>
          <p className='selected-date'>{this.state.selectedDate}</p>
          <div
            onClick={this.showCalendarHandle}
            className='down-arrow'
          >&#8964;
          </div>
        </div>
        <div className={this.state.showCalendar ? 'calendar-active' : 'calendar-inactive'}>
          <div className="month-and-year">
            <div className='month-container'>
              <div className='previous-arrow' onClick={this.previousMonth}>&#x22B2;</div>
              <p onClick={this.showMonthPanel}>
                {monthNames[this.state.currentMonth].name}
              </p>
              <div className='next-arrow' onClick={this.nextMonth}>&#x22B3;</div>
            </div>
            <div className='year-container'>
              <div className='previous-arrow' onClick={this.previousYear}>&#x22B2;</div>
              <p className='year' onClick={this.showYearPanel}>{this.state.currentYear}</p>
              <div className='next-arrow' onClick={this.nextYear}>&#x22B3;</div>
            </div>
          </div>
          {!this.state.toShowPanel ? (
            <React.Fragment>
              <div className='weeks'>{generateWeeks}</div>

              <div className='days'>
                {this.generateDays(
                  this.state.currentMonth,
                  this.state.currentYear,
                )}
              </div>
            </React.Fragment>
          ) : (
            <Panel
              toShow={this.state.toShow}
              selectHandler={
                this.state.toShow === 'Month'
                  ? this.selectMonth
                  : this.selectYear
              }
            />
          )}
        </div>
      </div>
    );
  }
}
DatePicker.proptypes = {
  placeholder: PropTypes.string,
};
