export class LoanPaymentModel {
  constructor(origin, remainningOriginalAmount, interest, repaymentPeriod) {
    this.origin = origin;
    this.remainningOriginalAmount = remainningOriginalAmount;
    this.interest = interest;
    this.repaymentPeriod = repaymentPeriod;
    this.toralPrincipalAndInterest = origin + interest;
  }

  static createResultRecord(origin, remainingOriginalAmount, interest, repaymentPeriod, totalPayable) {
    return new LoanPaymentModel(origin, remainingOriginalAmount, interest, repaymentPeriod, totalPayable);
  }
}

