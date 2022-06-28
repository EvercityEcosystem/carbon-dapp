export const toEverUSD = amount => (amount || 0) * 10 ** 9;

export const fromEverUSD = amount => (amount || 0) / 10 ** 9;

export const toPercent = amount => (amount || 0) / 10 ** 3;

export const fromPercent = amount => amount * 10 ** 3;

export const fromBondDays = (value, timeStep) => value / timeStep;

export const toBondDays = (value, timeStep) => value * timeStep;
