import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaymentHistoryComponent} from "./payment-history.component";
import {SharedModule} from "../../shared/shared.module";
import { PaymentHistoryTableComponent } from './payment-history-table/payment-history-table.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {ToastModule} from "primeng/toast";
import {MatTooltipModule} from "@angular/material/tooltip";
import { CommandHistoryComponent } from './command-history/command-history.component';
import {TabViewModule} from "primeng/tabview";
import {TagModule} from "primeng/tag";
import {UsernamePipe} from "../../core/pipes/username.pipe";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ImageUrlPipe} from "../../core/pipes/imageUrl.pipe";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule} from "@angular/material/core";



@NgModule({
    declarations: [
        PaymentHistoryComponent,
        PaymentHistoryTableComponent,
        CommandHistoryComponent,
    ],
    exports: [
        PaymentHistoryComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatTableModule,
        ToastModule,
        MatTooltipModule,
        TabViewModule,
        TagModule,
        UsernamePipe,
        MatProgressSpinnerModule,
        ImageUrlPipe,
        MatDatepickerModule,
        MatInputModule,
        MatSelectModule,
        MatNativeDateModule
    ]
})
export class PaymentHistoryContainerModule { }
