import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Candidate } from 'models';
import { CandidateService, AlertService } from '../../../../shared';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-latestcandidate',
  templateUrl: './latestcandidate.component.html',
  styleUrls: ['./latestcandidate.component.scss']
})
export class LatestcandidateComponent implements OnInit {
  public candidates: Candidate[];
  public awaitedCandidates = [];
  private currentCandidate: Candidate;
  private closeResult: string;
  @Input() showCount = 5;
  @ViewChild('evaluateMarksModal') evaluateModal: any;

  constructor(private _candidateService: CandidateService,
              private router: Router,
              private alertService: AlertService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.bootWidget();
  }

  bootWidget () {
    this.awaitedCandidates = [];
    this.candidates = [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const filter = { 'where': { 'uid': currentUser.userId } };
    this._candidateService.getAll(filter)
    .subscribe((data) => {
      if (data.length > this.showCount) {
        this.candidates = data.slice(0, this.showCount);
      } else {
        this.candidates = data;
      }
      this.prepareAwaitedCandidateList(data);
    });
  }

  prepareAwaitedCandidateList(_data) {
    for (const candidate of _data) {
      if (candidate.status === 'completed' || candidate.status === 'waiting_for_evaluation') {
        this.awaitedCandidates.push(candidate);
      }
    }
    console.log(this.awaitedCandidates);
  }

  goToOnlineTest(_candidate) {
    console.log(_candidate)
    // _candidate.onlineTestId
    this.router.navigate(['/challenge/view/' +  _candidate.onlineTestId], { queryParams: { activeTab: 'candidates' } });
  }

  updateCandidateStatus(_candidate, status) {
  const r = confirm('Mark ' +_candidate.fullname+' as '+ status + '?');
  if (r === true) {
    _candidate.status = status;
    const ts = new Date();
    if (!_candidate.timeline) {
      _candidate.timeline = [];
    }
    _candidate.timeline.push({event: status, date: ts.toISOString()});

    this._candidateService.update(_candidate)
    .subscribe(
      (data) => {
        this.alertService.success(_candidate.fullname + ' is ' + status + ' successfully.');
        this.bootWidget();
      }
    )
    }
  }
  openEvaluateModal (index) {
    this.currentCandidate = this.awaitedCandidates[index];
    this.openModal(this.evaluateModal, {});
  }
  evaluateCurrentCandidateMarks(score) {
    this.currentCandidate['score'] = score.value;
    const ts = new Date();
    if (!this.currentCandidate['timeline']) {
        this.currentCandidate['timeline'] = [];
    }
    this.currentCandidate['timeline'].push({event: 'Evaluated', date: ts.toISOString()});
    this._candidateService.update(this.currentCandidate)
    .subscribe(
        (data) => {
            this.alertService.success(this.currentCandidate['fullname'] + '\'s score updated successfully.');
            const element = document.getElementById('evaluateModalCloseBtn') as any;

            element.click();
            this.bootWidget();
        }
    );
  }

  openModal(content, options) {
    this.modalService.open(content, options).result.then((result) => {
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

}
