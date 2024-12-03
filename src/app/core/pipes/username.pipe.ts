import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from "../services/user/user.service";

@Pipe({
    standalone: true,
    name: 'username'
})
export class UsernamePipe implements PipeTransform {

    constructor(private userManagementService: UserService) { }

    transform(userId: string): Observable<string> {
        return this.userManagementService.getUserById(userId).pipe(
            map((user: any) => user["users"][0].user.userName)
        );
    }
}
