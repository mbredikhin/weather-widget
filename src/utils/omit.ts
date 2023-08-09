export const omit = <T extends object, K extends keyof T>(
  target: T,
  ...keys: K[]
) => {
  return (Object.keys(target) as K[]).reduce(
    (acc, key) => (keys.includes(key) ? acc : { ...acc, [key]: target[key] }),
    {} as Omit<T, K>
  );
};
