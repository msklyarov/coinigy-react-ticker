import ActionTypes from '../constants/action_types';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.COINIGY_KEYS_SET:
      return action.payload;
    case ActionTypes.COINIGY_KEYS_CLEAR:
      return {};
    default:
      return state;
  }
};
