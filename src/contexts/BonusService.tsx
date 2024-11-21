import { BonusServiceActions, BonusServiceState } from 'src/@types/bonus-service';
import { Dispatch, createContext } from 'react';

export const initialState: BonusServiceState = {
  bonusServices: [],
};

const BonusServiceContext = createContext<{
  state: BonusServiceState;
  dispatch: Dispatch<BonusServiceActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export default BonusServiceContext;
