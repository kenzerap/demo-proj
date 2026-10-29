import { Observable } from 'rxjs';

export const getImageSizeOser = (
  file: File
): Observable<{ width: number; height: number } | null> => {
  return new Observable((observer) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      observer.next({ width: img.width, height: img.height });
      observer.complete();
    };
    img.onerror = () => {
      observer.next(null);
      observer.complete();
    };
  });
};
