import { Injectable } from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SubCategory} from "../../../models/SubCategory";

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService extends AbstractServiceService<any>{

    constructor(public http:HttpClient) {
        super("http://localhost:9095/subCategory" , http);
    }

    getAllWithoutProducts(): Observable<SubCategory[]>{
        return this.http.get<SubCategory[]>(this.url+ "/subCategories/without/products");
    }

}
