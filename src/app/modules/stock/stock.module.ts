import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StockComponent} from './stock.component';
import {GroupContainerModule} from "../../components/group-container/group-container.module";
import {MatIconModule} from "@angular/material/icon";
import {OrganizationContainerModule} from "../../components/organization-container/organization-container.module";
import {RoleContainerModule} from "../../components/role-container/role-container.module";
import {SharedModule} from "../../shared/shared.module";
import {UserContainerModule} from "../../components/user-container/user-container.module";
import {Route, RouterModule} from "@angular/router";
import {CategoriesContainerModule} from "../../components/categories-container/categories-container.module";
import {SubCategoryContainerModule} from "../../components/sub-category-container/sub-category-container.module";
import {ProductContainerModule} from "../../components/product-container/product-container.module";
import {InventoryContainerModule} from "../../components/inventory-container/inventory-container.module";
import {
    PaymentHistoryContainerModule
} from "../../components/payment-history-container/payment-history-container.module";
import {TrackingMapModule} from "../../components/tracking-map/tracking-map.module";

const stock: Route[] = [
    {path: '**', component: StockComponent},

];

@NgModule({
    declarations: [
        StockComponent
    ],
    imports: [
        RouterModule.forChild(stock),
        CommonModule,
        GroupContainerModule,
        MatIconModule,
        OrganizationContainerModule,
        RoleContainerModule,
        SharedModule,
        UserContainerModule,
        CategoriesContainerModule,
        SubCategoryContainerModule,
        ProductContainerModule,
        InventoryContainerModule,
        PaymentHistoryContainerModule,
        TrackingMapModule
    ]
})
export class StockModule { }
