export class LoanModel {
  constructor(propertyValue, loanAmount, loanTerm, interestRate, disbursementDate) {
    this.propertyValue = propertyValue;
    this.loanAmount = loanAmount;
    this.loanTerm = loanTerm;
    this.interestRate = interestRate;
    this.disbursementDate = disbursementDate;
  }

  // Calculate interest per month
  calculateInterest(amount, interestRate) {
    return amount * (interestRate / 100) / 12;
  }

  // Calculate loan amount
  static calculateLoanAmount(loanRate, propertyValue) {
    return propertyValue * loanRate / 100;
  }

  // Calculate interst payable
  calculateInterestPayable() {
    return this.loanAmount + this.loanAmount * this.interestRate / 100
  }
}
