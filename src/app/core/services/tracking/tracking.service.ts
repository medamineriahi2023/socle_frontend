import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {TrackingData} from "../../../models/TrackingData";
import {TrackingUserList} from "../../../models/TrackingListData";

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private apiUrl = "http://localhost:8080/tracking";
  private headers = new HttpHeaders({
    'ngrok-skip-browser-warning': 'ngrok-skip'
  });

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.apiUrl, { headers: this.headers });
  }

  save(data: TrackingData) {
    return this.http.post(this.apiUrl, data, { headers: this.headers });
  }

    checkExistence(data: string) {
        return this.http.get(this.apiUrl+`/list/exist/${data}`, { headers: this.headers });
    }
    saveUserData(data: TrackingUserList) {
        return this.http.post(this.apiUrl+ `/list`, data, { headers: this.headers });
    }

    deleteByCommandId(data: number) {
        return this.http.delete(this.apiUrl+ `/list/delete/${data}`, { headers: this.headers });
    }

}

