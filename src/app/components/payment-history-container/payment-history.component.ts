import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent {
    filterValue = '';
    public refresh: boolean = false;
    @Input() isUserAdmin: boolean =false;
    @Input() userId!: string;
    public selectedTab = 0;

    constructor() {
    }



    filterPredicate: (organization: any, filter: string) => boolean = (organization: any, filter: string): boolean => {
        const keys = ['name'];
        const dataStr = Object.keys(organization as unknown as Record<string, any>).filter(key => keys.includes(key))
            .reduce((currentTerm: string, key: string) => {
                return currentTerm + (organization as unknown as Record<string, any>)[key] + '◬';
            }, '')
            .toLowerCase();
        const transformedFilter = filter.trim().toLowerCase();

        return dataStr.indexOf(transformedFilter) !== -1;
    };

    protected readonly localStorage = localStorage;

    getSelected($event: number) {
        this.selectedTab = $event;
    }
}
