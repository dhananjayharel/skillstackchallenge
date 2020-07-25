import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
//import { map } from 'rxjs/operators';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  providers: [NgbCarouselConfig]  // add NgbCarouselConfig to the component providers
})
export class TestimonialsComponent implements OnInit {


  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
      // config.showNavigationArrows = true;
      // config.showNavigationIndicators = true;
  }

  ngOnInit() {
  }

}
