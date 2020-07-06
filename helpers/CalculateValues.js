function round(value) {
  return +value.toFixed(2);
}

function calculateInteraction(fullValue, percentage) {
  return round(fullValue * (1 + percentage / 100));
}

function calculateRelativeValue(newValue, fullValue) {
  return round(newValue - fullValue);
}

function calculatePercent(changedValue, fullValue) {
  return round((changedValue * 100) / fullValue);
}

function calculateCompoundInterest(capital, interestRate, period) {
  let plots = [];
  let amount = capital;
  let actualPeriod = 0;
  let actualValue = 0;
  let relativePercent = 0;

  for (let index = 0; index < period; index++) {
    amount = calculateInteraction(amount, interestRate);
    actualValue = calculateRelativeValue(amount, capital);
    relativePercent = calculatePercent(actualValue, capital);
    actualPeriod = index + 1;

    plots.push({
      amount,
      actualValue,
      relativePercent,
      actualPeriod,
    });
  }

  return plots;
}

export { calculateCompoundInterest };
