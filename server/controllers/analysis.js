const mockApi = require('../services/mockRealEstateApi');

// A helper function for calculations
// TODO: Extend this to support different loan types (e.g., hard money, seller financing)
const calculate = (data) => {
  const {
    purchasePrice = 0,
    closingCosts = 0,
    rehabBudget = 0,
    downPaymentPercent = 20,
    interestRate = 5,
    loanTermYears = 30,
    marketRent = 0,
    propertyTaxes = 0,
    insurance = 0,
    vacancyRate = 5,
    maintenanceRate = 5,
    managementRate = 10,
  } = data;

  const totalInvestment = purchasePrice + closingCosts + rehabBudget;
  const downPaymentAmount = totalInvestment * (downPaymentPercent / 100);
  const loanAmount = totalInvestment - downPaymentAmount;

  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;
  const monthlyPAndI =
    loanAmount > 0 && interestRate > 0
      ? loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : 0;

  const monthlyTaxes = propertyTaxes / 12;
  const monthlyInsurance = insurance / 12;
  const monthlyPITI = monthlyPAndI + monthlyTaxes + monthlyInsurance;

  const grossMonthlyIncome = marketRent;
  const vacancyCost = grossMonthlyIncome * (vacancyRate / 100);
  const effectiveGrossIncome = grossMonthlyIncome - vacancyCost;

  const maintenanceCost = effectiveGrossIncome * (maintenanceRate / 100);
  const managementCost = effectiveGrossIncome * (managementRate / 100);
  const monthlyExpenses = monthlyTaxes + monthlyInsurance + maintenanceCost + managementCost;

  const noi = (effectiveGrossIncome - monthlyExpenses) * 12;
  const monthlyCashFlow = effectiveGrossIncome - monthlyPITI - maintenanceCost - managementCost;
  const cashOnCashReturn = downPaymentAmount > 0 ? (monthlyCashFlow * 12 / downPaymentAmount) * 100 : 0;
  const capRate = totalInvestment > 0 ? (noi / totalInvestment) * 100 : 0;

  return {
    totalInvestment,
    downPaymentAmount,
    loanAmount,
    monthlyPITI,
    noi: noi.toFixed(2),
    monthlyCashFlow: monthlyCashFlow.toFixed(2),
    cashOnCashReturn: cashOnCashReturn.toFixed(2),
    capRate: capRate.toFixed(2),
  };
};

exports.analyzeRental = async (req, res) => {
  const { address, ...data } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const { estimated_arv, market_rent } = await mockApi.getMarketData(address);

    const calculationData = {
      ...data,
      marketRent: data.marketRent || market_rent,
      arv: data.arv || estimated_arv,
    };

    const metrics = calculate(calculationData);

    res.status(200).json({
      inputs: calculationData,
      metrics,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
