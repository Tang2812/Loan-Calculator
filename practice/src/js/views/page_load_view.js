import { PageLoadController } from "../controllers/page_load_controller";
import flatpickr from 'flatpickr';

export const PageLoadView = {
  init: function () {
    const inputBox = document.querySelector('#datepicker');
    this.reformatNumber();
    this.changeValuesWhenSliderChange();
    this.changeLoanAmountWhenInputProperty();
    this.getDate(inputBox);
    this.changeLoanRateByLoanAmount();
    this.openCloseModal();
    this.activeButtonLeft();
    this.activeButtonRight();
    this.initializeDatePicker();
  },

  // call reformat number from controller
  reformatNumber: function () {
    this.reformatNumberToVietNameseNumberFormat('#property-value');
    this.reformatNumberToVietNameseNumberFormat('#loan-amount');
  },


  /**
   * function change value when pull or change slider
   */
  changeValuesWhenSliderChange: function () {
    const slider = document.querySelector('#slider');
    const sliderValue = document.querySelector('#sliderValue');
    slider.addEventListener('input', () => {
      const propertyValue = Number(document.querySelector('#property-value').value.replace(/\./g, ''));
      const loanAmount = document.querySelector('#loan-amount');
      sliderValue.textContent = slider.value + '%';
      loanAmount.value = PageLoadController.calculateLoanAmountByLoanRate(slider.value, propertyValue, loanAmount);
    });
  },

  /**
   * function change loan amount when input property value, loan amout = 0 if loan amout is NaN
   */
  changeLoanAmountWhenInputProperty: function () {
    const propertyValueBox = document.querySelector('#property-value');
    const slider = document.querySelector('#slider');
    const sliderValue = document.querySelector('#sliderValue');
    propertyValueBox.addEventListener('input', () => {
      const propertyValue = Number(document.querySelector('#property-value').value.replace(/\./g, ''));
      const loanAmount = document.querySelector('#loan-amount');
      sliderValue.textContent = slider.value + '%';
      const loanAmountValue = PageLoadController.calculateLoanAmountByLoanRate(slider.value, propertyValue, loanAmount);
      loanAmount.value = Number.isNaN(loanAmountValue) ? 0 : loanAmountValue;

    });
  },

  /**
   * get date today and set to input box
   */
  getDate: function () {
    const inputBox = document.querySelector('#datepicker');
    const today = PageLoadController.getDayToDay();
    inputBox.value = today;
  },


  /**
   *function reformat number by VN number format in input box
   * @param {String} idElement name, id, class of input box
   */
  reformatNumberToVietNameseNumberFormat: function (idElement) {
    document.addEventListener('DOMContentLoaded', () => {
      const numberInput = document.querySelector(idElement);

      numberInput.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/\./g, '');
        if (!isNaN(value) && value !== '') {
          value = Number(value).toLocaleString('vi-VN');
        };
        e.target.value = value;
      })

    })
  },

  /**
   *function caculate Loan rate by loan amount
   * @param {*} inputEvent
   */
  calculateLoanRateByLoanAmount: function (inputEvent) {
    const sliderValue = document.querySelector('#sliderValue');
    const loanRate = document.querySelector('#slider');
    const propertyValue = Number(document.querySelector('#property-value').value.replace(/\./g, ''));
    let loanAmountValue = Number(inputEvent.target.value.replace(/\./g, ''));
    let loanRateValue = Math.floor(loanAmountValue / propertyValue * 100);

    if (isNaN(loanRateValue) || loanRateValue < 0) {
      loanRate.value = 0;
      sliderValue.textContent = '0%';
    } else if (loanRateValue > 100) {
      loanRate.value = 100;
      sliderValue.textContent = '100%';
      inputEvent.target.value = propertyValue;
    } else {
      loanRate.value = loanRateValue;
      sliderValue.textContent = loanRateValue + '%';
    }

  },

  /**
   * function change Loan rate by Loan amount when input loan amount
   */
  changeLoanRateByLoanAmount: function () {
    const loanAmount = document.querySelector('#loan-amount');

    loanAmount.addEventListener('input', (inputEvent) => {
      this.calculateLoanRateByLoanAmount(inputEvent);
    })

  },

  /**
   * function open and close modal when click button
   */
  openCloseModal: function () {
    const buttonExports = document.querySelectorAll('#button-export');
    buttonExports.forEach(buttonExport => {
      buttonExport.addEventListener('click', () => {
        const modal = document.querySelector('.modal-container');
        modal.classList.toggle('modal--visible');
      })
    });

  },

  /**
   * function open decreasing balance  when click button button #btn-decreasing-balance
   */
  activeButtonLeft: function () {
    const button = document.querySelector("#btn-decreasing-balance");
    const INDEX_OF_BUTTON = 0;
    const monthlyPaymentResult = document.querySelector('.monnthly-payment-calculate__result');
    const tableResult = document.querySelector('.calculate__result');

    button.addEventListener('click', () => {
      this.activeButton(INDEX_OF_BUTTON, tableResult, monthlyPaymentResult);
    });
  },

  /**
 * function open decreasing balance sheet when click button button #btn-decreasing-balance-shee
 */
  activeButtonRight: function () {
    const button = document.querySelector("#btn-decreasing-balance-sheet");
    const INDEX_OF_BUTTON = 1;
    const monthlyPaymentResult = document.querySelector('.monnthly-payment-calculate__result');
    const tableResult = document.querySelector('.calculate__result');

    button.addEventListener('click', () => {
      this.activeButton(INDEX_OF_BUTTON, monthlyPaymentResult, tableResult);
    });
  },

  // change button style and under line
  activeButton: function (index, sheetOpen, sheetClose) {
    const buttons = document.querySelectorAll('.btn');
    const underLine = document.querySelector('.line-under');
    const isWidth50 = underLine.classList.contains('width-50');

    buttons.forEach((button, i) => {
      button.classList.toggle('active', i === index);
    });

    // delete old positions
    underLine.classList.remove('position-0', 'position-1');

    // add class new position based on index
    underLine.classList.add(`position-${index}`);

    // change width
    if (isWidth50) {
      underLine.classList.remove('width-50');
      underLine.classList.add('width-44');
    } else {
      underLine.classList.remove('width-44');
      underLine.classList.add('width-50');
    }

    // open sheet need open
    sheetOpen.classList.remove('display--none');

    // close sheet need close
    sheetClose.classList.add('display--none');
  },

  initializeDatePicker: function () {
    flatpickr("#datepicker", {
      dateFormat: "d/m/Y" //format dd/mm/YYYY
    });
  }
}

