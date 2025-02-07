import { LoanModel } from '../models/loan_model';
import { Ultil } from '../utils/utils';
import { FormInputView } from '../views/form_input_view';
const FormInputController = {
  innit: function () {
    FormInputView.init();
  },

  // calculate Loan payment
  /**
   * calculate loan payment, return array result of payment per month and total interest payable,
   * min monthly payment and max monthly payment
   * @param {LoanModel} object

   */
  calculateLoanPayment: function (object) {
    let result = [];
    let remainingOriginalAmount = object.loanAmount;
    let repaymentPeriod = object.disbursementDate;

    if (object.loanTerm < 2) {
      const totalInterestPayable = Ultil.calculateSingleTermLoan(object, result, remainingOriginalAmount, repaymentPeriod);
      return {
        result,
        totalInterestPayable,
        minMonthlyPayment: remainingOriginalAmount,
        maxMonthlyPayment: totalInterestPayable
      };
    } else {
      const { totalInterestPayable, minMonthlyPayment, maxMonthlyPayment } = Ultil.calculateMultiTermLoan(object, result, remainingOriginalAmount, repaymentPeriod);
      return {
        result,
        totalInterestPayable,
        minMonthlyPayment,
        maxMonthlyPayment
      };
    }
  },


  // handle Loan Value
  /**
   * function handle loan value, calculate and save loan payment result to localstorage
   * @param {*} propertyValue
   * @param {*} loanAmount
   * @param {*} loanTerm
   * @param {*} interestRate
   * @param {*} disbursementDate
   */
  handleLoanValue: function (propertyValue, loanAmount, loanTerm, interestRate, disbursementDate) {
    const object = new LoanModel(propertyValue, loanAmount, loanTerm, interestRate, disbursementDate);
    const { result, totalInterestPayable, minMonthlyPayment, maxMonthlyPayment } = this.calculateLoanPayment(object);
    const totalInterest = Ultil.checkIfNAN(totalInterestPayable - loanAmount);
    const totalOrigin = Ultil.reformater(object.loanAmount);

    // Check numbers
    const finalTotalInterestPayable = Ultil.checkIfNAN(totalInterestPayable);
    const finalMinMonthlyPayment = Ultil.checkIfNAN(minMonthlyPayment);
    const finalMaxMonthlyPayment = Ultil.checkIfNAN(maxMonthlyPayment);
    const finalInterstPayable = Ultil.checkIfNAN(object.calculateInterestPayable());
    // Save data to localStorage
    localStorage.setItem('result', JSON.stringify(result));

    // Set value for table result
    FormInputView.setValueOfTableResultAndModal(finalTotalInterestPayable, finalMinMonthlyPayment, finalMaxMonthlyPayment, totalInterest, totalOrigin, result);

    // Set value for monthly payment sheet
    if (loanTerm < 2) {
      FormInputView.setValueOfMonthlyPaymentResult(finalMinMonthlyPayment, finalInterstPayable);
    } else {
      FormInputView.setValueOfMonthlyPaymentResult(finalMaxMonthlyPayment, finalInterstPayable);
    }
  },

  // validate value
  validateValue: function (valueOfPropertyValue, valueOfLoanAmount, valueOfLoanTerm, valueOfInterestRate, valueOfDisbursementDate) {
    const inputErrors = {
      inputStatus: true,
      errorMessages: []
    };

    // validate value of property
    Ultil.checkValueGreaterThan0(valueOfPropertyValue, inputErrors, 'Property');

    // validate value loan amount
    Ultil.checkValueGreaterThan0(valueOfLoanAmount, inputErrors, 'Loan value');

    // validate loan term
    Ultil.checkValueGreaterThan0(valueOfLoanTerm, inputErrors, 'Loan term');

    // validate interst rate
    Ultil.checkValueGreaterThan0(valueOfInterestRate, inputErrors, 'Interest rate');

    // validate Disbursement date
    Ultil.checkDateInPass(valueOfDisbursementDate, inputErrors)

    return inputErrors;
  },

  // export file
  exportToXLSX: function () {
    Ultil.exportToXLSX();
  }
}

export default FormInputController;
