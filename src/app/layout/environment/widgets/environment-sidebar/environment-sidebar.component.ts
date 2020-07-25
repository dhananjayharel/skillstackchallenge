import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Environment } from 'models';
import {SharedenvironmentactionsService } from '../../sharedenvironmentactions.service';

@Component({
  selector: 'app-env-sidebar',
  templateUrl: './environment-sidebar.component.html',
  styleUrls: ['./environment-sidebar.component.scss']
})
export class EnvironmentSidebarComponent implements OnInit {
  @Input() environments: any[];
  @Output() onEnvironmentSelect: EventEmitter<string> = new EventEmitter();
  private selectedItem = 0;

  constructor(private _sharedService: SharedenvironmentactionsService) { }

  ngOnInit() {
  }

  returnSanitizedDescription(index){
      const sanitizedStr = this.environments[index].description.replace(/<(?:.|\n)*?>/gm, '')
      if (sanitizedStr.length > 90) {
          return sanitizedStr.replace(/\r?\n|\r/g, '').replace(/^(.{30}[^\s]*).*/, "$1").replace(/&nbsp;/gi," ") + '...'; 
      } else {
          return sanitizedStr;
      }
  }

  onEnvironmentClick(index) {
    this.selectedItem = index;
    this._sharedService.showActiveEnvironment(this.environments[index]);
  }

}
