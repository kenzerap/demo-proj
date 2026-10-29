export interface Privilege {
  privilegeId: number;
  privilegeName: string;
  promoCodeId?: number;
  promoCodeName?: string;
  promoCode?: string;
  codeExpiryDate?: Date;
  privilegeImage?: string;
  bookingType?: string;
  redeemType?: string;
  quota?: number;
  endDateTime?: string;
  thumbnailImage?: string;
  description?: string;
  segmentName?: string;
  targetGroupId?: number;
}
