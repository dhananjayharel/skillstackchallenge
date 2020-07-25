import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter} from '@angular/core';
import {Candidate} from 'models';

@Component({
  selector: 'app-candidatestatus',
  templateUrl: './candidatestatus.component.html',
  styleUrls: ['./candidatestatus.component.scss']
})
export class CandidatestatusComponent implements OnInit, OnChanges {
  @Input() candidates: Candidate[];
  @Output() onFilterInitiate: EventEmitter<any> = new EventEmitter();
  private status = ['Invited', 'Expired', 'In Evaluation', 'Accepted', 'Expired'];
  public candidateStatus: any;
  public results = [];
  public resultPrepared = false;
  public loading = true;
  constructor() { }

  ngOnInit() {
    if (this.candidates) {
      this.calculateCandidateStatus();
      this.assignPercentage();
      this.loading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.candidates.currentValue) {
      this.candidates = changes.candidates.currentValue;
      this.calculateCandidateStatus();
      this.assignPercentage();
      this.loading = false;
    }
  }

  calculateCandidateStatus() {
    this.candidateStatus = {
        'invited': 0,
		'waiting_for_evaluation': 0,
		'accepted': 0,
        'rejected': 0,
        'expired': 0
        

    };

    for (let i = 0; i < this.candidates.length; i++) {
        const status = this.candidates[i]['status'];

        if (status === 'invited' || status === 'Invited') {
            this.candidateStatus['invited']++;
        } else if (status === 'expired' || status === 'Expired') {
            this.candidateStatus['expired']++;
        } else if (status === 'Waiting for evaluation' || status === 'completed') {
            this.candidateStatus['waiting_for_evaluation']++;
        } else if (status === 'Accepted') {
            this.candidateStatus['accepted']++;
        } else if (status === 'Rejected') {
            this.candidateStatus['rejected']++;
        }
    }
  }

  assignPercentage() {
    this.results = [];
    for (const key in this.candidateStatus) {
      if (key === 'waiting_for_evaluation' ) {
        const perc = (this.candidateStatus[key] * 100) / this.candidates.length;
        this.results.push({
          class: 'default',
          perc: perc,
          key: 'waiting_for_evaluation',
          title: 'Evaluation Awaited',
          count: this.candidateStatus[key]
        });
      } else if  (key === 'invited' || key === 'Invited') {
        const perc = (this.candidateStatus[key] * 100) / this.candidates.length;
        this.results.push({
          class: 'info',
          perc: perc,
          key: 'invited',
          title: 'Invited',
          count: this.candidateStatus[key]
        });
      } else if  (key === 'expired') {
        const perc = (this.candidateStatus[key] * 100) / this.candidates.length;
        this.results.push({
          perc: perc,
          class: 'warning',
          key: 'expired',
          title: 'Expired',
          count: this.candidateStatus[key]
        });
      } else if  (key === 'accepted' || key === 'Accepted') {
        const perc = (this.candidateStatus[key] * 100) / this.candidates.length;
        this.results.push({
          class: 'success',
          perc: perc,
          key: 'accepted',
          title: 'Accepted',
          count: this.candidateStatus[key]
        });
      } else if  (key === 'rejected' || key === 'Rejected') {
        const perc = (this.candidateStatus[key] * 100) / this.candidates.length;
        this.results.push({
          class: 'danger',
          perc: perc,
          key: 'rejected',
          title: 'Rejected',
          count: this.candidateStatus[key]
        });
      }
    }

    this.resultPrepared = true;
  }

  openCandidatePanel (status) {
    
  }

  onFilter (key) {
    this.onFilterInitiate.emit(key);
  }

}
