export type SolutionCategory = {
  _id: string;
  icon: string;
  title: string;
};

export type SolutionCategoryState = {
  solutionCategories: SolutionCategory[];
};

export type SetSolutionCategories = {
  type: 'SET_SOLUTION_CATEGORIES';
  payload: SolutionCategory[];
};

export type SolutionCategoryActions = SetSolutionCategories;
