import { CategoryActions, CategoryState } from 'src/@types/category';
import { Dispatch, createContext } from 'react';

export const initialState: CategoryState = {
  categories: [],
};

const CategoryContext = createContext<{
  state: CategoryState;
  dispatch: Dispatch<CategoryActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export default CategoryContext;
