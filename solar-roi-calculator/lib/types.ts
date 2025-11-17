export interface CalculatorInputs {
  location: string;
  roofSize: number; // in square feet
  monthlyEnergyBill: number; // in dollars
  systemCost: number; // in dollars
  electricityRate: number; // per kWh
  state: string;
  zipCode: string;
}

export interface SolarCalculationResults {
  systemSize: number; // kW
  yearlyProduction: number; // kWh
  yearlyValue: number; // dollars
  federalTaxCredit: number; // dollars
  stateTaxCredit: number; // dollars
  localRebates: number; // dollars
  totalIncentives: number; // dollars
  netSystemCost: number; // dollars
  paybackPeriod: number; // years
  roi: number; // percentage
  savings25Years: number; // dollars
  monthlyBreakdown: MonthlyData[];
  yearlyBreakdown: YearlyData[];
}

export interface MonthlyData {
  month: string;
  production: number;
  savings: number;
}

export interface YearlyData {
  year: number;
  cumulativeSavings: number;
  cumulativeCost: number;
  netPosition: number;
}

export interface StateIncentive {
  state: string;
  stateName: string;
  taxCredit: number; // percentage
  rebates: number; // flat dollar amount
  exemptions: string[];
  utilityPrograms: string[];
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  roofSize: number;
  monthlyBill: number;
  timeframe: string;
  comments?: string;
}

export interface AffiliateConfig {
  provider: string;
  affiliateId: string;
  productUrl: string;
  commission: number;
}
