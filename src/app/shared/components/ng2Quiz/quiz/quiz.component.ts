import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { QuizService } from '../services/quiz.service';
import { HelperService } from '../services/helper.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  @Input() candidateName: any;
  @Input() testName: any;
  @Input() quizJson: any;
  @Input() mode:string = 'quiz';
  @Output() onQuizFinished: EventEmitter<string> = new EventEmitter();
  quizes: any[];
  quiz: Quiz = new Quiz(null);
  quizName: string;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 30000,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = 0;

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizes = this.quizService.getAll();
    this.quizName = this.quizes[0].id;
    if (this.mode === 'quiz') {
      this.loadQuiz(this.quizJson);
    } else {
      this.loadAnswers(this.quizJson);
    }
  }

  loadQuiz(quizJson: any) {
    // this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(this.quizJson);
      this.pager.count = this.quiz.questions.length;
      this.startTime = new Date();
      this.timer = setInterval(() => { this.tick(); }, 1000);

      try {
        this.duration = this.quizJson.config.duration;
      } catch (err) {
        this.duration = this.config.duration;
      }
    // });
    this.mode = 'quiz';
  }

  loadAnswers(quizJson: any) {
    const quiz = {
      'id': 0,
      'name': '',
      'description': '',
      'questions': JSON.parse(quizJson)
    }
    this.quiz = new Quiz(quiz);
  }

  tick() {
    const now = new Date();
    const diff = ((this.startTime.getTime() + (this.duration * 1000)) - now.getTime()) / 1000;

    if (diff <= 0) {
      this._submit();
    }
    this.ellapsedTime = this.parseTime(diff);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `<div class="d-inline-block"><img src="/assets/images/timer.png"></div>
            <div class="d-inline-block"><span class="hours">${mins}</span></div>
            <div class="d-inline-block"><div class="smalltext">m</div></div>						
            <div class="d-inline-block"><span class="seconds">${secs}</span></div>
            <div class="d-inline-block"><div class="smalltext">s</div></div>`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    } else if (this.mode === 'quiz' && index === this.pager.count) {
      this.mode = 'review';
      // if (r === true) {
      //   this.onSubmit();
      // }
    }
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmit() {
    const r = confirm('Submit Test - Are You Sure?');
    if (r === true) {
      this._submit();
      // this.mode = 'result';
    }
  }

  _submit () {
    let answers = [];
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));

    // Post your data to the server here. answers contains the questionId and the users' answer.

    this.onQuizFinished.emit(JSON.stringify(this.quiz.questions));
  }
}
