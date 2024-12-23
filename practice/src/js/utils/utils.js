import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
export class Ultil {
  // get date today
  static getDayToDay() {
    const date = new Date();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const result = date.toLocaleDateString('vi-VN', options);
    return result;
  }

  // function check leap year
  static isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // function calculate number of date in a month
  static getDaysInMonth(month, year) {
    const DATES_OF_MONTH = [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return DATES_OF_MONTH[month - 1];  /*DATES_OF_MONTH start from index 0*/
  }

  // function format number to english
  static reformater(value) {
    if (!isNaN(value) && value !== '') {
      return Number(value).toLocaleString('vi-VN');
    };
  }

  // function check NAN value
  static checkIfNAN(value) {
    if (!isNaN(value)) {
      value = this.reformater(Math.round(value))
    } else {
      value = 0;
    }
    return value
  }

  // function check is date in past
  static isDateInPast(valueOfDisbursementDate) {
    const currentDate = this.getDayToDay().split('/').map(Number);
    const inputDate = valueOfDisbursementDate.split('/').map(Number);
    const [currentDay, currentMonth, currentYear] = currentDate;
    const [inputDay, inputMonth, inputYear] = inputDate;
    const current = new Date(currentYear, currentMonth - 1, currentDay);
    const input = new Date(inputYear, inputMonth - 1, inputDay);

    return input < current;
  }

  // function check date in pass
  static checkDateInPass(date, inputErrors) {
    if (this.isDateInPast(date)) {
      inputErrors.inputStatus = false;
      inputErrors.errorMessages.push('Date cannot be in the past');
    } else {
      inputErrors.errorMessages.push('');
    }
  }

  // function check value greater than 0 or is a number
  static checkValueGreaterThan0(value, inputErrors, string) {
    if (value < 0 || isNaN(value)) {
      inputErrors.inputStatus = false;
      if (value <= 0) inputErrors.errorMessages.push(`${string} value must greater than 0`);
      if (isNaN(value)) inputErrors.errorMessages.push(`${string} value must be a number`);
    } else {
      inputErrors.errorMessages.push('');
    };
  }

  // function caculate repayment date per month
  static calculateRepaymentDate(date) {
    const [day, month, year] = date.split('/').map(Number);
    const DAYS_OF_MONTH = Ultil.getDaysInMonth(month, year);
    const TOTAL_MONTHS_OF_YEAR = 12;
    let newMonth = month;
    let newDay = day;
    let newYear = year;
    let newDate;

    newMonth = newMonth + 1;
    if (newMonth > TOTAL_MONTHS_OF_YEAR) {
      newMonth = 1;
      newYear = newYear + 1;
    };

    // check Day
    if (newDay > DAYS_OF_MONTH) {
      newDay = DAYS_OF_MONTH;
    }

    newDate = `${newDay}/${newMonth}/${newYear}`;
    return newDate;
  }

  static exportToXLSX() {
    //Get data from local storage, change to json
    const result = JSON.parse(localStorage.getItem('result'));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Loans');

    // add data to worksheet
    worksheet.columns = Object.keys(result[0]).map(key => ({ header: key, key, width: 15 }));
    result.forEach(data => {
      worksheet.addRow(data);
    });

    // set width of cells
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellValue = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, cellValue.length);
      });
      // width cell = width content + 5 spaces
      column.width = maxLength + 5;
    });

    // format all cell on sheet
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.font = {
          name: 'Times New Roman',
          size: 13
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };
        if (typeof cell.value === 'number') {
          cell.numFmt = '#,##0';
        }

        //add boder
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // export to file
    workbook.xlsx.writeBuffer()
      .then(buffer => {
        saveAs(new Blob([buffer]), 'loan_data.xlsx');
      })
      .catch(err => {
        console.error('Error writing file:', err);
      });
  }
}
