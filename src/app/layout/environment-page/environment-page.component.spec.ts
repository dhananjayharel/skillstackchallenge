import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironementPageComponent } from './environment-page.component';

describe('EnvironementPageComponent', () => {
  let component: EnvironementPageComponent;
  let fixture: ComponentFixture<EnvironementPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvironementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
