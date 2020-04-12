const time = (data) => {
  let convertedTime = data.timeToElapse;
  if (data.periodType.toLowerCase() === 'weeks') {
    convertedTime = data.timeToElapse * 7;
  } if (data.periodType.toLowerCase() === 'months') {
    convertedTime = data.timeToElapse * 30;
  }
  return convertedTime;
};

const estimateInfections = (x) => Math.round(x * 0.15);

const estimateCasesForICU = (x) => Math.round(x * 0.05);

const estimateVentilators = (x) => Math.round(x * 0.02);

const c = (x, y) => (Math.round(x * 0.35) - y);


const y = (data) => {
  const z = time(data);
  return (2 ** Math.round(z / 3));
};

const covid19ImpactEstimator = (data) => {
  const resp = {
    data,
    impact: {},
    severeImpact: {}
  };

  const x1 = resp.impact;
  const y1 = resp.severeImpact;


  x1.currentlyInfected = data.reportedCases * 10;
  x1.infectionsByRequestedTime = x1.currentlyInfected * y(data);
  x1.severeCasesByRequestedTime = estimateInfections(x1.infectionsByRequestedTime);
  x1.hospitalBedsByRequestedTime = c(data.totalHospitalBeds, x1.severeCasesByRequestedTime);
  x1.casesForICUByRequestedTime = estimateCasesForICU(x1.infectionsByRequestedTime);
  x1.casesForVentilatorsByRequestedTime = estimateVentilators(x1.infectionsByRequestedTime);

  const multiX = (x1.infectionsByRequestedTime * data.region.avgDailyIncomePopulation);

  x1.dollarsInFlight = multiX * data.region.avgDailyIncomeInUSD * time(data);

  y1.currentlyInfected = data.reportedCases * 50;
  y1.infectionsByRequestedTime = y1.currentlyInfected * y(data);
  y1.severeCasesByRequestedTime = estimateInfections(y1.infectionsByRequestedTime);
  y1.hospitalBedsByRequestedTime = c(data.totalHospitalBeds, y1.severeCasesByRequestedTime);
  y1.casesForICUByRequestedTime = estimateCasesForICU(y1.infectionsByRequestedTime);
  y1.casesForVentilatorsByRequestedTime = estimateVentilators(y1.infectionsByRequestedTime);

  const multiY = (y1.infectionsByRequestedTime * data.region.avgDailyIncomePopulation);

  y1.dollarsInFlight = multiY * data.region.avgDailyIncomeInUSD * time(data);

  return (resp);
};

export default covid19ImpactEstimator;
