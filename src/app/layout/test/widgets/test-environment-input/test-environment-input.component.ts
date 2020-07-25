import { Component, OnInit, Input, NgZone, forwardRef    } from '@angular/core';
import { AlertService, EnvironmentService } from '../../../../shared';
import { Environment } from '../../../../../models/environments.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const UI_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TestEnvironmentInputComponent),
    multi: true
};

const UI_FORM_VALIDATION: any = {
	provide: NG_VALIDATORS,
	useExisting: forwardRef(() => TestEnvironmentInputComponent),
	multi: true,
};

const noop = () => {
};

@Component({
    selector: 'app-test-environment-input',
    templateUrl: './test-environment-input.component.html',
		styleUrls: ['./test-environment-input.component.scss'],
		providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR]
})
export class TestEnvironmentInputComponent implements OnInit, ControlValueAccessor    {
	private environments: Environment[];
	public loading = false;
	public queryString: string;
	private onTouchedCallback: () => void = noop;
	private onChangeCallback: (_: any) => void = noop;
	private _envId: number;


	constructor (private zone: NgZone,
		private alertService: AlertService,
		private environmentService: EnvironmentService) {

	}

	ngOnInit() {
		this.fetchEnvironmentList();
	}



	// get accessor
	get value(): any {
		return this._envId;
	};

	// set accessor including call the onchange callback
	set value(v: any) {
		if (v !== this._envId) {
			this._envId = v;
			this.zone.run(() => {
				this.onChangeCallback(v);
			});
			
		}
	}
	// From ControlValueAccessor interface
	writeValue(value: any) {
		if (value!= null && value !== this._envId) {
			this._envId = value;
			this.zone.run(() => {
				this.onChangeCallback(value);
			});
		}
	}

	registerOnChange(fn: any) {
		this.onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouchedCallback = fn;
	}
	

	fetchEnvironmentList(filter=null) {
				this.loading = true;
				this.environmentService.getAll({"where":{"or":[{"isGlobal":true},{"uid": this.getCurrentUserId().userId}]}})
				.subscribe(
					data => {
						this.environments = data;
						this.loading = false;
						console.log(data);
					},
					error => {
						const err = JSON.parse(error._body);
						this.alertService.error(err.error.message);
						this.loading = false;
					});
        }

	returnSanitizedDescription(index){
		const sanitizedStr = this.environments[index].description.replace(/<(?:.|\n)*?>/gm, '')
		if (sanitizedStr.length > 30) {
		    return sanitizedStr.replace(/\r?\n|\r/g, '').replace(/^(.{30}[^\s]*).*/, "$1").replace(/&nbsp;/gi," ") + '...'; 
		} else {
		    return sanitizedStr;
		}
	}

	onEnvironmentClick(_id) {
		this._envId = _id;
	}
	
	getCurrentUserId () {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

}
