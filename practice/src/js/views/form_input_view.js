import FormInputController from "../controllers/form_input_controller";
import { Ultil } from "../utils/utils";

const propertyValue = document.querySelector('#property-value');
const loanAmount = document.querySelector('#loan-amount');
const loanTerm = document.querySelector('#loan-term');
const interestRate = document.querySelector('#interest-rate');
const disbursementDate = document.querySelector('#datepicker');
const inputBoxs = document.querySelectorAll('.input-box');
const slider = document.querySelector('#slider');
const totaInterestPaypleText = document.querySelector("#total-interest-payable");
const minMonthlyPaymentText = document.querySelector("#monthly-payment-min-amount");
const maxMonthlyPaymentText = document.querySelector("#monthly-payment-max-amount");
const totalOriginText = document.querySelector('#total-origin');
const totalInterestText = document.querySelector('#total-interest');
const totalPaymentText = document.querySelector('#total-payment');
const monthlyPaymentAmountTex = document.querySelector('#monthly-payment-amount');
const totalInterestPayableText = document.querySelector('#total-money-payable')
const propertyValueError = document.querySelector('#property-error');
const loanAmountError = document.querySelector('#loan-amount-error');
const loanTermError = document.querySelector('#loan-term-error');
const interestRateError = document.querySelector('#interest-rate-error');
const disbursementDateError = document.querySelector('#date-time-error');
const INDEX_OF_PROPERTYVALUE_ERRMESSAGE = 0;
const INDEX_OF_LOANAMOUNT_ERRMESSAGE = 1;
const INDEX_OF_LOANTERM_ERRMESSAGE = 2;
const INDEX_OF_INTERSTERATE_ERRMESSAGE = 3;
const INDEX_OF_DISBURSEMENTDATE_ERRMESSAGE = 4;
export const FormInputView = {

  init: function () {
    this.getValueWhenUserInput();
  },

  /**
   *function get value when user input to input box
   */
  getValueWhenUserInput: function () {
    inputBoxs.forEach(input => {
      input.addEventListener('input', () => {
        this.getValue(propertyValue, loanAmount, loanTerm, interestRate, disbursementDate);
      })
    });

    /**
     *function get user when user chang value of slider
     */
    slider.addEventListener('input', () => {
      this.getValue(propertyValue, loanAmount, loanTerm, interestRate, disbursementDate);
    })

    /**
     * function get value when user choose date
     */
    disbursementDate.addEventListener('change', () => {
      this.getValue(propertyValue, loanAmount, loanTerm, interestRate, disbursementDate);
    });
  },

  /**
   * function get value, validate and handle value
   * @param {*} propertyValue
   * @param {*} loanAmount
   * @param {*} loanTerm
   * @param {*} interestRate
   * @param {*} disbursementDate
   */
  getValue: function (propertyValue, loanAmount, loanTerm, interestRate, disbursementDate) {
    const valueOfPropertyValue = Number(propertyValue.value.replace(/\./g, ''));
    const valueOfLoanAmount = Number(loanAmount.value.replace(/\./g, ''));
    const valueOfLoanTerm = Number(loanTerm.value);
    const valueOfInterestRate = Number(interestRate.value);
    const valueOfDisbursementDate = disbursementDate.value;

    //  validate input
    const errorsAndMessages = FormInputController.validateValue(valueOfPropertyValue, valueOfLoanAmount, valueOfLoanTerm, valueOfInterestRate, valueOfDisbursementDate);

    if (errorsAndMessages.inputStatus === true) {

      this.setMessageErrorToView(errorsAndMessages)
      FormInputController.handleLoanValue(valueOfPropertyValue, valueOfLoanAmount, valueOfLoanTerm, valueOfInterestRate, valueOfDisbursementDate);
    } else {
      this.setMessageErrorToView(errorsAndMessages)
    }
  },

  /**
   * function set error message to view
   * @param {} errorsAndMessages an object of errors and error messages
   */
  setMessageErrorToView: function (errorsAndMessages) {
    // set message to error label
    propertyValueError.textContent = errorsAndMessages.errorMessages[INDEX_OF_PROPERTYVALUE_ERRMESSAGE];
    loanAmountError.textContent = errorsAndMessages.errorMessages[INDEX_OF_LOANAMOUNT_ERRMESSAGE];
    loanTermError.textContent = errorsAndMessages.errorMessages[INDEX_OF_LOANTERM_ERRMESSAGE];
    interestRateError.textContent = errorsAndMessages.errorMessages[INDEX_OF_INTERSTERATE_ERRMESSAGE];
    disbursementDateError.textContent = errorsAndMessages.errorMessages[INDEX_OF_DISBURSEMENTDATE_ERRMESSAGE];
  },

  /**
   * set value of table result and Modal
   * @param {*} totaInterestPayple
   * @param {*} minMonthlyPayment
   * @param {*} maxMonthlyPayment
   * @param {*} totalInterest
   * @param {*} totalOrigin
   * @param {*} result
   */
  setValueOfTableResultAndModal: function (totaInterestPayple, minMonthlyPayment, maxMonthlyPayment, totalInterest, totalOrigin, result) {

    // set result to table result
    this.setValueToTableResult(totalInterest, totaInterestPayple, totalOrigin, minMonthlyPayment, maxMonthlyPayment);

    // set value to modal
    this.setValueOfModal(result);
  },

  setValueOfMonthlyPaymentResult: function (monthlyPaymentAmount, totalInterestPayable) {
    this.setValueOfMonthlyPaymentTable(monthlyPaymentAmount, totalInterestPayable);
  },

  /**
   * reformat value of element by reformater or 0 if value is NaN
   * @param {*} element
   * @param {*} value
   */
  updateTextContent: function (element, value) {
    element.textContent = !isNaN(value) ? Ultil.reformater(Math.round(value)) : '0';
  },

  // function to set value to row of table result
  /**
   * set result record after calculate to row of table result
   * @param {*} modalTable
   * @param {*} item
   * @param {*} number
   */
  setValueToTableRow: function (modalTable, item, number) {

    const ORDINAL_ROW = 0;
    const REPAYMENT_ROW = 1;
    const REMAINING_ORIGINAL_ROW = 2;
    const ORIGIN_ROW = 3;
    const INTEREST_ROW = 4;
    const TOTAL_ROW = 5;
    const row = modalTable.insertRow();
    const ordinalNumber = row.insertCell(ORDINAL_ROW);
    const repaymentPeriod = row.insertCell(REPAYMENT_ROW);
    const remainingOriginalAmount = row.insertCell(REMAINING_ORIGINAL_ROW);
    const origin = row.insertCell(ORIGIN_ROW);
    const interest = row.insertCell(INTEREST_ROW);
    const total = row.insertCell(TOTAL_ROW);

    ordinalNumber.textContent = number;
    repaymentPeriod.textContent = item.repaymentPeriod;
    this.updateTextContent(remainingOriginalAmount, item.remainningOriginalAmount);
    this.updateTextContent(origin, item.origin);
    this.updateTextContent(interest, item.interest);
    this.updateTextContent(total, item.toralPrincipalAndInterest);

    // add css to record
    ordinalNumber.classList.add('content__result');
    repaymentPeriod.classList.add('content__result');
    remainingOriginalAmount.classList.add('content__result');
    origin.classList.add('content__result');
    interest.classList.add('content__result');
    total.classList.add('content__result');

  },

  /**
   * set value of result to modal contain table result
   */
  isEventAttached: false,
  setValueOfModal: function (result) {
    const modalTable = document.querySelector('#modal-table-result').getElementsByTagName('tbody')[0];
    const button = document.querySelector("#export");
    let number = 0;

    // clear conttent of modal
    modalTable.innerHTML = '';
    result.forEach(item => {
      number = number + 1;
      this.setValueToTableRow(modalTable, item, number);
    })

    // active button export to file xlsx
    if (!this.isEventAttached) {
      // listen event of button
      button.addEventListener('click', function () {
        FormInputController.exportToXLSX();
      });
      this.isEventAttached = true;
    }
  },

  /**
   * set totalInterest, totaInterestPayple, totalOrigin, minMonthlyPayment, maxMonthlyPayment to Decreasing balance sheet
   * @param {*} totalInterest
   * @param {*} totaInterestPayple
   * @param {*} totalOrigin
   * @param {*} minMonthlyPayment
   * @param {*} maxMonthlyPayment
   */
  setValueToTableResult: function (totalInterest, totaInterestPayple, totalOrigin, minMonthlyPayment, maxMonthlyPayment) {
    // set value to table result
    totalInterestText.textContent = totalInterest;
    totalPaymentText.textContent = totaInterestPayple;
    totalOriginText.textContent = totalOrigin;
    totaInterestPaypleText.textContent = `${totaInterestPayple} VND`;
    minMonthlyPaymentText.textContent = `${minMonthlyPayment} VND`;
    maxMonthlyPaymentText.textContent = `${maxMonthlyPayment} VND`;
  },

  //
  /**
   * set value of monthly payment amount, total Interest Payable to table of fixed monthly payment
   * @param {*} monthlyPaymentAmount
   * @param {*} totalInterestPayable
   */
  setValueOfMonthlyPaymentTable: function (monthlyPaymentAmount, totalInterestPayable) {
    monthlyPaymentAmountTex.textContent = `${monthlyPaymentAmount} VND`;
    totalInterestPayableText.textContent = `${totalInterestPayable} VND`;
  },

}



