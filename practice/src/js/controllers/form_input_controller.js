
import { LoanModel } from '../models/loan_model';
import { LoanPaymentModel } from '../models/loan_payment_model';
import { Ultil } from '../utils/utils';
import { FormInputView } from '../views/form_input_view';
import { PageLoadController } from './page_load_controller';
const FormInputController = {
  innit: function () {
    FormInputView.init();
  },

  // calculate Loan payment
  calculateLoanPayment: function (object) {
    let result = [];
    let remainingOriginalAmount = object.loanAmount;
    let totalInterestPayable = 0;
    let minMonthlyPayment = remainingOriginalAmount;
    let maxMonthlyPayment = 0;
    let repaymentPeriod = object.disbursementDate;

    if (object.loanTerm < 2) {
      const interest = object.calculateInterest(remainingOriginalAmount, object.interestRate);
      totalInterestPayable = remainingOriginalAmount + interest;
      result.push(LoanPaymentModel.createResultRecord(remainingOriginalAmount, remainingOriginalAmount, interest, repaymentPeriod, totalInterestPayable));
    } else {
      const origin = remainingOriginalAmount / object.loanTerm;
      for (let i = 1; i <= object.loanTerm; i++) {
        const interest = object.calculateInterest(remainingOriginalAmount, object.interestRate);
        remainingOriginalAmount = Math.max(remainingOriginalAmount - origin, 0);
        repaymentPeriod = Ultil.calculateRepaymentDate(repaymentPeriod);
        const totalPayable = origin + interest;
        totalInterestPayable += totalPayable;

        result.push(LoanPaymentModel.createResultRecord(origin, remainingOriginalAmount, interest, repaymentPeriod, totalPayable));

        minMonthlyPayment = Math.min(minMonthlyPayment, totalPayable);
        maxMonthlyPayment = Math.max(maxMonthlyPayment, totalPayable);
      }
    }
    return {
      result,
      totalInterestPayable,
      minMonthlyPayment,
      maxMonthlyPayment
    };
  },

  // handle Loan Value
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
