export interface EClaimImageUrls {
  presigned_urls: EClaimImageUrl[];
}

export interface EClaimImageUrl {
  key_name: string;
  presigned_url: string;
}
