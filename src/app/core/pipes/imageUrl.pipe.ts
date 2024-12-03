import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {UserService} from "../services/user/user.service";

@Pipe({
    standalone: true,
    name: 'imageUrl'
})
export class ImageUrlPipe implements PipeTransform {

    constructor(private userManagementService: UserService) { }

    transform(userId: string): Observable<string> {
        return this.userManagementService.getUserImageUrlByUserId(userId);
    }
}
