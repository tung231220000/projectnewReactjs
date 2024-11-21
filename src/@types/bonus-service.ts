import { AttributeKey } from './product';
import { Currency } from './price';

export type BonusServiceUnitPrice = {
  minValue: string | number;
  price: number;
};

export type BonusService = {
  _id: string;
  key: AttributeKey;
  minValue: string | number;
  maxValue: string | number;
  name: string;
  unit?: string;
  unitPrices: BonusServiceUnitPrice[];
  currency: Currency;
};

export type BonusServiceState = {
  bonusServices: BonusService[];
};

export type SetBonusServices = {
  type: 'SET_BONUS_SERVICES';
  payload: BonusService[];
};

export type BonusServiceActions = SetBonusServices;
