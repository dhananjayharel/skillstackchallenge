import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../../../shared/services/index';
@Component({
  selector: 'app-summarystats',
  templateUrl: './summarystats.component.html',
  styleUrls: ['./summarystats.component.scss']
})
export class SummarystatsComponent implements OnInit {
  public respondedCandidates = 0;
  public invitedCandidates = 0;
  public perc = 0;
  constructor(private _candidateService: CandidateService) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this._candidateService.getCandidatesStats({'testStarted': true, 'uid': currentUser.userId})
    .subscribe((data) => {
      this.respondedCandidates = data.count;
      this._calculatePerc();
    });

    this._candidateService.getCandidatesStats({ 'uid': currentUser.userId})
    .subscribe((data) => {
      this.invitedCandidates = data.count;
      this._calculatePerc();
    });
  }

  _calculatePerc () {
    this.perc = (this.respondedCandidates * 100) / this.invitedCandidates;
  }

}
