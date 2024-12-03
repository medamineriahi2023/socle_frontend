import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AbstractServiceService} from "../abstract-service.service";
import {User} from "../../../models/User";
import {Role} from "../../../models/Role";
import {Group} from "../../../models/Group";

@Injectable({
  providedIn: 'root'
})
export class UserService extends AbstractServiceService<User>{
    public url: string;

  constructor(public http:HttpClient) {
      super("http://localhost:5004/security/v1/users" , http);
  }

  private refreshSource = new BehaviorSubject<boolean>(false);
    refresh$ = this.refreshSource.asObservable();

    triggerRefresh(){
        this.refreshSource.next(true);
    }

    private groupRefreshSource = new BehaviorSubject<boolean>(false);
    groupRefresh$ = this.groupRefreshSource.asObservable();


    checkUsernameExistence(username: string ): Observable<boolean>{
        return this.http.get<boolean>(this.url + `/existence/${username}` );
    }

    getDeliveryMens(): Observable<User>{
        return this.http.get<User>(this.url + `/delivery` );
    }


    groupTriggerRefresh(){
        this.groupRefreshSource.next(true);
    }

    getUserById(userId: string ): Observable<any>{
        return this.http.get<any>(this.url + `/${userId}` );
    }

    getUserImageUrlByUserId(userId: string): Observable<string> {
        return this.http.get(this.url + `/image/${userId}`, { responseType: 'text' });
    }

    getUserNameSuggestions(firstname: string, lastName:string ): Observable<any>{
        return this.http.get<any>(this.url + `/suggestions/${firstname}/${lastName}` );
    }

    getUserName(userId: string ): Observable<Map<string, string>>{
        return this.http.get<Map<string, string>>(this.url + `/${userId}` );
    }

    delete(operationId: any){
        return this.http.delete<any[]>(this.url+`/users/${operationId}`);
    }
    getRoles(): Observable<Role[]>{
        return this.http.get<Role[]>(this.url + `/roles` );
    }

    resetPassword(data: any, password: any) {
        return this.http.post(this.url + `/users/changepassword`, {iduser : data , password : password});
    }

    assignRolesToUser(userId: string, rolesId: any[]): Observable<any> {
      const requestBody = {
            userId: userId,
            roleIds: rolesId
        };
        return this.http.post(this.url + '/users/assignRolesToUser', requestBody);
    }

    assignCompositeRolesForRole(roleId: string, rolesIds: string[]) {
        const requestBody = {
            roleId: roleId,
            rolesIds: rolesIds
        };
        return this.http.post(this.url+'/roles/assignCompositeRolesForRole', requestBody);
    }

    getAllPermissions(): Observable<Role[]>
    {
        return this.http.get<Role[]>(this.url +'/roles/permissions')
    }


    updateRole(role: Role): Observable<Role>
    {
        return this.http.put<Role>(this.url + `/roles`, role);
    }

    saveRole(roleName: string): Observable<Role>
    {
        let role = {'name': roleName};
        return this.http.post<Role>(this.url + `/roles`, role);
    }

    deleteRole(roleName: any){
        return this.http.delete<Role>(this.url + `/roles/${roleName}`);

    }

    deleteGroup(groupId: string) {
        return this.http.delete(this.url +`/groups/${groupId}`);
    }

    getAllGroups(): Observable<any[]>
    {
        return this.http.get<any[]>(this.url + "/groups")
    }

    updateGroup(group: Group): Observable<any>
    {
        return this.http.put<any>(this.url +`/groups`, group);
    }

    saveGroup(group: Group): Observable<any>
    {
        return this.http.post<any>(this.url + `/groups`,group);
    }

    assignUsersToGroup(groupId: string, usersIds: any[]): Observable<any> {
        const requestBody = {
            groupId: groupId,
            userIds: usersIds
        };
        return this.http.post(this.url + '/groups/assignUsersToGroup', requestBody);
    }

    assignRolesToGroup(groupId: string, roleIds: any[]): Observable<any> {
        const requestBody = {
            groupId: groupId,
            roleIds: roleIds
        };
        return this.http.post(this.url + '/groups/assignRolesToGroup', requestBody);
    }

}
