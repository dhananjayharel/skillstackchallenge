import { Component, OnInit } from '@angular/core';
import {SharedtestactionsService } from '../../sharedtestactions.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
declare var require: any;

@Component({
  selector: 'app-test-filter',
  templateUrl: './test-filter.component.html',
  styleUrls: ['./test-filter.component.scss']
})
export class TestFilterComponent implements OnInit {
  private closeResult: string;
  private modalReference: any;
  public keyText = 'created';
  public orderText = 'DESC';
  public categoryInput = null;
  public isMobile = /Android|iPhone/i.test(window.navigator.userAgent)
  public filter = {
    where: {
      category: null,
    },
    order: '',
  };
  public categoryData = [
    {name: 'php', value: 'PHP'},
    {name: 'java', value: 'Java'}
  ];

  public keyFilter = [
    {name: 'Date', value: 'created'},
    {name: 'Name', value: 'name'}
  ];

  public orderFilter = [
    {name: 'Asc', value: 'ASC'},
    {name: 'Desc', value: 'DESC'}
  ];

  constructor(private _sharedService:SharedtestactionsService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
    const languageOptions = require('../../../../shared/static/language.json');
    this.categoryData = languageOptions.map(item => {
      return {
        name: item.label,
        value: item.value
      };
    });
  }

  updateFilterData($event) {
    console.log($event);

    if ($event['order']) {
      this.orderText = $event['order'];
    } else if ($event['filter']) {
      this.keyText = $event['filter'];
    } else if ($event['category']) {
      this.filter.where.category = $event['category'];
    }  else if ($event['category'] === null) {
      this.filter.where.category = '';
    }

    if (this.keyText && this.orderText) {
      this.filter.order = this.keyText + ' ' + this.orderText;
    }
    console.log(this.filter);

    this._sharedService.setTestFilter(this.filter);
  }

  openModal(content) {
    const options: NgbModalOptions = {
      size: 'sm'
    };
    this.modalReference = this.modalService.open(content, options);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  public goTo(mode) {
    if (mode === 'CREATE_NEW') {
      this.router.navigate(['/challenge/add']);
    } else {
      this.router.navigate(['/challenge/clone']);
    }
    this.modalReference.close();
  }

}
