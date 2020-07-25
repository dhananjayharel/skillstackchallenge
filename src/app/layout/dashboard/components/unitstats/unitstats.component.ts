import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../../../../shared/services/index';

@Component({
  selector: 'app-unitstats',
  templateUrl: './unitstats.component.html',
  styleUrls: ['./unitstats.component.scss']
})
export class UnitstatsComponent implements OnInit {
  @Input() mode: any;
  public Count: number = -1;
  public _modes = {
    'accepted': {
      title: 'ACCEPTED',
      icon: 'kk-icon--selected',
      param: 'Accepted'
    },
    'rejected': {
      title: 'REJECTED',
      icon: 'kk-icon--rejected',
      param: 'Rejected'
    },
    'waiting_for_evaluation': {
      title: 'UNDER EVALUATION',
      icon: 'kk-icon--evaluation',
      param: 'completed'
    }
  }
  constructor(private _candidateService: CandidateService) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this._candidateService.getCandidatesStats({'status': this._modes[this.mode].param, 'uid': currentUser.userId })
    .subscribe((data) => {
      this.Count = data.count;
    });

  }

}
