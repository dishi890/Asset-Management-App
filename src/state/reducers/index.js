import { combineReducers } from 'redux';
import assetFormReducer from './assetFormReducer'; // ✅ Make sure this path is right

const rootReducer = combineReducers({
  assetForm: assetFormReducer,
});

export default rootReducer;

