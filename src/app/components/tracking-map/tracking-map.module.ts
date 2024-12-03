import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrackingMapComponent} from "./tracking-map.component";



@NgModule({
    declarations: [
        TrackingMapComponent,
    ],
    exports: [
        TrackingMapComponent
    ],
    imports: [
        CommonModule
    ]
})
export class TrackingMapModule { }
