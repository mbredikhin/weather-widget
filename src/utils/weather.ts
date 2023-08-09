export const calculateDewPoint = (temperature: number, humidity: number) => {
  const a = 17.27;
  const b = 237.7;
  const phi = humidity / 100;
  const gamma = (a * temperature) / (b + temperature) + Math.log(phi);
  return (b * gamma) / a - gamma;
};
