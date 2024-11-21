export type Category = {
  _id: string;
  icon: string;
  title: string;
};

export type CategoryState = {
  categories: Category[];
};

export type SetCategories = {
  type: 'SET_CATEGORIES';
  payload: Category[];
};

export type CategoryActions = SetCategories;
