import { ValueCode } from '@app/shared/models/value-code.model';

export enum CriteriaCode {
  DailyCheckIn = 'DAILY_CHECK_IN',
  FeatureEngagement = 'FEATURE_ENGAGEMENT',
}

export const criteriaOptions: ValueCode<CriteriaCode>[] = [
  { value: 'Daily Check-in', code: CriteriaCode.DailyCheckIn },
  { value: 'Feature Engagement', code: CriteriaCode.FeatureEngagement },
];
