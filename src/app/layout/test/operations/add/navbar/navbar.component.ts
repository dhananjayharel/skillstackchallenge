import { Component } from '@angular/core';
import { FormDataService }     from '../data/formData.service';
@Component ({
    selector: 'msw-navbar'
    ,templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
    public _editMode: boolean;
    public _editId: number;

    constructor( private formDataService: FormDataService) {
        if(this.formDataService.getMode() === 'EDIT') {
            this._editMode = true;
            this._editId = this.formDataService.getEditId();
        } else {
            this._editMode = false;
        }
    }
}
