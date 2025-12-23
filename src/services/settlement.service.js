const calculateSettlement = (expenses) => {
  const balance = {};

  expenses.forEach(exp => {
    balance[exp.paidBy] = (balance[exp.paidBy] || 0) + exp.amount;

    exp.splits.forEach(split => {
      balance[split.userId] =
        (balance[split.userId] || 0) - split.share;
    });
  });

  const debtors = [];
  const creditors = [];

  for (let user in balance) {
    if (balance[user] < 0) debtors.push({ user, amt: -balance[user] });
    else if (balance[user] > 0) creditors.push({ user, amt: balance[user] });
  }

  const settlements = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const min = Math.min(debtors[i].amt, creditors[j].amt);

    settlements.push({
      from: debtors[i].user,
      to: creditors[j].user,
      amount: min
    });

    debtors[i].amt -= min;
    creditors[j].amt -= min;

    if (debtors[i].amt === 0) i++;
    if (creditors[j].amt === 0) j++;
  }

  return settlements;
};

export default calculateSettlement;
