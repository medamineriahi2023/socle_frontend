import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-code-bar-scanner',
  templateUrl: './code-bar-scanner.component.html',
  styleUrls: ['./code-bar-scanner.component.scss']
})
export class CodeBarScannerComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<CodeBarScannerComponent>,) {
    }
    displayButton:boolean = false;
    value: string;
    isError = false;
    barCode: any;
    @Input() closable: boolean = true;
    @Output() detectedValue = new EventEmitter<any>();
    ngOnInit(): void {

    }
    onError(error: any) {
        console.error(error);
        this.isError = true;
    }
    playAudio(){
        let audio = new Audio();
        audio.src = "../../../../assets/audio/audio.mp3";
        audio.load();
        audio.play();
    }

    onValueChange($event: any) {
        this.playAudio();
        if (this.closable){
            this.dialogRef.close($event);
        }else {
            this.detectedValue.emit($event);
        }

    }

    barCodeChanged($event: any) {
        const isEnterKey = $event instanceof KeyboardEvent && $event.key === 'Enter';
        if (isEnterKey) {
            this.playAudio();
            if (this.closable){
            // @ts-ignore
                this.dialogRef.close($event.target.value);
            }else {
                // @ts-ignore
                this.detectedValue.emit($event.target.value);
            }
        }
    }

    handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.barCodeChanged(event);
        }
    }
}
