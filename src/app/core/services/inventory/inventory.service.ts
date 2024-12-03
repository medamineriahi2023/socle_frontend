import { Injectable } from '@angular/core';
import {AbstractServiceService} from "../abstract-service.service";
import {HttpClient} from "@angular/common/http";
import {Inventory} from "../../../models/Inventory";
import {BehaviorSubject, Observable} from "rxjs";
import {SubCategory} from "../../../models/SubCategory";
import {InvoiceData} from "../../../models/InvoiceData";

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends AbstractServiceService<Inventory>{

    constructor(public http:HttpClient) {
        super("http://localhost:9095/inventories" , http);
    }

    private refreshSource = new BehaviorSubject<boolean>(false);
    refresh$= this.refreshSource.asObservable();

    refreshTrigger(){
        this.refreshSource.next(true);
    }


    addProductToAnInventoryByAdmin(quantity: number, productId: number, inventoryId: number): Observable<Inventory>{
        return this.http.put<Inventory>(this.url+ `/add/${productId}/to/${inventoryId}/${quantity}`, {});
    }
    findProductExistenceInventories(productCode: string): Observable<Inventory[]>{
        return this.http.get<Inventory[]>(this.url+ `/find/inventory/by/${productCode}/availability`);
    }
    sellProductsToClients(invoiceData: InvoiceData, inventoryId: number): Observable<Inventory[]>{
            return this.http.put<Inventory[]>(this.url+ `/sell/products/from/${inventoryId}`, invoiceData);
        }


}
