import {
  SET_USERS
} from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_USERS:
        return {
            ...state,
            users: action.payload
        }
    default:
      return state;
  }
};
