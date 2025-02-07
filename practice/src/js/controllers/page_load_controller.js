import { LoanModel } from "../models/loan_model";
import { Ultil } from "../utils/utils";
import { PageLoadView } from "../views/page_load_view";
export const PageLoadController = {
  init: function () {
    PageLoadView.init();
  },


  // change value of Loan amount
  calculateLoanAmountByLoanRate: function (loanRate, propertyValue, loanAmount) {
    let value = LoanModel.calculateLoanAmount(loanRate, propertyValue, loanAmount);
    return Number(value).toLocaleString('vi-VN')
  },

  // get date today
  getDayToDay: function () {
    return Ultil.getDayToDay();
  }
}

