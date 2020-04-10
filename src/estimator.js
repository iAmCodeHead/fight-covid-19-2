const time = (data) => {
  let convertedTime = data.timeToElapse;
  if (data.periodType.toLowerCase() === 'weeks') {
    convertedTime = data.timeToElapse * 7;
  } if (data.periodType.toLowerCase() === 'months') {
    convertedTime = data.timeToElapse * 30;
  }
  return convertedTime;
};

const estimateCurrentlyInfected = (x) => x * (2 ** 10);

const estimateInfectionsByRequstedTime = (x) => x * 0.15;

const c = (x, y) => x - y;

const covid19ImpactEstimator = (data) => {
  const resp = {
    data,
    impact: {},
    severeImpact: {}
  };

  const x1 = resp.impact;
  const y1 = resp.severeImpact;


  x1.currentlyInfected = data.reportedCases * 10;
  x1.infectionsByRequestedTime = estimateCurrentlyInfected(x1.currentlyInfected);
  x1.severeCasesByRequestedTime = estimateInfectionsByRequstedTime(x1.infectionsByRequestedTime);
  x1.hospitalBedsByRequestedTime = c(data.totalHospitalBeds - x1.severeCasesByRequestedTime);
  x1.casesForICUByRequestedTime = x1.infectionsByRequestedTime * 0.05;
  x1.casesForVentilatorsByRequestedTime = x1.infectionsByRequestedTime * 0.02;
  x1.dollarsInFlight = (x1.infectionsByRequestedTime * data.region.avgDailyIncomePopulation) * data.region.avgDailyIncomeInUSD * time(data);

  y1.currentlyInfected = data.reportedCases * 50;
  y1.infectionsByRequestedTime = estimateCurrentlyInfected(y1.currentlyInfected);
  y1.severeCasesByRequestedTime = estimateInfectionsByRequstedTime(y1.infectionsByRequestedTime);
  y1.hospitalBedsByRequestedTime = c(data.totalHospitalBeds - y1.severeCasesByRequestedTime);
  y1.casesForICUByRequestedTime = y1.infectionsByRequestedTime * 0.05;
  y1.casesForVentilatorsByRequestedTime = y1.infectionsByRequestedTime * 0.02;
  y1.dollarsInFlight = (y1.infectionsByRequestedTime * data.region.avgDailyIncomePopulation) * data.region.avgDailyIncomeInUSD * time(data);

  return (resp);
};

export default covid19ImpactEstimator;
