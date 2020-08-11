import { Component, OnInit, Input }   from '@angular/core';
import { FormDataService } from './data/formData.service';
import { WorkflowService } from './workflow/workflow.service';
import { ScriptService } from './../../../../shared';

@Component ({
    selector:     'multi-step-wizard-app'
    ,templateUrl: './add.component.html'
})

export class AddComponent implements OnInit {
    title = 'Multi-Step Wizard';
    @Input() formData;
    public heading: string;

    constructor(private formDataService: FormDataService,
      private workFlowService: WorkflowService,
      private script: ScriptService) {
    }

    ngOnInit() {
        this.script.load('tinymce', 'tinymcetheme').then(data => {
            console.log('script loaded ', data);
            this.bootScreen();
        }).catch(error => console.log(error));

    }

    bootScreen() {
        this.formData = this.formDataService.getFormData();

        if (this.formDataService.getMode() === 'EDIT') {
            this.heading = 'Edit Challenge: ';
            this.formDataService.editTest$.subscribe(
                data => {
                    console.log(data);
                    const basicData = this.formDataService.getBasicData();
                    this.heading = 'Edit Challenge: ' + basicData.name;
                }
            );

        } else {
            this.heading = 'Add Challenge';
        }
    }
}