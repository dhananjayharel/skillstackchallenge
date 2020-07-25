import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../shared/services/index';
import { Candidate } from '../../models/';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-enrollchallenge',
  templateUrl: './enrollchallenge.component.html',
  styleUrls: ['./enrollchallenge.component.scss']
})
export class EnrollChallengeComponent implements OnInit {
  private testId: number;
  private model: Candidate;

  constructor(private route: ActivatedRoute,
    private router: Router, private candidateService: CandidateService) { }

  ngOnInit() {
    console.log('I am called')
    if (this.route.snapshot.paramMap.has('testid') && !isNaN(this.route.snapshot.params['testid'])) {
      this.testId = Number(this.route.snapshot.params['testid']);
      this._createInviteLink();
    }
  }

  _createInviteLink () {
    this.model = {} as Candidate;
    this.model['fullname'] = 'Anonymous user';
    this.model['email'] = 'anonymous@email.com';
    this.model['uid'] = 0;
    this.model.onlineTestId = this.testId;
    this.model.status = 'invited';
    this.candidateService.create(this.model)
      .subscribe(
          data => {
            if (data.testToken) {
              this.router.navigate(['/candidate/invite/' + data.testToken]);
            }
          },
          error => {
              const err = JSON.parse(error._body);
            });
  }

}
