import jwtDecode from 'jwt-decode';
import axios from 'axios';

import config from '../../config';
import {loadingService} from "../../services/loading";
import {toastService} from "../../services/toast";

const axiosInstance = axios.create({
    baseURL: `${config.API_URL}`,
    responseType: "json",
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    request => {
        loadingService.show();

        return request;
    },
    error => {
        loadingService.hide();

        toastService.show('error', '¡Request Error!');

        return Promise.reject(error);
    }
);

// intercepting to capture errors
axiosInstance.interceptors.response.use(
    (response) => {
        loadingService.hide();

        if(response.status === 201){
            toastService.show('success', 'Salvou');
        }

        return response;
    },
    (error) => {
        loadingService.hide();

        if(error.response?.data.hasOwnProperty('msg')){
            toastService.show('error', error.response.data.msg);
        }

        return Promise.reject(error);
    }
);

const AUTH_SESSION_KEY = 'hyper_user';

/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
    if (token) axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    else delete axiosInstance.defaults.headers.common['Authorization'];
};

const getUserFromSession = () => {
    const user = sessionStorage.getItem(AUTH_SESSION_KEY);
    return user ? (typeof user == 'object' ? user : JSON.parse(user)) : null;
};
class APICore {
    /**
     * Fetches data from given url
     */
    get = (url, params) => {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                      .map((key) => key + '=' + params[key])
                      .join('&')
                : '';
            response = axiosInstance.get(`${url}?${queryString}`, params);
        } else {
            response = axiosInstance.get(`${url}`, params);
        }
        return response;
    };

    getFile = (url, params) => {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                      .map((key) => key + '=' + params[key])
                      .join('&')
                : '';
            response = axiosInstance.get(`${url}?${queryString}`, { responseType: 'blob' });
        } else {
            response = axiosInstance.get(`${url}`, { responseType: 'blob' });
        }
        return response;
    };

    getMultiple = (urls, params) => {
        const reqs = [];
        let queryString = '';
        if (params) {
            queryString = params
                ? Object.keys(params)
                      .map((key) => key + '=' + params[key])
                      .join('&')
                : '';
        }

        for (const url of urls) {
            reqs.push(axiosInstance.get(`${url}?${queryString}`));
        }
        return axiosInstance.all(reqs);
    };

    post = (url, data) => {
        return axiosInstance.post(url, data);
    };

    /**
     * post given data to url
     */
    create = (url, data) => {
        return axiosInstance.post(url, data);
    };

    /**
     * Updates patch data
     */
    updatePatch = (url, data) => {
        return axiosInstance.patch(url, data);
    };

    /**
     * Updates data
     */
    update = (url, data) => {
        return axiosInstance.put(url, data);
    };

    /**
     * Deletes data
     */
    delete = (url) => {
        return axiosInstance.delete(url);
    };

    /**
     * post given data to url with file
     */
    createWithFile = (url, data) => {
        const formData = new FormData();
        for (const k in data) {
            formData.append(k, data[k]);
        }

        const config = {
            headers: {
                ...axiosInstance.defaults.headers,
                'content-type': 'multipart/form-data',
            },
        };
        return axiosInstance.post(url, formData, config);
    };

    /**
     * post given data to url with file
     */
    updateWithFile = (url, data) => {
        const formData = new FormData();
        for (const k in data) {
            formData.append(k, data[k]);
        }

        const config = {
            headers: {
                ...axiosInstance.defaults.headers,
                'content-type': 'multipart/form-data',
            },
        };
        return axiosInstance.patch(url, formData, config);
    };

    isUserAuthenticated = () => {
        const user = this.getLoggedInUser();
        if (!user || (user && !user.token)) {
            return false;
        }
        const decoded = jwtDecode(user.token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn('access token expired');
            return false;
        } else {
            return true;
        }
    };

    setLoggedInUser = (session) => {
        if (session) sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        else {
            sessionStorage.removeItem(AUTH_SESSION_KEY);
        }
    };

    /**
     * Returns the logged in user
     */
    getLoggedInUser = () => {
        return getUserFromSession();
    };

    setUserInSession = (modifiedUser) => {
        let userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
        if (userInfo) {
            const { token, user } = JSON.parse(userInfo);
            this.setLoggedInUser({ token, ...user, ...modifiedUser });
        }
    };
}

/*
Check if token available in session
*/
let user = getUserFromSession();
if (user) {
    const { token } = user;
    if (token) {
        setAuthorization(token);
    }
}

export { APICore, setAuthorization };
