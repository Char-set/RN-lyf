
import { combineReducers } from 'redux';
import userReducer from './user';
import positionReducer from './position';

export default combineReducers({
	userStore: userReducer,
	positionStore:positionReducer
});
