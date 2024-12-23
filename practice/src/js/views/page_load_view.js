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
    PageLoadController.reformatNumber('#property-value');
    PageLoadController.reformatNumber('#loan-amount');
  },

  // change value of slider
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


  // change loan amount when input property value
  changeLoanAmountWhenInputProperty: function () {
    const propertyValueBox = document.querySelector('#property-value');
    const slider = document.querySelector('#slider');
    const sliderValue = document.querySelector('#sliderValue');
    propertyValueBox.addEventListener('input', () => {
      const propertyValue = Number(document.querySelector('#property-value').value.replace(/\./g, ''));
      const loanAmount = document.querySelector('#loan-amount');
      sliderValue.textContent = slider.value + '%';
      loanAmount.value = PageLoadController.calculateLoanAmountByLoanRate(slider.value, propertyValue, loanAmount);
    });
  },

  // get date today
  getDate: function () {
    const inputBox = document.querySelector('#datepicker');
    const today = PageLoadController.getDayToDay();
    inputBox.value = today;
  },


  //caculate Loan rate by loan amount
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

  //change Loan rate by Loan amount
  changeLoanRateByLoanAmount: function () {
    const loanAmount = document.querySelector('#loan-amount');

    loanAmount.addEventListener('input', (inputEvent) => {
      this.calculateLoanRateByLoanAmount(inputEvent);
    })

  },

  // open and close modal
  openCloseModal: function () {
    const buttonExports = document.querySelectorAll('#button-export');
    buttonExports.forEach(buttonExport => {
      buttonExport.addEventListener('click', () => {
        const modal = document.querySelector('.modal-container');
        modal.classList.toggle('modal--visible');
      })
    });

  },

  // active button left (decreasing balance sheet)
  activeButtonLeft: function () {
    const button = document.querySelector("#btn-decreasing-balance");
    const INDEX_OF_BUTTON = 0;
    const monthlyPaymentResult = document.querySelector('.monnthly-payment-calculate__result');
    const tableResult = document.querySelector('.calculate__result');

    button.addEventListener('click', () => {
      this.activeButton(INDEX_OF_BUTTON, tableResult, monthlyPaymentResult);
    });
  },

  // active button left (decreasing balance sheet)
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

