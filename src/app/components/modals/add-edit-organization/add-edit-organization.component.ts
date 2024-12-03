import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OrganizationService} from "../../../core/services/organization/organization.service";
import {MessageService} from "primeng/api";
import {LocationService} from "../../../core/services/location/location.service";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
  selector: 'app-add-edit-organization',
  templateUrl: './add-edit-organization.component.html',
  styleUrls: ['./add-edit-organization.component.scss']
})
export class AddEditOrganizationComponent {
    title?: string;
    orgForm: FormGroup;
    public operation: string;
    organization: any = {id: undefined, name: '', displayName: '', realm: 'oga', lat: null , lan: null , radius: null, type: null, address: null};
    public hasMarkers : boolean;
    constructor(        @Inject(MAT_DIALOG_DATA) public data: any,
                        public dialogRef: MatDialogRef<AddEditOrganizationComponent>,
                        private organisationService:OrganizationService,
                        private messageService:MessageService,
                        private locationService:LocationService
    ) {
        if (this.data?.org == null){
            this.title = $localize`Add new organization`;
            this.operation = "Save"
        }else {
            this.title = $localize`Update organization`;
            this.operation = "Update";
            this.hasMarkers = true;
        }

        this.orgForm = new FormGroup({
            name: new FormControl(this.data?.org?.name, [Validators.required]),
            displayName: new FormControl(this.data?.org?.displayName),
            longitude: new FormControl(this.data?.org?.lan, [Validators.required]),
            latitude: new FormControl(this.data?.org?.lat, [Validators.required]),
            address: new FormControl(this.data?.org?.address, [Validators.required]),
        });

    }

    close() {
        this.dialogRef.close();
    }

    onSubmit() {
        this.organization.name = this.orgForm.get('name').value;
        this.organization.displayName = this.orgForm.get('displayName').value;
        this.organization.lan = this.orgForm.get('longitude').value;
        this.organization.lat = this.orgForm.get('latitude').value;
        this.organization.lat = this.orgForm.get('latitude').value;
        this.organization.address = this.orgForm.get('address').value;
        if (this.operation == 'Save'){
            this.organisationService.save(this.organization).subscribe(u => {this.messageService.add({ severity: 'success', summary: 'Success', detail: $localize`Organization added successfully` });this.dialogRef.close(true)},
        error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: $localize`Organization not added` });});
        }else {
        this.organization.id = this.data?.org?.id;
            this.organisationService.update(this.organization).subscribe(u => {this.messageService.add({ severity: 'success', summary: 'Success', detail: $localize`Organization updated successfully` });this.dialogRef.close(true)},
                error => {this.messageService.add({ severity: 'error', summary: 'Error', detail: $localize`Organization not updated` });});

        }

    }

    selectedLocation($event: any) {
      this.organization.lat=$event.layer.getLatLng().lat;
      this.organization.lan=$event.layer.getLatLng().lng;
      this.organization.radius = 10;
      this.organization.type = $event.layerType;
      this.orgForm.get('longitude').setValue($event.layer.getLatLng().lng);
      this.orgForm.get('latitude').setValue($event.layer.getLatLng().lat);
        this.locationService.getLocation($event.layer.getLatLng().lng,$event.layer.getLatLng().lat).subscribe(
            e=> this.orgForm.get("address").setValue(e.features[0].properties.formatted)
        )
    }

    checkMarkers($event: boolean) {
        this.hasMarkers = $event;

    }

    onDeletedMarkers($event: any) {
        this.orgForm.get('longitude').setValue(null);
        this.orgForm.get('latitude').setValue(null);
        this.orgForm.get('address').setValue(null);
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}

