import React, { FC, ReactNode, useReducer } from 'react';
import {ServicePackActions, ServicePackState} from "@/@types/service-pack";
import ServicePackContext, {initialState} from "@/contexts/ServicePack";


type Props = {
  children: ReactNode;
};

const reducer = (state: ServicePackState, action: ServicePackActions): ServicePackState => {
  switch (action.type) {
    case 'SET_SERVICE_PACKS':
      return {
        ...state,
        servicePacks: action.payload,
      };
    default:
      return state;
  }
};

const ServicePackProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ServicePackContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ServicePackContext.Provider>
  );
};

export default ServicePackProvider;
