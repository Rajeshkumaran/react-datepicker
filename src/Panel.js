import React from 'react';
import { monthNames, currentYear, currentMonth } from './utils/constants';
import panelstyles from './panelstyles.css';
/*eslint-disable */
export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.monthsToPopulate = [];
    this.yearsToPopulate = [];
    this.startYear = props.startYear || currentYear - 50;
    this.endYear = props.endYear || currentYear + 15;
    this.state = {
      isHovered: false,
      activeMonthIndex: currentMonth,
      activeYearIndex: 0,
    };
    this.generateMonths();
    this.generateYears(this.startYear, this.endYear);
  }

  componentDidMount() {
    console.log('==========Component DId mount called');
  }
  monthClicked = data => {
    this.props.selectHandler && this.props.selectHandler(data.index);
  };
  yearClicked = data => {
    this.props.selectHandler && this.props.selectHandler(data.target.innerHTML);
  };
  generateMonths = () => {
    let counter = 0,
      itemsArray = [],
      iLoop = 12 / 4;
    for (let i = 1; i <= iLoop; i++) {
      for (let j = 1; j <= 4; j++)
        itemsArray.push(
          <div className='panel-item-wrapper'>
            <span className='panel-item'
              onClick={() =>
                this.monthClicked({
                  index: (i - 1) * 4 + j - 1,
                })
              }
            >
              {monthNames[counter++].shortName}
            </span>
          </div>,
        );

      this.monthsToPopulate.push(<div className='panel-column'>{itemsArray}</div>);
      itemsArray = [];
    }
  };
  generateYears = (startYear, endYear) => {
    let counter = 0,
      itemsArray = [],
      totalYears = endYear - startYear;
    let iLoop = Math.ceil(totalYears / 4);
    for (let i = 1; i <= iLoop; i++) {
      for (let j = 1; j <= 4; j++)
        itemsArray.push(
          <div className='panel-item-wrapper'>
            <span className='panel-item' onClick={this.yearClicked}>{startYear + counter++}</span>
          </div>,
        );

      this.yearsToPopulate.push(<div className='panel-column'>{itemsArray}</div>);
      itemsArray = [];
    }
  };
  render() {
    let { toShow = 'Month' } = this.props;
    console.log(
      this.startYear,
      this.endYear,
      this.monthsToPopulate,
      this.yearsToPopulate,
    );
    return (
      <div className='panel-container'>
        <div className='panel-row'>
          {toShow === 'Month' ? this.monthsToPopulate : this.yearsToPopulate}
        </div>
      </div>
    );
  }
}
