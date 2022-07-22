import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import {API_URL, PUSHER_APP_CLUSTER, PUSHER_APP_KEY, PUSHER_APP_PORT, PUSHER_APP_URL} from "../config/system";
import {APICore} from "../helpers/api/apiCore";

const api = new APICore();

const user = api.getLoggedInUser();

export const socket = new Echo({
    broadcaster: 'pusher',
    key: 'ASDASD2121',
    cluster: 'mt1',
    wsHost: 'localhost',
    wsPort: '6002',
    disableStats: true,
    forceTLS: false,
    authEndpoint: API_URL + '/broadcasting/auth',
    auth: {
        headers: {
            'Authorization': 'Bearer ' + user?.token,
        }
    },
    enabledTransports: ['ws'],
});
