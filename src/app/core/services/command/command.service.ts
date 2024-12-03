import {Injectable} from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../../../models/Category";
import {Command} from "../../../models/Command";

@Injectable({
  providedIn: 'root'
})
export class CommandService extends AbstractServiceService<any>{

    constructor(public http:HttpClient) {
        super("http://localhost:9095/commands" , http);
    }

    getCommandsByResponsibleId(responsibleId: string): Observable<Command[]>{
        return this.http.get<Command[]>(this.url+`/get/by/${responsibleId}`);
    }


    getCommandHistory(): Observable<Command[]>{
        return this.http.get<Command[]>(this.url+`/history`);
    }


    getResponseCommand(responsibleId: string): Observable<Command[]>{
        return this.http.get<Command[]>(this.url+`/get/response/${responsibleId}`);
    }

    acceptCommand(commandId: number, tva: number): Observable<Command>{
        return this.http.post<Command>(this.url+`/accept/${commandId}/tva/${tva}`, {});
    }

    refuseCommand(commandId: number): Observable<Command>{
        return this.http.post<Command>(this.url+`/refuse/${commandId}`, {});
    }

    confirmCommand(commandId: number): Observable<Command>{
        return this.http.post<Command>(this.url+`/confirm/${commandId}`, {});
    }

    addInvoicePdfToCommand(commandId: number, url: string): Observable<Command>{
        return this.http.post<Command>(this.url+`/add/invoice/url/${commandId}`, url);
    }

}
