import { LoanModel } from "../models/loan_model";
import { Ultil } from "../utils/utils";
import { PageLoadView } from "../views/page_load_view";
export const PageLoadController = {
  init: function () {
    PageLoadView.init();
  },

  // reformat number input
  reformatNumber: function (idElement) {
    document.addEventListener('DOMContentLoaded', () => {
      const number_input = document.querySelector(idElement);

      number_input.addEventListener('input', (e) => {
        let value = e.target.value;
        value = value.replace(/\./g, '');
        if (!isNaN(value) && value !== '') {
          value = Number(value).toLocaleString('vi-VN');
        };
        e.target.value = value;
      })

    })
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

