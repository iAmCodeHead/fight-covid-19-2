const time = (data) => {
  let convertedTime = data.timeToElapse;
  if (data.periodType.toLowerCase() === 'weeks') {
    convertedTime = data.timeToElapse * 7;
  } if (data.periodType.toLowerCase() === 'months') {
    convertedTime = data.timeToElapse * 30;
  }
  return convertedTime;
};

const estimateInfectionsByRequstedTime = (x) => Math.trunc(x * 0.15);

const c = (x, y) => x - y;


const estimated = (resp) => {
  const x = {
    data: resp.data,
    estimate: {
      impact: resp.impact,
      severeImpact: resp.severeImpact
    }
  };
  return x;
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
  x1.infectionsByRequestedTime = x1.currentlyInfected * (2 ** Math.trunc(data.timeToElapse / 3));
  x1.severeCasesByRequestedTime = estimateInfectionsByRequstedTime(x1.infectionsByRequestedTime);
  x1.hospitalBedsByRequestedTime = c(data.totalHospitalBeds, x1.severeCasesByRequestedTime);
  x1.casesForICUByRequestedTime = x1.infectionsByRequestedTime * 0.05;
  x1.casesForVentilatorsByRequestedTime = x1.infectionsByRequestedTime * 0.02;

  const multiX = (x1.infectionsByRequestedTime * data.region.avgDailyIncomePopulation);

  x1.dollarsInFlight = multiX * data.region.avgDailyIncomeInUSD * time(data);

  y1.currentlyInfected = data.reportedCases * 50;
  y1.infectionsByRequestedTime = y1.currentlyInfected * (2 ** Math.trunc(data.timeToElapse / 3));
  y1.severeCasesByRequestedTime = estimateInfectionsByRequstedTime(y1.infectionsByRequestedTime);
  y1.hospitalBedsByRequestedTime = c(data.totalHospitalBeds, y1.severeCasesByRequestedTime);
  y1.casesForICUByRequestedTime = y1.infectionsByRequestedTime * 0.05;
  y1.casesForVentilatorsByRequestedTime = y1.infectionsByRequestedTime * 0.02;

  const multiY = (y1.infectionsByRequestedTime * data.region.avgDailyIncomePopulation);

  y1.dollarsInFlight = multiY * data.region.avgDailyIncomeInUSD * time(data);

  return estimated(resp);
};

export default covid19ImpactEstimator;
