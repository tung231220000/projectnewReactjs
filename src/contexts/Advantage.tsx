import { AdvantageActions, AdvantageState } from 'src/@types/advantage';
import { Dispatch, createContext } from 'react';

export const initialState: AdvantageState = {
  advantages: [],
};

const AdvantageContext = createContext<{
  state: AdvantageState;
  dispatch: Dispatch<AdvantageActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export default AdvantageContext;
