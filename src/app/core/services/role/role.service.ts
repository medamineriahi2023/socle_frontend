import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }

    private roleRefreshSource = new BehaviorSubject<boolean>(false);
    roleRefresh$ = this.roleRefreshSource.asObservable();

    roleTriggerRefresh(){
        this.roleRefreshSource.next(true);
    }

    private globalRoleRefreshSource = new BehaviorSubject<boolean>(false);
    globalRoleRefresh$ = this.globalRoleRefreshSource.asObservable();

    globalRoleTriggerRefresh(){
        this.globalRoleRefreshSource.next(true);
    }
}
