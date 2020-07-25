import {
    Component,
    OnInit
} from '@angular/core';
import {
    Router
} from '@angular/router';

import {
    Personal
} from '../../data/formData.model';
import {
    FormDataService
} from '../../data/formData.service';

@Component({
    selector: 'mt-wizard-welcome',
    templateUrl: './welcome.component.html'
})

export class WelcomeComponent implements OnInit {
    title = 'Please tell us about yourself.';
    personal: Personal;
    form: any;

    constructor(private router: Router, private formDataService: FormDataService) {}

    ngOnInit() {
        this.personal = this.formDataService.getPersonal();
    }

    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }
        this.formDataService.setPersonal(this.personal);
        return true;
    }

    goToNext(form: any) {
        if (this.save(form)) {
            this.router.navigate(['/mcqtest']);
        }
    }
}
