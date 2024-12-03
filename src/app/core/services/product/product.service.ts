import {Injectable} from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProductService extends AbstractServiceService<any>{

    constructor(public http:HttpClient) {
        super("http://localhost:9095/products" , http);
    }

    private refreshSource = new BehaviorSubject<boolean>(false);
    refresh$ = this.refreshSource.asObservable();

    triggerRefresh(){
        this.refreshSource.next(true);
    }

    removeBg(file: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        return this.http.post<any>(`${this.url}/remove/image/bg`, formData, {
            headers: new HttpHeaders({
                'enctype': 'multipart/form-data'
            })
        });
    }

}
