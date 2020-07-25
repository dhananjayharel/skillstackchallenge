import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss']
})
export class CountDownComponent implements OnInit {
    @Input() totalSecs: number;
    @Input() size = 'lg';
    @Input() type = 'success';
    @Output() onCountDownFinish:EventEmitter<string> = new EventEmitter();
    public hour: number = 0;
    public min: number = 0;
    public sec: number = 0;
    public countDownId: any;


    constructor() { }

   ngOnInit() {
       console.log(this.type);
      let that = this;
      this.countDownId = setInterval(() => {
               if(that.totalSecs >= 0){
                  that.computeAndShowTime();
                } else{
                  that.onCountDownFinish.emit('complete');
                  that.reset();
                  clearInterval(this.countDownId);
                }
              }, 1000);
      
   }
   
   computeAndShowTime(){
       this.hour = Math.floor(this.totalSecs / (60 * 60));
       this.min = Math.floor((this.totalSecs / (60) % 60));
       this.sec = Math.floor(this.totalSecs % (60));

       this.totalSecs-- ;
   }

   reset(){
     this.totalSecs = 0;
   }

   ngOnDestroy() {
    if (this.countDownId) {
      clearInterval(this.countDownId);
    }
}
}
