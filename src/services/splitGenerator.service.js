const equalSplit = (amount, participants) => {
    const share = amount / participants.length;
    return participants.map(userId => ({
        userId,
        share
    }));
};


const percentageSplit = (amount, splitData) => {
  const totalPercent = splitData.reduce(
    (sum, s) => sum + s.percent,
    0
  );

  if (totalPercent !== 100)
    throw new Error("Percentages must total 100");

  return splitData.map(s => ({
    userId: s.userId,
    share: Number(((amount * s.percent) / 100).toFixed(2))
  }));
};


const customSplit = (amount, splitData) => {
  const total = splitData.reduce(
    (sum, s) => sum + s.amount,
    0
  );

  if (total !== amount)
    throw new Error("Custom split total mismatch");

  return splitData.map(s => ({
    userId: s.userId,
    share: s.amount
  }));
};


const generateSplits = ({
  amount,
  participants,
  splitType,
  splitData
}) => {
  switch (splitType) {
    case "equal":
      return equalSplit(amount, participants);

    case "percentage":
      return percentageSplit(amount, splitData);

    case "custom":
      return customSplit(amount, splitData);

    default:
      throw new Error("Invalid split type");
  }
};

export default generateSplits;
