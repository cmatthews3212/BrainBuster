import React, { createContext, useContext, useReducer } from "react";
import { reducer } from './reducers'

const GlobalContext = createContext();
const { Provider } = GlobalContext;

export function useGlobalReducer(initialState) {
  return useReducer(reducer, initialState)
}

const GlobalProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useGlobalReducer({
    users: [],
  });

  return <Provider value={[state, dispatch]} {...props} />;
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export { GlobalProvider, useGlobalContext };
