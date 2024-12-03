import {Injectable} from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient} from "@angular/common/http";
import {SubCategory} from "../../../models/SubCategory";
import {Observable} from "rxjs";
import {Category} from "../../../models/Category";

@Injectable({
  providedIn: 'root'
})
export class LocationService{

    constructor(public http:HttpClient) {
    }

    getLocation(lng :string, lat: string): Observable<any>{
        return this.http.get<any>(`https://cors-anywhere.herokuapp.com/https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&lang=fr&apiKey=1176e8e101ef4787abd1377156684b4f`);
    }

}
