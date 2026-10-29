import { RedeemType } from '@app/shared/utils/enums/redeem-type.enum';

export interface RedeemHistory {
  id: number;
  userId: number;
  transactionDate: string;
  privilegeId: number;
  privilegeName: string;
  placeNameThai: string;
  placeNameEn: string;
  redeemCode: string | null;
  promoCodeCode: string | null;
  uniCodeCode: string;
  promoCodeName: string | null;
  uniCodeName: string;
  promoUniCodeCode: string;
  promoUniCodeName: string;
  redeemType: RedeemType;
  point: number;
  errorCodeMessageThai: string;
  errorCodeMessageEn: string;
}

export interface RedeemHistoryTable extends RedeemHistory {
  promoOrUniqueCode: string | null;
}
