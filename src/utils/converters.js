export const formatUnits = (unit, decimals = 9) => {
  return unit * 10 ** decimals;
};

export const parseUnits = (unit, decimals = 9) => {
  if (!unit) {
    return 0;
  }
  return parseInt(unit.replace(/,/g, "")) / 10 ** decimals;
};
