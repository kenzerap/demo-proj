export const checkValidPreviewImage = (
  startDate: string,
  endDate: string | null
) => {
  const startDateTime = new Date(startDate);
  const currentDate = new Date();

  if (
    startDateTime <= currentDate &&
    (!endDate || currentDate <= new Date(endDate))
  ) {
    return true;
  }

  return false;
};
