import ActionTypes from '../constants/action_types';

export default (apiKey, apiSecret, channelId) => ({
  type: ActionTypes.COINIGY_KEYS_SET,
  payload: { apiKey, apiSecret, channelId }
});
