export const isEmptyValue = (value: any): boolean => {
  return value == null || value === ''; // value == null <=> value === null && value === undefined
};
