import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnauthorizedComponent} from "./unauthorized.component";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {Route, RouterModule} from "@angular/router";


const routes: Route[] = [
    {path: '**', component: UnauthorizedComponent},

];
@NgModule({
  declarations: [UnauthorizedComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatButtonModule,
        MatTooltipModule
    ]
})
export class UnauthorizedModule { }
