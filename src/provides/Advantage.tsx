import React, { FC, ReactNode, useReducer } from 'react';
import {AdvantageActions, AdvantageState} from "@/@types/advantage";
import AdvantageContext, {initialState} from "@/contexts/Advantage";

type Props = {
  children: ReactNode;
};

const reducer = (state: AdvantageState, action: AdvantageActions): AdvantageState => {
  switch (action.type) {
    case 'SET_ADVANTAGES':
      return {
        ...state,
        advantages: action.payload,
      };
    default:
      return state;
  }
};

const AdvantageProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AdvantageContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AdvantageContext.Provider>
  );
};

export default AdvantageProvider;
