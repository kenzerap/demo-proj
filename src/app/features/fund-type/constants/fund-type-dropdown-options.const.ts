import { ValueCode } from '@app/shared/models/value-code.model';
import { FundTypeCode } from '../enums/fund-type-code.enum';
import { FundClassCode } from '../enums/fund-class-code.enum';
import { FxRateFlagCode } from '../enums/fx-rate-flag-code.enum';
import { FxHedgingCepCode } from '../enums/fx-hedging-cep-code.enum';
import { FxHedgingPriveCode } from '../enums/fx-hedging-prive-code.enum';

export const fundTypeOptions: ValueCode<FundTypeCode>[] = [
  { value: 'Equity Fund', code: FundTypeCode.EquityFund },
  { value: 'Alternative Fund', code: FundTypeCode.AlternativeFund },
  { value: 'Domestic Money Market', code: FundTypeCode.DomesticMoneyMarket },
  { value: 'Mixed Fund', code: FundTypeCode.MixedFund },
  { value: 'Sector Fund', code: FundTypeCode.SectorFund },
  { value: 'Fixed Income Fund', code: FundTypeCode.FixedIncomeFund },
];

export const fundClassOptions: ValueCode<FundClassCode>[] = [
  { value: 'Domestic', code: FundClassCode.Domestic },
  { value: 'Foreign', code: FundClassCode.Foreign },
];

export const fxRateFlagOptions: ValueCode<FxRateFlagCode>[] = [
  { value: 'Yes', code: FxRateFlagCode.Yes },
  { value: 'No', code: FxRateFlagCode.No },
];

export const fxHedgingCepOptions: ValueCode<FxHedgingCepCode>[] = [
  { value: '-', code: FxHedgingCepCode.None },
  { value: 'FX hedge', code: FxHedgingCepCode.FxHedge },
  { value: 'Discretionary', code: FxHedgingCepCode.Discretionary },
  { value: 'Fully hedge', code: FxHedgingCepCode.FullyHedge },
];

export const fxHedgingPriveOptions: ValueCode<FxHedgingPriveCode>[] = [
  { value: 'No FX hedge', code: FxHedgingPriveCode.NoFxHedge },
  { value: 'FX hedge', code: FxHedgingPriveCode.FxHedge },
  { value: 'Discretionary', code: FxHedgingPriveCode.Discretionary },
  { value: 'Fully hedge', code: FxHedgingPriveCode.FullyHedge },
];

export const riskLevelOptions: ValueCode<number>[] = [
  { value: '1', code: 1 },
  { value: '2', code: 2 },
  { value: '3', code: 3 },
  { value: '4', code: 4 },
  { value: '5', code: 5 },
  { value: '6', code: 6 },
  { value: '7', code: 7 },
  { value: '8', code: 8 },
];
