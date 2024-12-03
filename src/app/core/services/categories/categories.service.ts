import { Injectable } from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient} from "@angular/common/http";
import {SubCategory} from "../../../models/SubCategory";
import {BehaviorSubject, Observable} from "rxjs";
import {Category} from "../../../models/Category";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends AbstractServiceService<any>{
    private refreshSource = new BehaviorSubject<boolean>(false);
    refresh$ = this.refreshSource.asObservable();


    constructor(public http:HttpClient) {
        super("http://localhost:9095/categories" , http);
    }




    triggerRefresh() {
        this.refreshSource.next(true);
    }

    saveSubCategoryToCategory(entity :SubCategory, categoryId: Number): Observable<Category>{
        return this.http.post<Category>(this.url+`/create/sub-category/assign/category/${categoryId}`, entity);
    }

    getCategoryWithoutProducts(){
        return this.http.get<Category[]>(this.url+`/get/categories/without/products`);
    }

    getAllCategoriesPages(page: number, elements: number): Observable<Category[]>{
        return this.http.get<Category[]>(this.url+`/api/?page=${page}&size=${elements}`);
    }
}
