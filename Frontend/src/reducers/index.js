import { combineReducers } from 'redux';
import { session } from  './sessions';
import { overview } from './overview';

export const reducers = combineReducers({session, overview});
