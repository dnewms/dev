import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SolarCalculationResults, CalculatorInputs } from './types';
import { formatCurrency, formatNumber } from './calculations';
import { getStateIncentive } from './incentives';

export const generatePDF = (results: SolarCalculationResults, inputs: CalculatorInputs) => {
  const doc = new jsPDF();
  const stateIncentive = getStateIncentive(inputs.state);

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138); // Blue
  doc.text('Solar Panel ROI Analysis Report', 105, 20, { align: 'center' });

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

  // Location Info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Location: ${stateIncentive?.stateName || inputs.state}, ${inputs.zipCode}`, 20, 40);

  // Key Metrics Section
  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('Key Financial Metrics', 20, 55);

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  const metricsData = [
    ['System Size', `${results.systemSize} kW`],
    ['Total System Cost', formatCurrency(inputs.systemCost)],
    ['Total Incentives', formatCurrency(results.totalIncentives)],
    ['Net System Cost', formatCurrency(results.netSystemCost)],
    ['Annual Production', `${formatNumber(results.yearlyProduction)} kWh`],
    ['Annual Value', formatCurrency(results.yearlyValue)],
    ['Payback Period', `${results.paybackPeriod} years`],
    ['Return on Investment (ROI)', `${results.roi}%`],
    ['25-Year Total Savings', formatCurrency(results.savings25Years)],
  ];

  autoTable(doc, {
    startY: 60,
    head: [['Metric', 'Value']],
    body: metricsData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    margin: { left: 20, right: 20 }
  });

  // Incentives Breakdown
  let currentY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('Incentives & Tax Credits', 20, currentY);

  currentY += 5;

  const incentivesData = [
    ['Federal Tax Credit (30%)', formatCurrency(results.federalTaxCredit)],
  ];

  if (results.stateTaxCredit > 0) {
    incentivesData.push(['State Tax Credit', formatCurrency(results.stateTaxCredit)]);
  }

  if (results.localRebates > 0) {
    incentivesData.push(['Local Rebates', formatCurrency(results.localRebates)]);
  }

  incentivesData.push(['TOTAL INCENTIVES', formatCurrency(results.totalIncentives)]);

  autoTable(doc, {
    startY: currentY,
    body: incentivesData,
    theme: 'striped',
    margin: { left: 20, right: 20 }
  });

  // Add new page for yearly breakdown
  doc.addPage();

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('25-Year Savings Breakdown', 20, 20);

  const yearlyData = results.yearlyBreakdown
    .filter((_, index) => index % 5 === 0 || index === results.yearlyBreakdown.length - 1)
    .map(year => [
      `Year ${year.year}`,
      formatCurrency(year.cumulativeSavings),
      formatCurrency(year.cumulativeCost),
      formatCurrency(year.netPosition)
    ]);

  autoTable(doc, {
    startY: 25,
    head: [['Year', 'Cumulative Savings', 'Cumulative Cost', 'Net Position']],
    body: yearlyData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    margin: { left: 20, right: 20 }
  });

  // Monthly Production
  currentY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.text('Monthly Production Estimates', 20, currentY);

  currentY += 5;

  const monthlyData = results.monthlyBreakdown.map(month => [
    month.month,
    `${formatNumber(month.production)} kWh`,
    formatCurrency(month.savings)
  ]);

  // Split into two columns for better presentation
  const firstHalf = monthlyData.slice(0, 6);
  const secondHalf = monthlyData.slice(6, 12);

  autoTable(doc, {
    startY: currentY,
    head: [['Month', 'Production', 'Savings']],
    body: firstHalf,
    theme: 'striped',
    margin: { left: 20, right: 110 },
    tableWidth: 85
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Month', 'Production', 'Savings']],
    body: secondHalf,
    theme: 'striped',
    margin: { left: 110, right: 20 },
    tableWidth: 85
  });

  // State Benefits
  if (stateIncentive && (stateIncentive.exemptions.length > 0 || stateIncentive.utilityPrograms.length > 0)) {
    doc.addPage();

    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text(`${stateIncentive.stateName} Solar Benefits`, 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    let benefitsY = 30;

    if (stateIncentive.exemptions.length > 0) {
      doc.text('Tax Exemptions:', 20, benefitsY);
      benefitsY += 7;

      stateIncentive.exemptions.forEach(exemption => {
        doc.setFontSize(10);
        doc.text(`• ${exemption}`, 25, benefitsY);
        benefitsY += 6;
      });

      benefitsY += 5;
    }

    if (stateIncentive.utilityPrograms.length > 0) {
      doc.setFontSize(11);
      doc.text('Utility Programs:', 20, benefitsY);
      benefitsY += 7;

      stateIncentive.utilityPrograms.forEach(program => {
        doc.setFontSize(10);
        doc.text(`• ${program}`, 25, benefitsY);
        benefitsY += 6;
      });
    }
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Solar ROI Calculator | Page ${i} of ${pageCount}`,
      105,
      285,
      { align: 'center' }
    );
    doc.text(
      'This analysis is for informational purposes only. Consult with a solar professional for detailed quotes.',
      105,
      290,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(`Solar-ROI-Analysis-${inputs.zipCode}.pdf`);
};
