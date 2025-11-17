import { StateIncentive } from './types';

export const stateIncentives: StateIncentive[] = [
  {
    state: 'CA',
    stateName: 'California',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering', 'SGIP Battery Incentive', 'Time-of-Use Rates']
  },
  {
    state: 'NY',
    stateName: 'New York',
    taxCredit: 25,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering', 'NY-Sun Incentive']
  },
  {
    state: 'TX',
    stateName: 'Texas',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption'],
    utilityPrograms: ['Net Metering', 'Austin Energy Rebates']
  },
  {
    state: 'FL',
    stateName: 'Florida',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'AZ',
    stateName: 'Arizona',
    taxCredit: 25,
    rebates: 0,
    exemptions: ['Property Tax Exemption'],
    utilityPrograms: ['Net Metering', 'SRP Solar Incentive']
  },
  {
    state: 'MA',
    stateName: 'Massachusetts',
    taxCredit: 15,
    rebates: 1000,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering', 'SMART Program']
  },
  {
    state: 'NJ',
    stateName: 'New Jersey',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering', 'SREC Program']
  },
  {
    state: 'NC',
    stateName: 'North Carolina',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption'],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'CO',
    stateName: 'Colorado',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption'],
    utilityPrograms: ['Net Metering', 'Xcel Energy Solar Rewards']
  },
  {
    state: 'NV',
    stateName: 'Nevada',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'OR',
    stateName: 'Oregon',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption'],
    utilityPrograms: ['Net Metering', 'Energy Trust of Oregon Incentive']
  },
  {
    state: 'WA',
    stateName: 'Washington',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'MD',
    stateName: 'Maryland',
    taxCredit: 0,
    rebates: 1000,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering', 'SREC Program']
  },
  {
    state: 'VA',
    stateName: 'Virginia',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption'],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'GA',
    stateName: 'Georgia',
    taxCredit: 0,
    rebates: 0,
    exemptions: [],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'IL',
    stateName: 'Illinois',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption'],
    utilityPrograms: ['Net Metering', 'Illinois Shines']
  },
  {
    state: 'PA',
    stateName: 'Pennsylvania',
    taxCredit: 0,
    rebates: 0,
    exemptions: [],
    utilityPrograms: ['Net Metering', 'SREC Program']
  },
  {
    state: 'OH',
    stateName: 'Ohio',
    taxCredit: 0,
    rebates: 0,
    exemptions: [],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'MI',
    stateName: 'Michigan',
    taxCredit: 0,
    rebates: 0,
    exemptions: [],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'MN',
    stateName: 'Minnesota',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering', 'Xcel Energy Solar Rewards']
  },
  {
    state: 'WI',
    stateName: 'Wisconsin',
    taxCredit: 0,
    rebates: 0,
    exemptions: [],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'UT',
    stateName: 'Utah',
    taxCredit: 25,
    rebates: 0,
    exemptions: ['Property Tax Exemption'],
    utilityPrograms: ['Net Metering']
  },
  {
    state: 'CT',
    stateName: 'Connecticut',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering', 'RSIP Program']
  },
  {
    state: 'RI',
    stateName: 'Rhode Island',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering', 'REG Program']
  },
  {
    state: 'VT',
    stateName: 'Vermont',
    taxCredit: 0,
    rebates: 0,
    exemptions: ['Property Tax Exemption', 'Sales Tax Exemption'],
    utilityPrograms: ['Net Metering']
  },
];

export const getStateIncentive = (state: string): StateIncentive | null => {
  return stateIncentives.find(s => s.state === state) || null;
};

export const getAllStates = (): { value: string; label: string }[] => {
  return stateIncentives.map(s => ({
    value: s.state,
    label: s.stateName
  }));
};

// Solar production factors by state (average annual kWh per kW installed)
export const solarProductionFactors: Record<string, number> = {
  'AZ': 1650, // High sun
  'CA': 1550,
  'NV': 1600,
  'NM': 1650,
  'TX': 1500,
  'FL': 1450,
  'CO': 1500,
  'UT': 1550,
  'NC': 1400,
  'SC': 1400,
  'GA': 1400,
  'AL': 1400,
  'LA': 1400,
  'AR': 1350,
  'TN': 1350,
  'MS': 1350,
  'OK': 1400,
  'KS': 1400,
  'NE': 1400,
  'SD': 1400,
  'ND': 1350,
  'MT': 1400,
  'WY': 1450,
  'ID': 1450,
  'OR': 1300,
  'WA': 1200,
  'NY': 1250,
  'MA': 1300,
  'CT': 1300,
  'RI': 1300,
  'VT': 1250,
  'NH': 1250,
  'ME': 1250,
  'NJ': 1350,
  'PA': 1300,
  'DE': 1350,
  'MD': 1350,
  'VA': 1400,
  'WV': 1300,
  'KY': 1350,
  'OH': 1300,
  'IN': 1300,
  'IL': 1300,
  'MI': 1250,
  'WI': 1300,
  'MN': 1300,
  'IA': 1350,
  'MO': 1350,
};
