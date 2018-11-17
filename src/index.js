/**
 *
 * DatePicker
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'react-emotion';
import { getViewPortHeight, smoothScroll } from './utils/common.js';
import { monthNames, weekDays } from './utils/constants.js';
import Panel from './Panel.js';
const Wrapper = styled('div')`
  position: relative;
  box-shadow: 0px 3px 3px grey;
  border: 1px solid #e9e9e9;
  display: flex;
  flex-direction: column;
`;
const Container = styled('div')`
  display: flex;
  align-items: center;
  height: 34px;
  padding-left: 5px;
`;
const SelectedDate = styled('p')`
  flex: 2;
  font-size: 14px;
`;
const DownArrow = styled('div')`
  width: 16px;
  height: 11px;
  margin-right: 5px;
`;
const PreviousArrow = styled('div')`
  transform: rotate(90deg);
`;
const NextArrow = styled('div')`
  transform: rotate(-90deg);
`;
const Calendar = styled('div')`
  display: ${props => props.display};
  height: 210px;
`;
const MonthAndYear = styled('div')`
  display: flex;
  font-size: 14px;
  border-top: 1px solid #e9e9e9;
  padding: 5px 0;
  border-bottom: 1px solid #e9e9e9;
`;
const MonthContainer = styled('div')`
  flex: 2;
  text-align: center;
  display: flex;
  align-items: center;
`;
const Month = styled('p')`
  flex: 1.5;
  cursor: pointer;
  &:hover {
    background: #e9e9e9;
  }
`;
const Year = styled('p')`
  flex: 1.5;
  cursor: pointer;
  &:hover {
    background: #e9e9e9;
  }
`;
const YearContainer = styled('div')`
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
`;
const Weeks = styled('div')`
  width: 100%;
  display: flex;
  padding: 5px 0;
`;
const Days = styled('div')`
  padding: 5px 0;
`;
const Row = styled('div')`
  display: flex;
  flex-direction: column;
`;
const Column = styled('column')`
  display: flex;
  flex-direction: row;
  width: 100%;
  text-align: center;
  padding: 5px 0;
`;
const ItemWrapper = styled('div')`
  flex: 1;
  font-size: 11px;
  font-weight: 300;
  line-height: 1.55;
`;
const DayLi = styled('span')`
  padding: 7px;
  border-radius: 50%;
  list-style-type: none;
  cursor: pointer;
  background: ${props => props.background || 'white'};
  color: ${props => (props.background ? 'white' : '#212b35')};
`;

/*eslint-disable */
function isLeapYear(year) {
  if (year % 100 === 0) {
    return year % 400 === 0 ? false : true;
  } else if (year % 4 === 0) {
    return true;
  } else return false;
}

const generateWeeks = weekDays.map(week => (
  <td
    className={css`
      flex: 1;
      text-align: center;
      font-size: 12px;
      line-height: 1.55;
      color: #9d9fa4;
    `}
  >
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

  scrollTo = () => {
    let elementPositionFromTop = this.datePickerRef.getBoundingClientRect().top;
    let viewPortHeight = getViewPortHeight();
    let distanceToMove = viewPortHeight - elementPositionFromTop;
    // 350 includes Calendar height[210px] +  fixed elements at the bottom around 50px
    if (distanceToMove < 410) smoothScroll(410 - distanceToMove, 400, true);
  };
  showCalendarHandle = () => {
    this.setState({
      showCalendar: !this.state.showCalendar,
    });
    !this.state.showCalendar && this.scrollTo();
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
          <ItemWrapper>
            <DayLi
              background={
                counter === parseInt(this.state.selectedDay) && '#8863fb'
              }
              onClick={this.selectDate}
            >
              {counter++}
            </DayLi>
          </ItemWrapper>,
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

      rows.push(<Column>{columns}</Column>);
    }
    this.previousDays(startingDay, firstRow);
    this.nextDays((NoOfDays + startingDay) % 7, lastRow);
    return <Row>{rows}</Row>;
  };
  previousDays = (startingDay, firstRow) => {
    let previousMonth =
      this.state.currentMonth === 0 ? 11 : (this.state.currentMonth - 1) % 12;
    let previousMonthLastdate = monthNames[previousMonth].days;
    let i;
    for (i = 0; i < startingDay; i++) {
      firstRow.unshift(
        <ItemWrapper>
          <DayLi
            className={css`
              color: #9d9fa4;
            `}
          >
            {previousMonthLastdate - i}
          </DayLi>
        </ItemWrapper>,
      );
    }
    return firstRow;
  };
  nextDays = (endDay, lastRow) => {
    let i;
    if (endDay) {
      for (i = 1; i <= 7 - endDay; i++) {
        lastRow.push(
          <ItemWrapper>
            <DayLi
              className={css`
                color: #9d9fa4;
              `}
            >
              {i}
            </DayLi>
          </ItemWrapper>,
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
      <Wrapper
        innerRef={ref => (this.datePickerRef = ref)}
        tabIndex={0}
        onBlur={this.mouseLeave}
      >
        <Container onClick={this.showCalendarHandle}>
          <SelectedDate>{this.state.selectedDate}</SelectedDate>
          <DownArrow
            onClick={this.showCalendarHandle}
          >&#8964;
          </DownArrow>
        </Container>
        <Calendar display={this.state.showCalendar ? 'block' : 'none'}>
          <MonthAndYear className="begum--medium">
            <MonthContainer>
              <PreviousArrow onClick={this.previousMonth}>&#x22B2;</PreviousArrow>
              <Month onClick={this.showMonthPanel}>
                {monthNames[this.state.currentMonth].name}
              </Month>
              <NextArrow onClick={this.nextMonth}>&#x22B3;</NextArrow>
            </MonthContainer>
            <YearContainer>
              <PreviousArrow onClick={this.previousYear}>&#x22B2;</PreviousArrow>
              <Year onClick={this.showYearPanel}>{this.state.currentYear}</Year>
              <NextArrow onClick={this.nextYear}>&#x22B3;</NextArrow>
            </YearContainer>
          </MonthAndYear>
          {!this.state.toShowPanel ? (
            <React.Fragment>
              <Weeks>{generateWeeks}</Weeks>

              <Days>
                {this.generateDays(
                  this.state.currentMonth,
                  this.state.currentYear,
                )}
              </Days>
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
        </Calendar>
      </Wrapper>
    );
  }
}
DatePicker.proptypes = {
  placeholder: PropTypes.string,
};
