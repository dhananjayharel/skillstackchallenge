import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-centerpagecontent',
  templateUrl: './centerpagecontent.component.html',
  styleUrls: ['./centerpagecontent.component.scss']
})
export class CenterpagecontentComponent implements OnInit {
  @Input() iconClass: string;
  @Input() text: string;
  constructor() { }

  ngOnInit() {
  }

}
