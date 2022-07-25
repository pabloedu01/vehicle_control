import {Subject} from "rxjs";
import Pusher from 'pusher-js';
import Echo from "laravel-echo";
import {API_URL, PUSHER_APP_CLUSTER, PUSHER_APP_KEY, PUSHER_APP_PORT, PUSHER_APP_URL} from "../config/system";
import {toastService} from "./toast";

class Service {
  user: any = null;
  echo: Echo = null;
  sockets =  new Subject();

  init(){
    return this.sockets.asObservable();
  }

  setConnection(user){
    this.user = user;

    this.echo = new Echo({
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
    });
  }

  notifications() {
    this.echo.private('notifications.'+this.user.id).listen('Notifications', (notification) => {
      toastService.show('info', notification.message);
    });
  }

  disconnect(){
    this.user = null;
    this.echo.disconnect();
  }
}

export const socketsService = new Service();
