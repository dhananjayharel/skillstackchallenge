import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarystatsComponent } from './summarystats.component';

describe('SummarystatsComponent', () => {
  let component: SummarystatsComponent;
  let fixture: ComponentFixture<SummarystatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarystatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarystatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
