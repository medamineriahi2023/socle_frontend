import {
    Directive,
    ElementRef,
    HostListener,
    Inject,
    Input,
    LOCALE_ID,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import {FieldMaxLength} from "../../models/FieldMaxLength";
import {NgControl} from "@angular/forms";
import {Subscription} from "rxjs";

@Directive({
    standalone: true,
    selector: '[appMaxLength]'
})
export class MaxLengthDirective  implements OnInit, OnDestroy {
    @Input('appMaxLength') maxLength!: FieldMaxLength;
    counterElement!: HTMLElement;
    private subscription!: Subscription;
    currentLocale: string;


    constructor(private el: ElementRef, private renderer: Renderer2, private ngControl: NgControl,@Inject(LOCALE_ID) public locale: string) {
    }

    ngOnInit() {

        this.counterElement = this.renderer.createElement('span');
        this.renderer.setStyle(this.counterElement, 'font-size', 'small');
        this.renderer.setStyle(this.counterElement, 'position', 'absolute');
        if (this.locale && this.locale === "ar") {
            this.renderer.setStyle(this.counterElement, 'left', '10px');
            this.renderer.setStyle(this.counterElement, 'bottom', '0px');
        }else {
            this.renderer.setStyle(this.counterElement, 'right', '10px');
            this.renderer.setStyle(this.counterElement, 'bottom', '0px');
        }

        this.renderer.appendChild(this.el.nativeElement.parentNode, this.counterElement);

        this.updateCounter();
        if (this.ngControl && this.ngControl.valueChanges) {
            this.subscription = this.ngControl.valueChanges.subscribe(() => this.updateCounter());
        }
    }

    @HostListener('input') onInput() {
        this.updateCounter();
    }

    private updateCounter() {
        const currentLength = this.el.nativeElement.value.length;
        this.renderer.setProperty(this.counterElement, 'innerText', `${currentLength}/${this.maxLength}`);

        if (currentLength > this.maxLength) {
            this.renderer.setStyle(this.counterElement, 'color', 'darkRed');
            this.ngControl.control?.setErrors({ maxLengthExceeded: true });
        } else {
            this.renderer.setStyle(this.counterElement, 'color', 'darkGreen');
            if (this.ngControl.control?.hasError('maxLengthExceeded')) {
                this.ngControl.control?.setErrors(null);
            }
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
