import { Component, OnInit } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  public animatePulse = 'animated pulse';
  constructor() { }

  ngOnInit() {
    const that = this;
    window.onscroll = function() {that.checkElemIfVisible()};
  }

  scrollTo(id) {
    document.querySelector('#' + id).scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }

  goToLogin () {
    
  }

  checkElemIfVisible () {
    const realProj = document.querySelector('.real-project-section');
    this.assignCssClass(realProj, 'fadeInUp');
    const visOff = document.querySelector('.video-interview-section');
    this.assignCssClass(visOff, 'fadeInUp');
    const langSec = document.querySelector('.language-image');
    this.assignCssClass(langSec, 'zoomIn');
    const elemDiv0 = document.querySelector('#products-kk-0 .text');
    this.assignCssClass(elemDiv0, 'pulse');
    const elem0 = document.querySelector('#products-kk-0 .image');
    this.assignCssClass(elem0);
    const elemDiv1 = document.querySelector('#products-kk-1 .text');
    this.assignCssClass(elemDiv1, 'pulse');
    const elem1 = document.querySelector('#products-kk-1 .image');
    this.assignCssClass(elem1 , 'fadeInLeft');
    const elemDiv2 = document.querySelector('#products-kk-2 .text');
    this.assignCssClass(elemDiv2, 'pulse');
    const elem2 = document.querySelector('#products-kk-2 .image');
    this.assignCssClass(elem2);
    const press = document.querySelector('#press');
    this.assignCssClass(press, 'fadeInUp');
    const getStartdBtn = document.querySelector('#get-started-btn');
    this.assignCssClass(getStartdBtn, 'tada');
    
  }

  assignCssClass (elem, cssClass = 'fadeInRight') {
    if (this.isVisible(elem)) {
      setTimeout( function () {
        elem.classList.remove('visibility-off');
        elem.classList.add(cssClass);
      }, 10);
    }
  }
  isVisible (ele) {
    let { top, bottom } = ele.getBoundingClientRect();
    top = top + 200;
    bottom = bottom + 200;
    const vHeight = (window.innerHeight || document.documentElement.clientHeight);

    return (
      (top > 0 || bottom > 0) &&
      top < vHeight
    );
  }

}
