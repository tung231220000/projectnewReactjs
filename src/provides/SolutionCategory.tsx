import React, { FC, ReactNode, useReducer } from 'react';
import {SolutionCategoryActions, SolutionCategoryState} from "@/@types/solution-category";
import SolutionCategoryContext, {initialState} from "@/contexts/SolutionCategory";

type Props = {
  children: ReactNode;
};

const reducer = (
  state: SolutionCategoryState,
  action: SolutionCategoryActions
): SolutionCategoryState => {
  switch (action.type) {
    case 'SET_SOLUTION_CATEGORIES':
      return {
        ...state,
        solutionCategories: action.payload,
      };
    default:
      return state;
  }
};

const SolutionCategoryProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SolutionCategoryContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </SolutionCategoryContext.Provider>
  );
};

export default SolutionCategoryProvider;
