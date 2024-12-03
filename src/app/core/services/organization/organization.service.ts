import {Injectable} from '@angular/core';
import {BehaviorSubject, concatMap, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AbstractServiceService} from "../abstract-service.service";
import {Role} from "../../../models/Role";
import {Group} from "../../../models/Group";

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends AbstractServiceService<any>{
    public url: string;
    public url2: string;

  constructor(public http:HttpClient) {
      super("http://localhost:5004/security/v1/orgs" , http);
  }

  private refreshSource = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshSource.asObservable();


  triggerRefresh(){
      this.refreshSource.next(true);
  }



    getRoles(): Observable<Role[]>{
        return this.http.get<Role[]>(this.url + `/organisation/roles/${localStorage.getItem('organisationId')}` );
    }

    resetPassword(data: any, password: any) {
        return this.http.post(this.url2 + `/resetPassword`, {iduser : data , password : password});
    }

    createAndAssignUser(entity :any, organisationId?:string): Observable<any>{
      if (organisationId == null){
          return this.http.post<any>(this.url+ `/createAndAssignUserToOrganization/${localStorage.getItem('organisationId')}`, entity);
      }
        return this.http.post<any>(this.url+ `/createAndAssignUserToOrganization/${organisationId}`, entity);
    }
    updateRole(role: Role): Observable<Role>
    {
        return this.http.put<Role>(this.url + `/roles`, role);
    }

    getAll(): Observable<any[]>{
        return this.http.get<any[]>(this.url+`/memberships/${localStorage.getItem('organisationId')}`);
    }

    delete(operationId: any){
        return this.http.delete<any[]>(this.url+`/removeMember/${localStorage.getItem('organisationId')}/${operationId}`);
    }

    deleteOrg(orgId:string){
        return this.http.delete<any[]>(this.url+`/${orgId}`);
    }
    saveRole(roleName: string): Observable<Role>
    {
        let role = {'name': roleName};
        return this.http.post<Role>(this.url + `/createRoleForOrganisation/${localStorage.getItem('organisationId')}`, role);
    }

    addMember(orgId : string, userId: string): Observable<any>{
      return this.http.put(this.url + `/addMember/${orgId}/${userId}`, {});
    }


    addMembersToOrganization(orgId : string, userIds: string[]): Observable<any>{
        return this.http.put(this.url + `/addListOfMembersToOrganization/${orgId}`, userIds);
    }


    assignRolesToUser(userId: string, rolesId: any[]): Observable<any> {
      const requestBody = {
            userId: userId,
            roleIds: rolesId
        };
        return this.http.post(this.url2 + '/assignRolesToUser', requestBody);
    }
    assignOrgRolesToUser(userId: string, rolesId: any[]): Observable<any> {
        let body = {'roleNames': rolesId}
        return this.http.put(this.url + `/grantOrgRoleToUser/${localStorage.getItem('organisationId')}/${userId}`, rolesId);
    }

    getAllOrganisations(): Observable<any> {
        return this.http.get(this.url);
    }

    addAndAssignOrganisationToUser(organisation: any, userId: string): Observable<any> {
        return this.http.post(this.url+ `/createAndAssign/${userId}`, organisation)
    }



    deleteRole(roleName: any){
        return this.http.delete<Role>(this.url + `/deleteRoleForOrganisation/${localStorage.getItem('organisationId')}/${roleName}`);

    }

    checkIfUserMemberOfOrganisation(userId: any){
        return this.http.get<boolean>(this.url + `/membership/isAMember/${localStorage.getItem('organisationId')}/${userId}`);

    }

    deleteGroup(groupId: string) {
        return this.http.delete(this.url2 +`/groups/${groupId}`);
    }

    getAllGroups(): Observable<any[]>
    {
        return this.http.get<any[]>(this.url2 + "/groups")
    }

    updateGroup(group: Group): Observable<any>
    {
        return this.http.put<any>(this.url2 +`/groups`, group);
    }

    saveGroup(group: Group): Observable<any>
    {
        return this.http.post<any>(this.url2 + `/groups`,group);
    }

    assignUsersToGroup(groupId: string, usersIds: any[]): Observable<any> {
        const requestBody = {
            groupId: groupId,
            userIds: usersIds
        };
        return this.http.post(this.url2 + '/groups/assignUsersToGroup', requestBody);
    }

    assignRolesToGroup(groupId: string, roleIds: any[]): Observable<any> {
        const requestBody = {
            groupId: groupId,
            roleIds: roleIds
        };
        return this.http.post(this.url2 + '/groups/assignRolesToGroup', requestBody);
    }
    update(operation: any){
        return this.http.put<any[]>("http://localhost:5004/security/v1/orgs", operation);
    }
}
