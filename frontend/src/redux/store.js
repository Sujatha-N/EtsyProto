import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import {cartreducer} from './reducers/CartReducer';
import { currencyreducer } from './reducers/UserReducer';

const reducer = combineReducers({
    cartreducer,
    currencyreducer,
});

const store = createStore(
    reducer,
    composeWithDevTools());

export default store;