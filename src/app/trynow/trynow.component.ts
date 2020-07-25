import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'app-trynow',
    templateUrl: './trynow.component.html',
    styleUrls: ['trynow.component.scss']
})
export class TryNowComponent implements OnInit {
  @ViewChild('testQuestionModal') testQuestionModal: any;
  public testStarted = false;
  public status = 'INITIAL';
  public clock: any;
  public hoursSpan: any;
  public minutesSpan: any;
  public secondsSpan: any;
  public endtime: any;
  public timeinterval: any;
  private closeResult: string;
  private modalReference: any;
  constructor( private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private titleService: Title) {
      this.titleService.setTitle( 'SkillStack Demo Coding Test - Simulation' );
    }

  ngOnInit() {
    console.log('ng Init called.');
    setTimeout(() => {
      this.startCountDown();
    }, 1000);
  }

  openModal(content) {
    let ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false,
    };
    this.modalReference = this.modalService.open(content, ngbModalOptions);
    this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
         setTimeout(function () {
            document.getElementById('testWindow').focus();
        }, 500);
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

  viewQuestion(){
    this.openModal(this.testQuestionModal);
    setTimeout(function () {
            document.getElementById('testWindow').focus();
        }, 5000);
  }

  backToHomePage() {
    window.location.href = 'https://www.skillstack.com';
  }
  startCountDown() {
    this.testStarted = true;
    this.status = 'STARTED';
    const deadline = new Date(new Date().getTime() +  10 * 60 * 1000);
    this.initializeClock('clockdiv', deadline);
    const app = document.getElementById('chromeapp');
    app.style.top = '0px';
    setTimeout(() => {
      this.viewQuestion();
    }, 4000);
  }

  stopTestCountdown () {
    clearInterval(this.timeinterval);
    this.status = 'FINISHED';
    // window.location.href = 'https://www.skillstack.com';
  }

  triggerClose() {
    const r = confirm('Submit Test - Are You Sure?');
    if (r === true) {
      this.stopTestCountdown();
      // this.mode = 'result';
    }
  }

   getTimeRemaining(endtime) {
    const t: number = Date.parse(endtime) - new Date().getTime();
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
  }

  initializeClock(id, endtime) {
    this.clock = document.getElementById(id);
    this.hoursSpan = this.clock.querySelector('.hours');
    this.minutesSpan = this.clock.querySelector('.minutes');
    this.secondsSpan = this.clock.querySelector('.seconds');
    this.endtime = endtime;
    this.updateClock();
      this.timeinterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  updateClock() {
    const t = this.getTimeRemaining(this.endtime);

    this.hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    this.minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    this.secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      this.stopTestCountdown();
    }

    // hack added to set the iframe focused every sec
    try {
        document.getElementById('testWindow').focus();
    } catch (e) { console.log(e); }
  }

}
