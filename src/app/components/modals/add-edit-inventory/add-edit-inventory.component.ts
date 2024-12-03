import {Component, Inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MessageService} from "primeng/api";
import {Inventory} from "../../../models/Inventory";
import {TypeOfInventory} from "../../../models/TypeOfInventory";
import {InventoryService} from "../../../core/services/inventory/inventory.service";
import {UserService} from "../../../core/services/user/user.service";
import {User} from "../../../models/User";
import {DocumentService} from "../../../core/services/documents/Document.service";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-telephone-input";
import {InputValue} from "ngx-intl-telephone-input/models/country";
import {DropDownList} from "../../../models/DropDownList";
import {LocationService} from "../../../core/services/location/location.service";
import {FieldMaxLength} from "../../../models/FieldMaxLength";

@Component({
  selector: 'app-add-edit-inventory',
  templateUrl: './add-edit-inventory.component.html',
  styleUrls: ['./add-edit-inventory.component.scss']
})
export class AddEditInventoryComponent {
    file: string = '';
    public hasMarkers : boolean;
    selectedImage: File;
    inventoryForm: FormGroup;
    inventory: Inventory = {id: undefined, name: '', type: null, address: '', products: [], responsableUserId: "" };
    title?: string;
    operation?:string;
    typeOfInventory = Object.values(TypeOfInventory);
    users :User[];
    tvas: number[] = [];
    phoneNumber: InputValue;
    CurrencyList: DropDownList[] = [
        {code:"AFN",text:"Afghanistan Afghanis – AFN"},
        {code:"ALL",text:"Albania Leke – ALL"},
        {code:"DZD",text:"Algeria Dinars – DZD"},
        {code:"ARS",text:"Argentina Pesos – ARS"},
        {code:"AUD",text:"Australia Dollars – AUD"},
        {code:"ATS",text:"Austria Schillings – ATS"},
        {code:"BSD",text:"Bahamas Dollars – BSD"},
        {code:"BHD",text:"Bahrain Dinars – BHD"},
        {code:"BDT",text:"Bangladesh Taka – BDT"},
        {code:"BBD",text:"Barbados Dollars – BBD"},
        {code:"BEF",text:"Belgium Francs – BEF"},
        {code:"BMD",text:"Bermuda Dollars – BMD"},
        {code:"BRL",text:"Brazil Reais – BRL"},
        {code:"BGN",text:"Bulgaria Leva – BGN"},
        {code:"CAD",text:"Canada Dollars – CAD"},
        {code:"XOF",text:"CFA BCEAO Francs – XOF"},
        {code:"XAF",text:"CFA BEAC Francs – XAF"},
        {code:"CLP",text:"Chile Pesos – CLP"},
        {code:"CNY",text:"China Yuan Renminbi – CNY"},
        {code:"COP",text:"Colombia Pesos – COP"},
        {code:"XPF",text:"CFP Francs – XPF"},
        {code:"CRC",text:"Costa Rica Colones – CRC"},
        {code:"HRK",text:"Croatia Kuna – HRK"},
        {code:"CYP",text:"Cyprus Pounds – CYP"},
        {code:"CZK",text:"Czech Republic Koruny – CZK"},
        {code:"DKK",text:"Denmark Kroner – DKK"},
        {code:"DEM",text:"Deutsche (Germany) Marks – DEM"},
        {code:"DOP",text:"Dominican Republic Pesos – DOP"},
        {code:"NLG",text:"Dutch (Netherlands) Guilders - NLG"},
        {code:"XCD",text:"Eastern Caribbean Dollars – XCD"},
        {code:"EGP",text:"Egypt Pounds – EGP"},
        {code:"EEK",text:"Estonia Krooni – EEK"},
        {code:"EUR",text:"Euro – EUR"},
        {code:"FJD",text:"Fiji Dollars – FJD"},
        {code:"FIM",text:"Finland Markkaa – FIM"},
        {code:"FRF",text:"France Francs – FRF"},
        {code:"DEM",text:"Germany Deutsche Marks – DEM"},
        {code:"XAU",text:"Gold Ounces – XAU"},
        {code:"GRD",text:"Greece Drachmae – GRD"},
        {code:"GTQ",text:"Guatemalan Quetzal – GTQ"},
        {code:"NLG",text:"Holland (Netherlands) Guilders – NLG"},
        {code:"HKD",text:"Hong Kong Dollars – HKD"},
        {code:"HUF",text:"Hungary Forint – HUF"},
        {code:"ISK",text:"Iceland Kronur – ISK"},
        {code:"XDR",text:"IMF Special Drawing Right – XDR"},
        {code:"INR",text:"India Rupees – INR"},
        {code:"IDR",text:"Indonesia Rupiahs – IDR"},
        {code:"IRR",text:"Iran Rials – IRR"},
        {code:"IQD",text:"Iraq Dinars – IQD"},
        {code:"IEP",text:"Ireland Pounds – IEP"},
        {code:"ILS",text:"Israel New Shekels – ILS"},
        {code:"ITL",text:"Italy Lire – ITL"},
        {code:"JMD",text:"Jamaica Dollars – JMD"},
        {code:"JPY",text:"Japan Yen – JPY"},
        {code:"JOD",text:"Jordan Dinars – JOD"},
        {code:"KES",text:"Kenya Shillings – KES"},
        {code:"KRW",text:"Korea (South) Won – KRW"},
        {code:"KWD",text:"Kuwait Dinars – KWD"},
        {code:"LBP",text:"Lebanon Pounds – LBP"},
        {code:"LUF",text:"Luxembourg Francs – LUF"},
        {code:"MYR",text:"Malaysia Ringgits – MYR"},
        {code:"MTL",text:"Malta Liri – MTL"},
        {code:"MUR",text:"Mauritius Rupees – MUR"},
        {code:"MXN",text:"Mexico Pesos – MXN"},
        {code:"MAD",text:"Morocco Dirhams – MAD"},
        {code:"NLG",text:"Netherlands Guilders – NLG"},
        {code:"NZD",text:"New Zealand Dollars – NZD"},
        {code:"NOK",text:"Norway Kroner – NOK"},
        {code:"OMR",text:"Oman Rials – OMR"},
        {code:"PKR",text:"Pakistan Rupees – PKR"},
        {code:"XPD",text:"Palladium Ounces – XPD"},
        {code:"PEN",text:"Peru Nuevos Soles – PEN"},
        {code:"PHP",text:"Philippines Pesos – PHP"},
        {code:"XPT",text:"Platinum Ounces – XPT"},
        {code:"PLN",text:"Poland Zlotych – PLN"},
        {code:"PTE",text:"Portugal Escudos – PTE"},
        {code:"QAR",text:"Qatar Riyals – QAR"},
        {code:"RON",text:"Romania New Lei – RON"},
        {code:"ROL",text:"Romania Lei – ROL"},
        {code:"RUB",text:"Russia Rubles – RUB"},
        {code:"SAR",text:"Saudi Arabia Riyals – SAR"},
        {code:"XAG",text:"Silver Ounces – XAG"},
        {code:"SGD",text:"Singapore Dollars – SGD"},
        {code:"SKK",text:"Slovakia Koruny – SKK"},
        {code:"SIT",text:"Slovenia Tolars – SIT"},
        {code:"ZAR",text:"South Africa Rand – ZAR"},
        {code:"KRW",text:"South Korea Won – KRW"},
        {code:"ESP",text:"Spain Pesetas – ESP"},
        {code:"XDR",text:"Special Drawing Rights (IMF) – XDR"},
        {code:"LKR",text:"Sri Lanka Rupees – LKR"},
        {code:"SDD",text:"Sudan Dinars – SDD"},
        {code:"SEK",text:"Sweden Kronor – SEK"},
        {code:"CHF",text:"Switzerland Francs – CHF"},
        {code:"TWD",text:"Taiwan New Dollars – TWD"},
        {code:"THB",text:"Thailand Baht – THB"},
        {code:"TTD",text:"Trinidad and Tobago Dollars – TTD"},
        {code:"TND",text:"Tunisia Dinars – TND"},
        {code:"TRY",text:"Turkey New Lira – TRY"},
        {code:"AED",text:"United Arab Emirates Dirhams – AED"},
        {code:"GBP",text:"United Kingdom Pounds – GBP"},
        {code:"USD",text:"United States Dollars – USD"},
        {code:"VEB",text:"Venezuela Bolivares – VEB"},
        {code:"VND",text:"Vietnam Dong – VND"},
        {code:"ZMK",text:"Zambia Kwacha – ZMK"}]
     showMap: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<AddEditInventoryComponent>,
                private inventoryService:InventoryService,
                private userService:UserService,
                private formBuilder: FormBuilder,
                private messageService:MessageService,
                private locationService:LocationService,
                private documentService:DocumentService) {
        if (this.data == null){
            this.title = $localize`:@@title_add_inventory:Add new inventory`;
            this.operation = $localize`:@@operation_save:Save`;
        }else {
            this.title = $localize`:@@title_update_inventory:Update inventory`;
            this.operation = $localize`:@@operation_update:Update`;
            this.hasMarkers = true;
        }

        if (this.data?.imageUrl){
            this.file = this.data.imageUrl;
        }

        this.inventoryForm = this.formBuilder.group({
                name: new FormControl(this.data?.name, [Validators.required]),
                type: new FormControl(this.data?.type, [Validators.required]),
                address: new FormControl(this.data?.address, [Validators.required]),
                responsible: new FormControl(this.data?.responsableUserId, [Validators.required]),
                taxes: this.buildTaxes(),
                currency: new FormControl(this.data?.currency, [Validators.required]),
                longitude: new FormControl(this.data?.longitude),
                latitude: new FormControl(this.data?.latitude),
                commercialEmailAddress: new FormControl(this.data?.commercialEmailAddress, [Validators.required,Validators.email]),
                registrationNumber: new FormControl(this.data?.registrationNumber, [Validators.required])
            },
        );
        if (data){
            data?.taxes.forEach(e => this.addTaxField(e));
        }else {
            this.addTaxField()
        }
        this.userService.getAll().subscribe((u: any) => {this.users = u.users.flatMap((u: any) => u.user) as User[]});
    }
    onFileChange(event: any) {
        const files = event.target.files as FileList;

        if (files.length > 0) {
            this.selectedImage = files[0];
            const _file = URL.createObjectURL(files[0]);
            this.file = _file;
            this.resetInput();
        }

    }


    onInputChange($event: InputValue) {
        this.phoneNumber = $event;
    }

    resetInput(){
        const input = document.getElementById('avatar-input-file') as HTMLInputElement;
        if(input){
            input.value = "";
        }
    }

    buildTaxes(taxes: string[] = []): FormArray {
        return this.formBuilder.array(
            taxes.map(e => this.formBuilder.control(e, Validators.required))
        );
    }

    get taxes(): FormArray {
        return this.inventoryForm.get('taxes') as FormArray;
    }


    addTaxField(value?: string) {
        this.taxes.push(this.formBuilder.group({
            '0': new FormControl(value, Validators.required)
        }));
    }

    removeTaxField(index: number): void {
        if (this.taxes.length > 1) {
            this.taxes.removeAt(index);
        } else {
            this.taxes.at(0).setValue(null);
        }
    }

    async onSubmit() {
        this.taxes.value.forEach((char) => {this.tvas.push(char[0])});
        this.inventory.name = this.inventoryForm.get('name').value;
        this.inventory.address = this.inventoryForm.get('address').value;
        this.inventory.type = this.inventoryForm.get('type').value;
        this.inventory.responsableUserId = this.inventoryForm.get('responsible').value;
        this.inventory.currency = this.inventoryForm.get('currency').value;
        this.inventory.lat = this.inventoryForm.get('latitude').value;
        this.inventory.lan = this.inventoryForm.get('longitude').value;
        this.inventory.lan = this.inventoryForm.get('longitude').value;
        this.inventory.commercialEmailAddress = this.inventoryForm.get('commercialEmailAddress').value;
        this.inventory.registrationNumber = this.inventoryForm.get('registrationNumber').value;
        this.inventory.taxes = this.tvas;
        if (this.selectedImage != null) {
            await this.documentService.saveFile(this.selectedImage).toPromise().then(e => {this.inventory.imageUrl = e.url});
        }else {this.inventory.imageUrl =this.file;
        }
        if (this.operation === "Save") {
            this.inventory.phone = this.phoneNumber.phoneNumber;
            this.inventoryService.save(this.inventory).subscribe(e => {
                this.dialogRef.close("closed");
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: $localize`Inventory added successfully`
                });
            }, error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail:  error.error.message});
            })
        } else {
            this.inventory.phone = this.data?.phone;
            this.inventory.id = this.data?.id;
            this.inventoryService.update(this.inventory).subscribe(e => {
                this.dialogRef.close("closed");
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: $localize`Inventory edited successfully`
                });
            }, error => {
                this.messageService.add({severity: 'error', summary: 'Error', detail:  error.error.message});
            })
        }

    }

    close() {
        this.dialogRef.close();
    }

    protected readonly PhoneNumberFormat = PhoneNumberFormat;
    protected readonly SearchCountryField = SearchCountryField;
    protected readonly CountryISO = CountryISO;

    selectedLocation($event: any) {
        this.inventory.lat = $event.layer.getLatLng().lat;
        this.inventory.lan = $event.layer.getLatLng().lng;
        this.inventory.radius = 10;
        this.inventory.layerType = $event.layerType;
        this.inventoryForm.get('longitude').setValue($event.layer.getLatLng().lng);
        this.inventoryForm.get('latitude').setValue($event.layer.getLatLng().lat);

        this.locationService.getLocation($event.layer.getLatLng().lng, $event.layer.getLatLng().lat).subscribe(
            e => {
                this.inventoryForm.get("address").setValue(e.features[0].properties.formatted);
                this.showMap = false;
            }
        );
    }

    checkMarkers($event: boolean) {
        this.hasMarkers = $event;
    }

    onDeletedMarkers($event: any) {
        this.inventoryForm.get('longitude').setValue(null);
        this.inventoryForm.get('latitude').setValue(null);
        this.inventoryForm.get('address').setValue(null);
    }

    selectPlace() {
        this.showMap = true;
    }

    protected readonly FieldMaxLength = FieldMaxLength;
}
