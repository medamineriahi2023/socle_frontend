import {ChangeDetectorRef, Component} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {CategoriesContainerComponent} from "../../components/categories-container/categories-container.component";
import {Category} from "../../models/Category";
import {ProductContainerComponent} from "../../components/product-container/product-container.component";
import {InventoryContainerComponent} from "../../components/inventory-container/inventory-container.component";
import {TrackingMapComponent} from "../../components/tracking-map/tracking-map.component";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent {
    panels: any[] = [];
    selectedPanel = '';
    comp: any;
    isUserAdmin: boolean = false;
    userId: string;
    protected selectedCategory: Category;


    constructor(
        // private securityUserSandbox: SecurityUserSandbox,
        //         private groupSandbox: GroupSandbox,
        private cdRef: ChangeDetectorRef,
        private keycloak: KeycloakService) {
        this.isUserAdmin = keycloak.getUserRoles().includes("admin");
        keycloak.loadUserProfile().then(e => this.userId = e.id);
    }

    ngOnInit(): void {
        this.panels = [
            {
                id: 'Categories',
                icon: 'heroicons_outline:user-group',
                title: $localize`Categories`,
                description: $localize`Manage your Categories`
            },
            {
                id: 'subCategories',
                icon: 'heroicons_outline:user-group',
                title: $localize`subCategories`,
                description: $localize`Manage your Sub-Categories`
            },
            {
                id: 'Products',
                icon: 'heroicons_outline:lock-closed',
                title: $localize`Products`,
                description: $localize`Manage your Products`
            },
            {
                id: 'Inventories',
                icon: 'heroicons_outline:lock-closed',
                title: $localize`Inventories`,
                description: $localize`Manage your Inventories`
            },
            {
                id: 'Payment History',
                icon: 'heroicons_outline:lock-closed',
                title: $localize`Payment History`,
                description: $localize`Check Payment history`
            },
            {
                id: 'Track Delivery',
                icon: 'heroicons_outline:lock-closed',
                title: "Track Delivery",
                description: `Track your dilevery`
            }
        ];
    }

    // show component
    detectComp(comp: any): void {
        if (comp === 'Categories') {
            this.comp = CategoriesContainerComponent;
        }
        if (comp === 'subCategories') {
            this.comp = CategoriesContainerComponent;
        }
        if (comp === 'Products') {
            this.comp = ProductContainerComponent;
        }
        if (comp === 'Inventories') {
            this.comp = InventoryContainerComponent;
        }
        if (comp === 'Track Delivery') {
            this.comp = TrackingMapComponent;
        }
        this.selectedPanel = comp;
    }

    changeSelectedPanel($event: any) {
            this.selectedPanel="subCategories";
            this.selectedCategory = $event;
    }
}
