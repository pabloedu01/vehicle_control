import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import {API_URL, PUSHER_APP_CLUSTER, PUSHER_APP_KEY, PUSHER_APP_PORT, PUSHER_APP_URL} from "../config/system";
import {APICore} from "../helpers/api/apiCore";

const api = new APICore();

const user = api.getLoggedInUser();

export const socket = () => {
    return new Echo({
        broadcaster: 'pusher',
        key: PUSHER_APP_KEY,
        cluster: PUSHER_APP_CLUSTER,
        wsHost: PUSHER_APP_URL,
        wsPort: PUSHER_APP_PORT,
        disableStats: true,
        forceTLS: false,
        authEndpoint: API_URL + '/broadcasting/auth',
        auth: {
            headers: {
                'Authorization': 'Bearer ' + user?.token,
            }
        },
        enabledTransports: ['ws'],
    })
};
