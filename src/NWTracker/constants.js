export const TABS = ["Assets", "Liabilities", "Income", "Expenses"];

export const Asset_Fields = [
  { label: "Shares (Inv)", field: "asset.SharesInv" },
  { label: "Mutual Funds (Inv)", field: "asset.MFInv" },
  { label: "Fixed Deposits", field: "asset.FD" },
  { label: "Savings Account (BOI)", field: "asset.SA1" },
  { label: "Savings Account (HDFC)", field: "asset.SA2" },
  { label: "Salary Account (HDFC)", field: "asset.SA3" },
  { label: "EPF", field: "asset.EPF" },
  { label: "Gold & Jewellery", field: "asset.Gold" },
  { label: "Estate Value", field: "asset.Estate" },
  { label: "Other Assets", field: "asset.Other" },
];

// Excluded in Net Worth Calculations
export const Asset_Return_Fields = [
  { label: "Shares (Val)", field: "asset.SharesVal" },
  { label: "Mutual Funds (Val)", field: "asset.MFVal" },
];

export const LIABILITIES_FIELD = [
  { label: "Credit Card Dues", field: "liab.CreditDue" },
  { label: "Home Loan", field: "liab.HomeLoan" },
  { label: "Other Loan", field: "liab.OtherLoan" },
  { label: "Other Liabilities", field: "liab.Other" },
];

export const INCOME_FIELDS = [
  { label: "Net Month Salary", field: "income.Monthly" },
  { label: "Rental Income Salary", field: "income.Rental" },
  { label: "Interest Earned", field: "income.Interest" },
  { label: "Stocks / MF Profit", field: "income.Stocks" },
  { label: "Miscellaneous Income", field: "income.Misc" },
];
export const EXPENSE_TYPES = [
  "Amazon",
  "BlinkIt",
  "Swiggy",
  "Instamart",
  "Zomato",
  "Flipkart",
  "Myntra",
  "Grocery",
  "Utility/Bill",
  "Food",
  "Petrol",
  "Salon",
  "Uber/Ola",
  "Rapido",
  "Vacation",
  "Miscellaneous",
  "Other",
];
