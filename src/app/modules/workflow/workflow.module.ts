import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowComponent } from './workflow.component';
import {Route, RouterModule} from "@angular/router";


const routes: Route[] = [
    {path: '**', component: WorkflowComponent },

];
@NgModule({
  declarations: [
    WorkflowComponent
  ],
  imports: [
    CommonModule,
      RouterModule.forChild(routes),

  ]
})
export class WorkflowModule { }
