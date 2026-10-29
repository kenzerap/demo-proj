export const encodeImageUrl = (url: string, imageName: string): string => {
  const name = imageName || '';
  const encodeUrl = (url || '').replaceAll(name, encodeURIComponent(name));
  return encodeUrl;
};
