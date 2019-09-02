import React from 'react';
import values from '../values';
import SpendingGraph from './SpendingGraph';

const groupTransactions = (transactions) => {
  return transactions.reduce((acc, x) => {
    const category = x.assignedCategory;
    const month = values.months[new Date(x.date).getMonth()];
    const amount = x.amount;

    if (acc[category]) {
      if (acc[category][month]) {
        acc[category][month] += amount
      } else {
        acc[category][month] = amount
      }
    } else {
      acc[category] = {[month]: amount};
    };
    return acc;
  }, {});
};

const ChartSection = (props) => {
  const { currentYear, transactions } = props;
  const data = groupTransactions(transactions)
  return (
    <div>
      <SpendingGraph data={data} currentYear={currentYear} />
    </div>
  );
}

export default ChartSection;
