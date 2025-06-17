export interface PayrollCalculation {
  basicSalary: number;
  allowances: number;
  grossSalary: number;
  paye: number;
  nhif: number;
  nssf: number;
  housingLevy: number;
  totalDeductions: number;
  netSalary: number;
}