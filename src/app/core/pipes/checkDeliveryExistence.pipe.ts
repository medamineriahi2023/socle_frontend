import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from "../services/user/user.service";
import {TrackingService} from "../services/tracking/tracking.service";

@Pipe({
    standalone: true,
    name: 'deliveryExistence'
})
export class CheckDeliveryExistencePipe implements PipeTransform {

    constructor(private trackingService: TrackingService) { }

    transform(userId: string): Observable<string> {
        return this.trackingService.checkExistence(userId).pipe(
            map((isItExist: any) => isItExist)
        );
    }
}
