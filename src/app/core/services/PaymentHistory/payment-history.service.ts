import {Injectable} from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaymentHistoryService extends AbstractServiceService<any>{

    constructor(public http:HttpClient) {
        super("http://localhost:9095/payment/history" , http);
    }

}
