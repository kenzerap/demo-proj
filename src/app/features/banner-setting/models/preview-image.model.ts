export interface PreviewImage {
  bannerId?: number;
  image: string;
  imageData: string | ArrayBuffer | null;
}

export interface PreviewImageDataList {
  data: PreviewImage[];
}
