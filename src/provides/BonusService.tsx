import { BonusServiceActions, BonusServiceState } from 'src/@types/bonus-service';
import React, { FC, ReactNode, useReducer } from 'react';
import BonusServiceContext, {initialState} from "@/contexts/BonusService";

type Props = {
  children: ReactNode;
};

const reducer = (state: BonusServiceState, action: BonusServiceActions): BonusServiceState => {
  switch (action.type) {
    case 'SET_BONUS_SERVICES':
      return {
        ...state,
        bonusServices: action.payload,
      };
    default:
      return state;
  }
};

const BonusServiceProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <BonusServiceContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </BonusServiceContext.Provider>
  );
};

export default BonusServiceProvider;
