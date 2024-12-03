import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, fromEvent} from "rxjs";

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements AfterViewInit{
    @Input() filterValue = '';
    @ViewChild('inputFilter') inputFilter: ElementRef;
    @Output() filterChange = new EventEmitter<any>();



    initialiseFilter() {
        fromEvent(this.inputFilter.nativeElement, 'keyup')
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
            )
            .subscribe(value => {
                this.filterValue = this.inputFilter.nativeElement.value;
                this.filterChange.emit(this.filterValue);
            });
    }

    ngAfterViewInit(): void {

        this.initialiseFilter();

    }
}
