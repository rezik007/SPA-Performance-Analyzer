import * as Redux from 'redux';
import { reducers } from './';
import thunkMiddleware from 'redux-thunk';

const enhancer = Redux.applyMiddleware(thunkMiddleware)
Redux.applyMiddleware(thunkMiddleware);
const store = Redux.createStore(reducers, enhancer);

export default store;

