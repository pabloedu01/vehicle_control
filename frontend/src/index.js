import React from 'react';
import ReactDOM from 'react-dom';

import './i18n';

import App from './App';

import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {toastService} from "./services/toast";
import Loading from "./components/Loading";

toastService.init().subscribe((data) => {

});

ReactDOM.render(
    <Provider store={configureStore({})}>
        <ToastContainer position="top-right" preventDuplicates={true} preventOpenDuplicates={true}/>
        <Loading />
        <App />
    </Provider>,
    document.getElementById('root')
);
