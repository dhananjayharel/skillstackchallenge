import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from '../../shared/services/index';

@Injectable()
export class IsBuisnessEmailValidator {
 
  debouncer: any;

  constructor(public authProvider: AuthenticationService){
 
  }
 
  checkEmail(control: FormControl): any {
 
    clearTimeout(this.debouncer);
 
    return new Promise(resolve => {
 
      this.debouncer = setTimeout(() => {
 
        this.authProvider.validateEmail(control.value).subscribe((res) => {
          if(res.format_valid && !res.free){
            resolve(null);
          } else {
            resolve({'isBuisnessEmail': false});
          }
        }, (err) => {
          resolve({'isBuisnessEmail': false});
        });
 
      }, 1000);     
 
    });
  }
 
}
