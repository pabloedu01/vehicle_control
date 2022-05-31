import {Subject} from "rxjs";
import moment from "moment";
import {toast} from "react-toastify";

class Service {
  elements = [];
  toast =  new Subject();

  init(){
    return this.toast.asObservable();
  }

  show(type, message) {

    /*

    success
info
error
warning
warn
dark
    */
    const found = this.elements.find((element) => element.type === type && element.message === message && moment().diff(moment(element.date), 'seconds') <= 5);

    if(!found){
      toast[type](message);

      this.elements.push({
        type,
        message,
        date: new Date()
      });

      this.elements = this.elements.filter((element) => moment().diff(moment(element.date), 'seconds') <= 5);
    }
  }
}

export const toastService = new Service();
