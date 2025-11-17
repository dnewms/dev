import { CalculatorInputs, SolarCalculationResults, MonthlyData, YearlyData } from './types';
import { getStateIncentive, solarProductionFactors } from './incentives';

const FEDERAL_TAX_CREDIT = 0.30; // 30% federal tax credit
const SYSTEM_DEGRADATION = 0.005; // 0.5% annual degradation
const ELECTRICITY_INFLATION = 0.03; // 3% annual increase
const WATTS_PER_SQ_FT = 15; // Average watts per square foot
const PANEL_EFFICIENCY = 0.80; // 80% usable roof space

export const calculateSystemSize = (roofSize: number): number => {
  // Calculate system size in kW based on roof size
  const usableRoofSpace = roofSize * PANEL_EFFICIENCY;
  const totalWatts = usableRoofSpace * WATTS_PER_SQ_FT;
  return Math.round((totalWatts / 1000) * 10) / 10; // Convert to kW and round
};

export const calculateYearlyProduction = (systemSize: number, state: string): number => {
  const productionFactor = solarProductionFactors[state] || 1350; // Default to average
  return Math.round(systemSize * productionFactor);
};

export const calculateMonthlyBreakdown = (
  yearlyProduction: number,
  electricityRate: number
): MonthlyData[] => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Seasonal variation factors (winter lower, summer higher)
  const seasonalFactors = [0.70, 0.80, 0.95, 1.05, 1.15, 1.20, 1.20, 1.15, 1.05, 0.90, 0.75, 0.65];

  return months.map((month, index) => {
    const monthlyProduction = (yearlyProduction / 12) * seasonalFactors[index];
    const savings = monthlyProduction * electricityRate;

    return {
      month,
      production: Math.round(monthlyProduction),
      savings: Math.round(savings * 100) / 100
    };
  });
};

export const calculateYearlyBreakdown = (
  systemCost: number,
  totalIncentives: number,
  yearlyProduction: number,
  electricityRate: number,
  years: number = 25
): YearlyData[] => {
  const netSystemCost = systemCost - totalIncentives;
  const yearlyData: YearlyData[] = [];

  let cumulativeSavings = 0;
  let cumulativeCost = netSystemCost;

  for (let year = 1; year <= years; year++) {
    // Apply degradation to production
    const degradationFactor = Math.pow(1 - SYSTEM_DEGRADATION, year - 1);
    const yearProduction = yearlyProduction * degradationFactor;

    // Apply electricity rate inflation
    const inflatedRate = electricityRate * Math.pow(1 + ELECTRICITY_INFLATION, year - 1);
    const yearlySavings = yearProduction * inflatedRate;

    cumulativeSavings += yearlySavings;

    // Add maintenance cost every 5 years (inverter replacement, etc.)
    if (year % 10 === 0) {
      cumulativeCost += systemCost * 0.05; // 5% of system cost
    }

    const netPosition = cumulativeSavings - cumulativeCost;

    yearlyData.push({
      year,
      cumulativeSavings: Math.round(cumulativeSavings),
      cumulativeCost: Math.round(cumulativeCost),
      netPosition: Math.round(netPosition)
    });
  }

  return yearlyData;
};

export const calculateSolarROI = (inputs: CalculatorInputs): SolarCalculationResults => {
  const { roofSize, monthlyEnergyBill, systemCost, electricityRate, state } = inputs;

  // Calculate system size
  const systemSize = calculateSystemSize(roofSize);

  // Calculate yearly production based on location
  const yearlyProduction = calculateYearlyProduction(systemSize, state);

  // Calculate yearly value
  const yearlyValue = yearlyProduction * electricityRate;

  // Calculate incentives
  const federalTaxCredit = systemCost * FEDERAL_TAX_CREDIT;
  const stateIncentive = getStateIncentive(state);
  const stateTaxCredit = stateIncentive
    ? systemCost * (stateIncentive.taxCredit / 100)
    : 0;
  const localRebates = stateIncentive?.rebates || 0;
  const totalIncentives = federalTaxCredit + stateTaxCredit + localRebates;

  // Calculate net system cost
  const netSystemCost = systemCost - totalIncentives;

  // Calculate payback period
  const paybackPeriod = netSystemCost / yearlyValue;

  // Calculate 25-year savings
  const yearlyBreakdown = calculateYearlyBreakdown(
    systemCost,
    totalIncentives,
    yearlyProduction,
    electricityRate,
    25
  );
  const savings25Years = yearlyBreakdown[24].netPosition; // Year 25 net position

  // Calculate ROI
  const roi = ((savings25Years - netSystemCost) / netSystemCost) * 100;

  // Calculate monthly breakdown
  const monthlyBreakdown = calculateMonthlyBreakdown(yearlyProduction, electricityRate);

  return {
    systemSize,
    yearlyProduction,
    yearlyValue: Math.round(yearlyValue),
    federalTaxCredit: Math.round(federalTaxCredit),
    stateTaxCredit: Math.round(stateTaxCredit),
    localRebates: Math.round(localRebates),
    totalIncentives: Math.round(totalIncentives),
    netSystemCost: Math.round(netSystemCost),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    roi: Math.round(roi * 10) / 10,
    savings25Years: Math.round(savings25Years),
    monthlyBreakdown,
    yearlyBreakdown
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};
