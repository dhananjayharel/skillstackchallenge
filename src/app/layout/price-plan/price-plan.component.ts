import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-plan',
  templateUrl: './price-plan.component.html',
  styleUrls: ['./price-plan.component.scss']
})
export class PricePlanComponent implements OnInit {
  currentUserData: any;
  isNoFreePlanTaken: boolean;
  isNoActivePlan: boolean;
  isActivePlan: boolean;
  inviteCounts: number;
  expiryDate: Date;
  constructor() { }

  ngOnInit() {
    this.currentUserData = JSON.parse(localStorage.getItem('currentUserData'));
    if (!this.currentUserData.orders) {
      this.isNoFreePlanTaken = true;
    } else if (
      !this.currentUserData.activePlan ||
      this.currentUserData.activePlan.endTime <= Math.floor(Date.now() / 1000)
    ) {
      this.isNoActivePlan = true;
    } else {
      this.isActivePlan = true;
      this.inviteCounts = this.currentUserData.activePlan.inviteUserCount;
      this.expiryDate = new Date(this.currentUserData.activePlan.endTime * 1000);
    }
  }

  triggerFeedbackWidget() {
    document.querySelector('#hello');
  }
}
