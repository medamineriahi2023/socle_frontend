import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {Router} from "@angular/router";
import {WebsocketService} from "./core/services/websocket.service";
import {NotificationService} from "./core/services/notification.service";
import {MessageService} from "primeng/api";
import {TrackingService} from "./core/services/tracking/tracking.service";
import {TrackingData} from "./models/TrackingData";

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    visible: boolean = false;
    detectedNotification: boolean = false;
    notification: any;
    exist: Object = false;
    constructor(private keycloakService:KeycloakService,
                private webSocketService: WebsocketService,
                private notificationService:NotificationService,
                private trackingService: TrackingService)
    {
    }


    trackLocation(userId: string, userName: string){
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    this.track(position, userId, userName);
                },
                (error) => {
                    console.error('Error getting location:', error);
                },
                { enableHighAccuracy: true, timeout: 100000, maximumAge: 0 }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }


    track(position: GeolocationPosition, userId: string, userName:string) {
        const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };

        let tracking = new TrackingData();
        tracking.lat = currentLocation.lat;
        tracking.lng = currentLocation.lng;
        tracking.userName = userName;
        tracking.userId = userId;
        this.trackingService.save(tracking).subscribe((response) => {
            console.log("Location saved:", response);
        });
    }

    ngOnInit(): void {
        this.keycloakService.loadUserProfile().then(e=> {
            this.trackingService.checkExistence(e.id).subscribe(i => {if (i) {
              setInterval(() => {
                  this.trackLocation(e.id, e.username);
              }, 5000)
            }});
            this.webSocketService.connect("notif/" + e.id, "notif")
            this.notificationService.notificationMessage.subscribe((data) => {
                this.notify(data);
            });
        });




    }

    notify(message: any): void {
        this.detectedNotification = false;
        this.notification = message;
        this.detectedNotification = true;

        setTimeout(()=> {
            this.detectedNotification = false;
        }, 7000);
    }
}
