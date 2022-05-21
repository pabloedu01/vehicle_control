import {Subject} from "rxjs";

class Service {
  elements = [];
  loading =  new Subject();

  init(){
    return this.loading.asObservable();
  }

  hideAll(){
    this.elements = [];
    this.loading.next(false);
  }

  show() {
    this.elements.push(1);
    this.loading.next(true);
  }

  hide() {

    if(this.keepLoading()){
      this.elements.splice(0,1);
    }

    this.loading.next(this.keepLoading());
  }

  keepLoading() {
    return this.elements.length > 0;
  }

}

export const loadingService = new Service();
