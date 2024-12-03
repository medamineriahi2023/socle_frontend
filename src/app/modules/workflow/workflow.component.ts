import { Component, ElementRef, OnInit } from '@angular/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import * as $ from 'jquery';
import newDiagram from '!!raw-loader!../../../assets/newDiagram.bpmn';

@Component({
    selector: 'app-workflow',
    templateUrl: './workflow.component.html',
    styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {
    private modeler: BpmnModeler;

    constructor(private elRef: ElementRef) {}

    ngOnInit(): void {
        this.modeler = new BpmnModeler({
            container: this.elRef.nativeElement.querySelector('#js-canvas'),
            keyboard: { bindTo: window }
        });

        this.registerFileDrop();
        $('#js-create-diagram').on('click', (e) => {
            e.preventDefault();
            this.createNewDiagram();
        });
        this.modeler.on('commandStack.changed', () => this.updateDownloadLink());
    }

    async createNewDiagram() {
        await this.openDiagram(newDiagram);
    }

    async openDiagram(xml: string) {
        try {
            await this.modeler.importXML(xml);
            $('#js-drop-zone').removeClass('with-error').addClass('with-diagram');

            this.updateDownloadLink();
        } catch (err) {
            $('#js-drop-zone').removeClass('with-diagram').addClass('with-error');
            console.error(err);
        }
    }

    private registerFileDrop() {
        const container = $(this.elRef.nativeElement.querySelector('#js-drop-zone'));

        container.on('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.originalEvent.dataTransfer.dropEffect = 'copy';
        });

        container.on('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const file = e.originalEvent.dataTransfer.files[0];
            const reader = new FileReader();

            reader.onload = (evt) => {
                const xml = evt.target.result as string;
                this.openDiagram(xml);
            };

            reader.readAsText(file);
        });
    }

    private async updateDownloadLink() {
        try {
            const { xml } = await this.modeler.saveXML({ format: true });
            const encodedXml = encodeURIComponent(xml);
            $('#js-download-diagram')
                .addClass('active')
                .attr({
                    href: 'data:application/bpmn20-xml;charset=UTF-8,' + encodedXml,
                    download: 'diagram.bpmn'
                });
        } catch (err) {
            console.error('Error updating download link', err);
        }
    }
}
