import { ValueCode } from '@app/shared/models/value-code.model';
import { CampaignType } from '../../../shared/utils/enums/campaign-type.enums';

export const CampaignTypes: ValueCode[] = [
  { value: 'Normal', code: CampaignType.NORMAL },
  { value: 'Special Campaign', code: CampaignType.SPECIAL_CAMPAIGN },
  { value: 'Highlight Campaign', code: CampaignType.HIGHLIGHT_CAMPAIGN },
  {
    value: 'Exclusive Campaign',
    code: CampaignType.HEALTH_EXCLUSIVE_CAMPAIGNCARE,
  },
  { value: 'Happening Campaign', code: CampaignType.HAPPENING_CAMPAIGN },
];
