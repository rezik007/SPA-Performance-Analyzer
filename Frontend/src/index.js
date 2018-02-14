import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './assets/styles/index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import store from './reducers/store';

import './assets/styles/main.css';

ReactDOM.render(
    <Provider store={store}>
            <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
