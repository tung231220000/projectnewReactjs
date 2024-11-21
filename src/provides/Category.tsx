
import React, { FC, ReactNode, useReducer } from 'react';
import {CategoryActions, CategoryState} from "@/@types/category";
import CategoryContext, {initialState} from "@/contexts/Category";

type Props = {
  children: ReactNode;
};

const reducer = (state: CategoryState, action: CategoryActions): CategoryState => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
};

const CategoryProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CategoryContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
