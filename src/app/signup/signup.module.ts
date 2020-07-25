import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpModule, Http} from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ValidatorModule } from '../shared/validators/validator.module';
import { UserService, EnvironmentService,AuthenticationService } from '../shared/';
import {LogoModule} from '../shared/components/logo/logo.module';

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, '/assets/i18n/en.json');
}

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        }),
    LogoModule,
    ValidatorModule
  ],
  declarations: [
    SignupComponent
    ],
  providers:[
    UserService,
    EnvironmentService,
	AuthenticationService
  ]
})
export class SignupModule { }
