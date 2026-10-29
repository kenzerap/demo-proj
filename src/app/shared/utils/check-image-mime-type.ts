export const checkImageMimeType = (
  file: File,
  customMimeTypes: string[] = [],
): boolean => {
  const validMimeTypes =
    customMimeTypes.length > 0
      ? customMimeTypes
      : ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];

  return validMimeTypes.includes(file.type);
};
