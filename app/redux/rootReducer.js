import {combineReducers} from 'redux';
import authReducer from './authSlice';
import likeReducer from './likeSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  likeDislike: likeReducer,
});

export default rootReducer;
