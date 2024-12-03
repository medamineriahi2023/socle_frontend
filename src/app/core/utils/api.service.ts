import {Injectable} from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private messageService: MessageService) { }

    handleApiResponse(response: any, successMessage: string): void {
        if (response.error_security === null) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: successMessage });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response?.error_security?.http_body });
        }
    }
}
