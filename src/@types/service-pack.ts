import {AttributeKey} from "@/@types/product";
import {Price} from "@/@types/price";

export type Attribute = {
  key: AttributeKey;
  value: string | number;
  name: string;
  unit?: string;
};

export type ServicePack = {
  _id: string;
  prices: Price[];
  attributes: Attribute[];
};

export type ServicePackState = {
  servicePacks: ServicePack[];
};

export type SetServicePacks = {
  type: 'SET_SERVICE_PACKS';
  payload: ServicePack[];
};

export type ServicePackActions = SetServicePacks;
