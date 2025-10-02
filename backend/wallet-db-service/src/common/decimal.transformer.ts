export const DecimalTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};
