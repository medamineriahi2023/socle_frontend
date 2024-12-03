import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import * as L from 'leaflet';
import "leaflet-draw/dist/leaflet.draw.js";

@Component({
    selector: 'map-component',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
    private map: L.DrawMap;
    private drawControl: L.Control.Draw;
    private drawItems: L.FeatureGroup = L.featureGroup(); // Initialize drawItems
    private currentMarker: L.Marker | null = null; // Reference to the current marker
    public drawMode: boolean = false;
    public currentColor: string = "blue";

    public currentLayerType: string;
    public currentObject: L.Draw.Feature;
    @Input() latitude!: number;
    @Input() longitude!: number;
    @Input() organization!: any;

    public lat = this.organization?.lat;
    public lng = this.organization?.lan;
    public radius = this.organization?.radius;
    @Output() selectedLocaltion = new EventEmitter<any>();
    @Output() hasNoMarkers = new EventEmitter<boolean>();
    @Output() deletedMarker = new EventEmitter<any>();

    ngOnInit(): void {
        this.initializeMap();
        this.addInitialMarkerOrCircle();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.latitude || changes.longitude) {
            this.updateMarkerPosition();
        }
    }

    private initializeMap(): void {
        if (!this.organization) {
            this.map = L.map("map").setView([36.79718920417815, 10.18638610839844], 12);
        } else {
            this.map = L.map("map").setView([this.organization.lat, this.organization.lan], 12);
        }

        const osmTile = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });
        const googleTile = L.tileLayer(
            "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            {
                attribution: '&copy; <a href="https://www.google.com/intl/ru_RU/help/terms_maps.html">Google</a>',
                subdomains: ["mt0", "mt1", "mt2", "mt3"]
            }
        );

        this.map.addLayer(osmTile);
        L.control
            .layers(
                {
                    osm: osmTile,
                    google: googleTile
                },
                { drawLayer: this.drawItems }
            )
            .addTo(this.map);

        this.map.zoomControl.setPosition("topleft");

        this.addDrawControl(true);

        this.map.on(L.Draw.Event.CREATED, (event) => {
            this.selectedLocaltion.emit(event);
            this.drawItems.addLayer(event.layer);
            this.hasNoMarkers.emit(this.hasSingleMarkerOrCircle());
            this.updateDrawControl();
        });

        this.map.on(L.Draw.Event.DELETED, (event) => {
            this.hasNoMarkers.emit(this.hasSingleMarkerOrCircle());
            this.deletedMarker.emit(event);
            this.updateDrawControl();
        });

        this.drawItems.addTo(this.map); // Add drawItems to the map
    }

    private addDrawControl(allowMarker: boolean): void {
        const options: L.Control.DrawConstructorOptions = {
            edit: {
                featureGroup: this.drawItems,
                edit: {
                    selectedPathOptions: {
                        color: "#000",
                        fillColor: "#000"
                    }
                }
            },
            draw: {
                marker: allowMarker, // Set marker drawing based on allowMarker
                circle: allowMarker, // Allow circle drawing
                polyline: false, // Disable other drawing tools
                polygon: false,
                rectangle: false,
                circlemarker: false
            }
        };

        this.drawControl = new L.Control.Draw(options);
        this.map.addControl(this.drawControl);
    }

    private updateDrawControl(): void {
        const hasMarker = this.hasSingleMarkerOrCircle();
        this.map.removeControl(this.drawControl);
        this.addDrawControl(!hasMarker);
    }

    private addInitialMarkerOrCircle(): void {
        if (this.organization) {
            if (this.organization.type === "circle") {
                const circle = L.circleMarker([this.organization.lat, this.organization.lan], { radius: this.organization.radius }).addTo(this.map);
                this.drawItems.addLayer(circle);
            } else {
                const marker = L.marker([this.organization.lat, this.organization.lan]).addTo(this.map);
                this.drawItems.addLayer(marker);
                this.currentMarker = marker;
            }
            this.updateDrawControl();
        }
    }
    private testNumber(input) {
        const regex = /^-?\d{1,2}\.\d+$/;
        return regex.test(input);
    }

    private updateMarkerPosition(): void {
        if (this.latitude && this.longitude) {
            if (this.currentMarker) {
                // Move the existing marker
                this.currentMarker.setLatLng([this.latitude, this.longitude]);
            } else if (this.testNumber(this.latitude) && this.testNumber(this.longitude)) {
                this.currentMarker = L.marker([this.latitude, this.longitude]).addTo(this.map);
                this.drawItems.addLayer(this.currentMarker); // Add the new marker to drawItems
            }

            // Center the map on the new position
            this.map.setView([this.latitude, this.longitude], 12);

            // Update the draw control
            this.updateDrawControl();
        }
    }

    public hasSingleMarkerOrCircle(): boolean {
        let markerCount = 0;
        let circleCount = 0;

        this.drawItems.eachLayer((layer: L.Layer) => {
            if (layer instanceof L.Marker) {
                markerCount++;
            } else if (layer instanceof L.CircleMarker) {
                circleCount++;
            }
        });

        return markerCount > 0 || circleCount > 0;
    }

    public onColorSelect(color: string) {
        this.currentColor = color;
    }

    public onPointCreate(point: L.LatLng) {}

    public onPointEdit(point: L.LatLng) {}
}
