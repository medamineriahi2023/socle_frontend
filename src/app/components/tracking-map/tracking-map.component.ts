import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {TrackingService} from "../../core/services/tracking/tracking.service";
import {TrackingData} from "../../models/TrackingData";
import {FormBuilder, FormGroup} from "@angular/forms";
import {InventoryService} from "../../core/services/inventory/inventory.service";
import {Inventory} from "../../models/Inventory";
import {UserService} from "../../core/services/user/user.service";
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrls: ['./tracking-map.component.scss']
})
export class TrackingMapComponent implements AfterViewInit,OnInit, OnDestroy {
    form: FormGroup;
    map: any;
    polylines: { [key: string]: any } = {};
    markers: { [key: string]: any[] } = {};
    history: { lat: number; lng: number }[] = [];
    currentMarker: any;
    username: string;
    showMap: boolean = false;
    polyline: any;
    trackingInterval: any;
    inventories: Inventory[];

    constructor(private fb: FormBuilder,
                private trackingService: TrackingService,
                private inventoryService: InventoryService,
                private userService: UserService) {}

    ngOnInit(): void {
        this.inventoryService.getAll().subscribe((inventories: Inventory[]) => {
            this.inventories = inventories;
            this.addInventoryMarkers();
        });
    }
    addInventoryMarkers() {
        this.inventories.forEach((inventory) => {
            if (inventory.lat && inventory.lan) {
                const latLng = [parseFloat(inventory.lat), parseFloat(inventory.lan)];
                const customIcon = this.createCustomIcon(inventory.imageUrl);
                const marker = L.marker(latLng, { icon: customIcon }).addTo(this.map);
                marker.bindPopup(`<strong>${inventory.name}</strong><br>${inventory.address}`);
                this.markers[inventory.id] = marker;
            }
        });
    }

    createCustomIcon(imageUrl: string) {
        return L.divIcon({
            html: `<div style="background-image: url(${imageUrl});
                             width: 28px;
                             height: 28px;
                             background-size: cover;
                             border-radius: 50%;
                             border: 2px solid #fff;"></div>`,
            className: 'custom-marker',  // Optional CSS class for further styling
            iconSize: [20, 20],  // Size of the custom marker
            iconAnchor: [20, 20],  // Point where the marker is anchored
            popupAnchor: [0, -40],  // Point where the popup is anchored relative to the icon
        });
    }
    ngOnDestroy(): void {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
        }
    }


    ngAfterViewInit() {
        this.initializeMap();
        this.loadTrackingData();

        this.trackingInterval = setInterval(() => {
            this.loadTrackingData();
        }, 5000);
    }

    initializeMap() {
        this.map = L.map('map', {
            zoom: 1,
        }).setView([36.256565555,10.152255 ], 7);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            minZoom: 1,
        }).addTo(this.map);
        this.polyline = L.polyline([], { color: 'blue' }).addTo(this.map);
    }

    loadTrackingData() {
        this.trackingService.getAll().subscribe((data: TrackingData[]) => {
            const groupedData = this.groupByUserName(data);
            for (const userName in groupedData) {
                const userData = groupedData[userName];
                this.plotUserData(userName, userData, userData[0].userId);
            }
        });
    }

    groupByUserName(data: TrackingData[]): { [key: string]: TrackingData[] } {
        return data.reduce((acc, curr) => {
            if (!acc[curr.userName]) {
                acc[curr.userName] = [];
            }
            acc[curr.userName].push(curr);
            return acc;
        }, {});
    }

    plotUserData(userName: string, data: TrackingData[], userId: string) {
        if (this.markers[userName]) {
            this.markers[userName].forEach(marker => {
                this.map.removeLayer(marker);
            });
        }

        // Get the last data point (current location)
        const latestPosition = data[data.length - 1];

        if (latestPosition) {
            const currentLocation = [latestPosition.lat, latestPosition.lng];

            const randomColor = this.getRandomColor();

            if (this.polylines[userName]) {
                this.polylines[userName].setLatLngs(data.map((d) => [d.lat, d.lng]));
            } else {
                this.polylines[userName] = L.polyline(data.map((d) => [d.lat, d.lng]), { color: randomColor }).addTo(this.map);
            }

            this.getUserIcon(userId).subscribe(userIcon => {
                const marker = L.marker(currentLocation, { icon: userIcon }).addTo(this.map);
                marker.bindPopup(userName);
                this.markers[userName] = [marker];
            });


        }
    }


    // Function to generate a random color
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    getUserIcon(userId: string) {
        return this.userService.getUserImageUrlByUserId(userId).pipe(
            map((imageUrl: string) => {
                return L.divIcon({
                    html: `
                    <div class="relative">
                        <div class="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-25"></div>
                        <img src="${imageUrl}" class="rounded-full w-10 h-10 border-2 border-white" />
                    </div>
                `,
                    className: '',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40],
                });
            })
        );
    }



}
