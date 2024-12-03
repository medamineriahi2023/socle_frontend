import {Injectable} from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {SubCategory} from "../../../models/SubCategory";
import {InvoiceData} from "../../../models/InvoiceData";

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends AbstractServiceService<any>{

    constructor(public http:HttpClient) {
        super("http://localhost:9098/api/storage" , http);
    }

    saveFile(file: File): Observable<any>{
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.http.post<any>(this.url+ '/upload', formData)
    }

}
