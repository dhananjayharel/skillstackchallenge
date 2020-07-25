import {trigger, state, animate, style, transition} from '@angular/animations';

export function routerTransition() {
  return fadeInAndOut();
}

function fadeInAndOut() {
  return trigger('routerTransition', [
    transition(':enter', [
      style({opacity: 0}),
      animate(3000, style({opacity: 1}))
    ]),
    transition(':leave', [
      animate(3000, style({opacity: 0}))
    ])
  ]);
}