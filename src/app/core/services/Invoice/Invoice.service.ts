import {Injectable} from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SubCategory} from "../../../models/SubCategory";
import {InvoiceData} from "../../../models/InvoiceData";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends AbstractServiceService<any>{

    constructor(public http:HttpClient) {
        super("http://localhost:9099/generate/invoice" , http);
    }

    generateInvoice(invoiceData: InvoiceData): Observable<any>{
        return this.http.post<any>(this.url, invoiceData);
    }

}
